import * as R from 'ramda'
import * as AWS from 'aws-sdk'
import * as moment from 'moment'

const dynamo = new AWS.DynamoDB({ region: 'us-west-2' })

const indexTableName = 'nr-wsip-posts_index'
const dataTableName = 'nr-wsip-posts_data'

export async function getIndexItems(day: string): Promise<IndexItem[]> {
  const resp = await dynamo.query(toDynamoIndexQuery(day)).promise()
  return resp.Items.map(dynamoItemToIndexItem)
}

export const updateIndexTable = (posts: Post[]) => updateTable(posts, indexTableName, updateIndexItem)

export const updateDataTable = (posts: Post[]) => updateTable(posts, dataTableName, updateDataItem)

async function updateTable(posts: Post[], tableName, updater: TableUpdater) {
  console.log(`updating ${tableName} with ${posts.length} posts`)
  const updateResp = await Promise.all(posts.map(updater))
  const nonEmptyResps = updateResp.filter(r => !!Object.keys(r).length)
  if (nonEmptyResps) {
    console.log(`got non-empty responses:`)
    console.log(nonEmptyResps)
  } else {
    console.log(`success`)
  }
  return nonEmptyResps
}

function updateIndexItem(post: Post) {
  const item = postToIndexItem(post)
  const Key = { day: toDynamoValue(item.day), id: toDynamoValue(item.id) }
  const AttributeUpdates = R.mergeAll([
    toDynamoPut('last_updated', moment.utc().unix()),
    toDynamoPut('created_utc', item.created_utc),
    toDynamoPut('score', item.score)
  ])

  const params: any = { Key, AttributeUpdates, TableName: indexTableName }
  return dynamo.updateItem(params).promise()
}

function updateDataItem(post: Post) {
  const Key = { id: toDynamoValue(post.id) }
  const AttributeUpdates = R.mergeAll([
    toDynamoPut('subreddit', post.subreddit),
    toDynamoPut('title', post.title),
    toDynamoPut('author', post.author),
    toDynamoPut('selftext', post.selftext),
    toDynamoPut('permalink', post.permalink),
  ])

  const params: any = { Key, AttributeUpdates, TableName: dataTableName }
  return dynamo.updateItem(params).promise()
}

function dynamoItemToIndexItem(item): IndexItem {
  const last_updated = fromDynamoValue('last_updated', item)
  const created_utc = fromDynamoValue('created_utc', item)
  const score = fromDynamoValue('score', item)
  const day = fromDynamoValue('day', item)
  const id = fromDynamoValue('id', item)
  return { last_updated, created_utc, score, day, id } as IndexItem
}

function fromDynamoValue(name, dynamoItem): string | number {

  const isNumber = !!dynamoItem[name].N
  const type = isNumber ? 'N' : 'S'
  let val = dynamoItem[name][type]
  return isNumber ? parseInt(val) : val
}


function toDynamoPut(name: string, value: string | number) {
  const Action = 'PUT'
  const Value = toDynamoValue(value)
  return { [name]: { Action, Value } }
}

function toDynamoValue(value: string | number) {
  const isNumber = typeof value == 'number'
  const dynamoType = isNumber ? 'N' : 'S'
  value = isNumber ? value.toString() : value
  return { [dynamoType]: value }
}

function postToIndexItem(post: Post): IndexItem {
  let {created_utc, id, score} = post
  score = score ? score : 0
  const day = moment.unix(post.created_utc).format('YYYY-MM-DD')
  return { day, created_utc, id, score }
}

function toDynamoIndexQuery(day: string) {
  return {
    TableName: indexTableName,
    KeyConditionExpression: "#D = :day",
    ExpressionAttributeValues: { ":day": { S: day } },
    ExpressionAttributeNames: { "#D": "day" }
  }
}

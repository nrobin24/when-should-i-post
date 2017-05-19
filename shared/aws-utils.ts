import * as AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB()

const indexTableName = 'nr-wsip-posts_index'
const dataTableName = 'nr-wsip-posts_data'



export function updateIndexItem(day: string, post_id: string, created: number, last_updated: number) {
  const Key = {"day": {S: day}, "post_id": {S: post_id}}
  const params = {
    Key,
    TableName: indexTableName
  }
  return dynamo.updateItem(params).promise()

}

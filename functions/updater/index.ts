import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'

const fetch = require('node-fetch')

const snoowrap = require('snoowrap')

const credentials = require('credentials')
const dynasty = require('dynasty')(credentials.dynamo);

const indexTableName = 'nr-wsip-posts_index'
const dataTableName = 'nr-wsip-posts_data'

export async function handle(e, ctx, cb) {
  try {


    const postIds = await getPostIds()

    console.log('post ids sample')

    console.log(R.take(10, postIds))

    const batches = R.splitEvery(20, postIds)

    console.log(`found ${postIds.length} posts`)

    // Get data from reddit
    // const {clientId, clientSecret, refreshToken} = credentials
    // const r = new snoowrap({
    //   userAgent: credentials.userAgent,
    //   clientId,
    //   clientSecret,
    //   refreshToken
    // })

    // const postsNested = await Promise.all(batches.map(b => r.getSubmission(R.pluck('post_id', b))))
    // const posts = R.unnest(postsNested)

    const baseUrl = `https://www.reddit.com`
    let url = baseUrl + `/by_id/` + batches[0].map(i => 't3_' + i).join(',') + '.json'
    console.log('url', url)
    const posts = await fetch(url).then(r => r.json()).then(r => r.data.children)

    console.log(`got ${posts.length} posts`)

    console.log(`updating data table`)
    const postsUpdateResp = await Promise.all(posts.filter(p => p.id && p.score).map(p => updateScore(p.id, p.score)))

    // console.log(`got data for ${posts.length} posts`)
    // console.log(posts)

    cb(null, 'done')
  } catch (e) {
    console.log('error', e)
    cb(e)
  }
}

const indexTable = dynasty.table(indexTableName)
const dataTable = dynasty.table(dataTableName)

function getPostIds(): Promise<string[]> {
  const today = moment().format('YYYY-MM-DD')
  return indexTable.findAll(today).then(ps => ps.map(p => p.post_id))
}

function updateScore(post_id: string, score: number): Promise<any> {
  return dataTable.update(post_id, {score})
}

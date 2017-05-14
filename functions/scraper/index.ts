import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'

const snoowrap = require('snoowrap')
const credentials : Credentials = require('./credentials')
const promisify = require('promisify-node')

const s3 = new AWS.S3()
const s3Bucket = 'nr-wsip'

import {putObject, getObject, listKeys} from './aws-utils'
// const getObject = promisify(s3.getObject)


interface Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export async function handle(e, ctx, cb) {
  try {

    // Load recent posts that we already have data on from S3
    const today = moment().format('YYYY-MM-DD')
    console.log('today is: ', today)

    console.log("checking for daily data file")
    const keys = await listKeys(s3Bucket, today)
    const todayKeyExists = keys.filter(R.equals(today))

    let posts = []
    if (todayKeyExists.length) {
      const oldPosts = await getObject(s3Bucket, today)
      posts = posts.concat(oldPosts)
    }
    console.log(`already keeping track of ${posts.length} posts`)

    // Get data from reddit
    const {clientId, clientSecret, refreshToken} = credentials
    const r = new snoowrap({
      userAgent: 'wsip_scraper',
      clientId,
      clientSecret,
      refreshToken
    })

    const subs : String[] = await r.getPopularSubreddits({limit: 20}).map(s => s.display_name)
    const newPostsNested = await Promise.all(subs.map(s => r.getSubreddit(s).getNew({limit: 5})))
    const newPostsData = newPostsNested.reduce((p, c) => p.concat(c),[])

    const newPosts = newPostsData.map(p => {
      const {id, created, subreddit, ups} = p
      const lastUpdate = moment().unix()
      return {id, created, subreddit: subreddit.display_name, lastUpdate, ups}
    })

    // Add any unseen posts to existing data
    console.log(`fetched info from reddit on ${newPosts.length} posts`)
    const allPosts = R.uniqBy(R.prop('id'), R.concat(posts, newPosts))

    const newPostsFound = allPosts.length - posts.length
    console.log(`${newPostsFound} new posts found`)

    // Write data to file in S3
    if (newPostsFound) {
      console.log("putting posts to s3")
      const body: any = allPosts.reduce((p: string, c: string) => p + JSON.stringify(c) + '\n', "")
      const s3Response = await putObject(s3Bucket, today, body)
      console.log("got s3 response", s3Response)
    }

    cb(null, 'success')
  } catch (e) {
    console.log("error", e)
    cb(e)
  }
}

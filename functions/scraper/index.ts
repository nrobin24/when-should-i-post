import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'

const snoowrap = require('snoowrap')
const credentials : Credentials = require('./credentials')

const dynasty = require('dynasty')(credentials.dynamo);

const indexTableName = 'nr-wsip-posts_index'
const dataTableName = 'nr-wsip-posts_data'

interface Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
  dynamo: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }
}

interface Post {
  id: string;
  created: number;
  subreddit: string;
  ups: number;
  title: string;
  author: any;
  selftext: string;
  permalink: string;
}

export async function handle(e, ctx, cb) {
  try {

    // Load recent posts that we already have data on from S3
    const today = moment().format('YYYY-MM-DD')
    console.log('today is: ', today)

    // Get data from reddit
    const {clientId, clientSecret, refreshToken} = credentials
    const r = new snoowrap({
      userAgent: credentials.userAgent,
      clientId,
      clientSecret,
      refreshToken
    })

    const subs : String[] = await r.getPopularSubreddits({limit: 20}).map(s => s.display_name)
    const newPostsNested = await Promise.all(subs.map(s => r.getSubreddit(s).getNew({limit: 50})))

    const newPostsData = newPostsNested.reduce((p, c) => p.concat(c),[])

    const newPosts: Post[] = newPostsData.map(p => {
      const {id, created, subreddit, ups, title, author, selftext, permalink} = p
      const lastUpdate = moment().unix()
      return {id, created, subreddit: subreddit.display_name, title, author, selftext, permalink}
    })


    // upsert post ids in index table
    const indexTable = dynasty.table(indexTableName)
    const dataTable = dynasty.table(dataTableName)

    const toIndexUpdate = (post: Post) => indexTable.update(
      {hash: today, range: post.created}, {post_id: post.id}
    )

    console.log(`updating index table with ${newPosts.length} posts`)
    const updateIndexResp = await Promise.all(newPosts.map(toIndexUpdate))

    console.log(`got update index table response, non empty responses:`)
    const nonEmptyIndexResps = updateIndexResp.filter(r => !!Object.keys(r).length)
    console.log(nonEmptyIndexResps)

    // upsert other fields in data table
    const now = parseInt(moment().format('X'))

    const toDataUpdate = (post: Post) => {
      let {subreddit, id, title, author, selftext, permalink} = post

      // deal with special cases of author field
      if (typeof author == 'object' && author.name) {
        author = author.name
      } else if (typeof author == 'object' && author.RedditUser && author.RedditUser.name) {
        author = author.RedditUser.name
      }
      if (typeof author != 'string') {
        author = JSON.stringify(author)
      }

      // deal with empty selftext field
      if (selftext == "") {
        selftext = "emptyString"
      }

      const fields = ['subreddit', 'id', 'author', 'selftext', 'permalink']
      for (let field of fields) {
        if (typeof post[field] == 'undefined' && post[field]) {
          console.log(`post was skipped because of undefined field ${field}`)
          console.log('post:', post)
          return Promise.resolve({})
        }
      }
      return dataTable.update(id, {subreddit, title, author, selftext, permalink, lastUpdated: now}).catch(e => {
        console.log('error while processing post')
        console.log(post)
        throw new Error(e)
      })
    }

    console.log(`updating data table`)
    const updateDataResp = await Promise.all(newPosts.map(toDataUpdate))

    console.log(`got update data table response`)
    console.log(`got update data table response, non empty responses:`)
    const nonEmptyDataResps = updateDataResp.filter(r => !!Object.keys(r).length)
    // const nonEmptyDataResps = updateDataResp
    console.log(nonEmptyDataResps)

    cb(null, 'success')
  } catch (e) {
    console.log("error", e)
    cb(e)
  }
}

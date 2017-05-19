import * as moment from 'moment'
import {indexTable, dataTable} from './shared/aws-utils'
import {r} from './shared/reddit-utils'
const credentials: Credentials = require('./shared/credentials')

const numTopSubs = 20 // how many of the top subreddits to scrape
const numPostsPerSub = 50 // number of posts per subreddit to srape

export async function handle(e, ctx, cb) {
  try {
    const posts = await getPosts()
    await updateIndexTable(posts)
    await updateDataTable(posts)
    cb(null, 'success')
  } catch (e) {
    console.log("error", e)
    cb(e)
  }
}

async function getPosts(): Promise<Post[]> {
  // Get posts data
  const subs: String[] = await r.getPopularSubreddits({ limit: numTopSubs })
    .map(s => s.display_name)

  const newPostsNested = await Promise.all(subs.map(s => r.getSubreddit(s)
    .getNew({ limit: numPostsPerSub })))

  const newPostsData = newPostsNested.reduce((p, c) => p.concat(c), [])
  return newPostsData.map(p => {
    const {id, created, subreddit, ups, title, author, selftext, permalink} = p
    const lastUpdate = moment().unix()
    return { id, created, subreddit: subreddit.display_name, title, author, selftext, permalink }
  })
}

async function updateIndexTable(posts: Post[]) {
  const toIndexUpdate = (post: Post) => {
    const today = moment().format('YYYY-MM-DD')
    const now = moment().unix()
    const key = { hash: today, range: post.id }
    const val = { created: post.created, last_updated: now }
    return indexTable.update(key, val)
  }

  // Upsert post ids in index table
  console.log(`updating index table with ${posts.length} posts`)
  const updateIndexResp = await Promise.all(posts.map(toIndexUpdate))
  const nonEmptyIndexResps = updateIndexResp.filter(r => !!Object.keys(r).length)
  console.log(`got update index table response, non empty responses:`)
  console.log(nonEmptyIndexResps)
  return nonEmptyIndexResps
}

async function updateDataTable(posts: Post[]) {
  // upsert data fields in data table
  const toDataUpdate = (post: Post) => {
    const now = parseInt(moment().format('X'))
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

    return dataTable.update(id, { subreddit, title, author, selftext, permalink, lastUpdated: now })
      .catch(e => {
        console.log('error while processing post')
        console.log(post)
        throw new Error(e)
      })
  }

  console.log(`updating data table`)
  const updateDataResp = await Promise.all(posts.map(toDataUpdate))

  const nonEmptyDataResps = updateDataResp.filter(r => !!Object.keys(r).length)
  console.log(`got update data table response, non empty responses:`)
  console.log(nonEmptyDataResps)
}

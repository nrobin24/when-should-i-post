import * as moment from 'moment'
import * as R from 'ramda'
import {updateIndexTable, updateDataTable} from './shared/aws-utils'
import {getPopularSubreddits, getNewPosts} from './shared/reddit-utils'

const numTopSubs = 20 // how many of the top subreddits to scrape
const numPostsPerSub = 50 // number of posts per subreddit to srape

export async function handle(e, ctx, cb) {
  try {
    const popularSubs = await getPopularSubreddits(numTopSubs)
    const postsNested = await Promise.all(popularSubs.map(s => getNewPosts(numPostsPerSub, s)))
    const posts = R.unnest(postsNested)
    await updateIndexTable(posts)
    await updateDataTable(posts)
    cb(null, 'success')
  } catch (e) {
    console.log("error", e)
    cb(e)
  }
}

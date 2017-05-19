import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'
import {indexTable} from './shared/aws-utils'
import * as fetch from 'node-fetch'

const updateEligibilityRules = {
  minMinutesSinceCreated: (60 * 4),
  maxMinutesSinceCreated: (60 * 24),
  minMinutesSinceLastUpdated: (60 * 4)
}

export async function handle(e, ctx, cb) {
  try {
    const primaryKey = moment().format('YYYY-MM-DD')

    const postIds = await getTodayPostIds(primaryKey)
    const eligiblePostIds = postIds.filter(isEligiblePostId)
    console.log(`found ${eligiblePostIds.length} eligibile out of ${postIds.length} total posts for today in index table`)


    const posts = await getPostsFromReddit(eligiblePostIds.map(p => p.post_id))

    const eligiblePosts = posts.filter(p => p.id && p.score)
    console.log(`retreived ${eligiblePosts.length} eligible out of ${posts.length} total posts from reddit`)

    const updateIndexResp = await Promise.all(eligiblePosts.map(p => updateScore(primaryKey, p.id, p.score)))
    const nonEmptyIndexResps = updateIndexResp.filter(r => !!Object.keys(r).length)
    console.log(`got update index table response, non empty responses:`)
    console.log(nonEmptyIndexResps)

    cb(null, 'done')
  } catch (e) {
    console.log('error', e)
    cb(e)
  }
}

function isEligiblePostId(indexRow: IndexRow): boolean {
  const created = moment.unix(indexRow.created)
  const updated = moment.unix(indexRow.last_updated)
  const now = moment()
  const isAfterMinSinceCreated = now.isAfter(created.add(updateEligibilityRules.minMinutesSinceCreated, 'minutes'))
  const isBeforeMaxSinceCreated = now.isBefore(created.add(updateEligibilityRules.maxMinutesSinceCreated, 'minutes'))
  const isAfterMinSinceUpdated = now.isAfter(updated.add(updateEligibilityRules.minMinutesSinceLastUpdated))
  return isAfterMinSinceCreated && isBeforeMaxSinceCreated && isAfterMinSinceUpdated
}

function getTodayPostIds(primaryKey: string): Promise<IndexRow[]> {
  return indexTable.findAll(primaryKey)
}

function getPostsFromReddit(postIds: string[]): Promise<Post[]> {
  const postBatchSize = 20 // number of posts to retreive from reddit API in a single request
  const postIdBatches = R.splitEvery(postBatchSize, postIds)

  const baseUrl = `https://www.reddit.com`
  const urls = postIdBatches
    .map(batch => `${baseUrl}/by_id/${batch.map(i => `t3_${i}`).join(',')}.json`)

  const requests = urls.map(url => fetch(url).then(r => r.json().then(r => r.data.children)))
  return Promise.all(requests).then(R.pipe(R.unnest, R.pluck('data')))
}

function updateScore(primaryKey: string, post_id: string, score: number): Promise<any> {
  const now = moment().unix()
  return indexTable.update({ hash: primaryKey, range: post_id }, { score, last_updated: now })
}

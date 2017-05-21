import * as AWS from 'aws-sdk'
import * as moment from 'moment'
import * as R from 'ramda'
import {getIndexItems, updateIndexTable} from './shared/aws-utils'
import {getPostsById} from './shared/reddit-utils'
import * as fetch from 'node-fetch'

const updateEligibilityRules = {
  minMinutesSinceCreated: (60 * 4),
  maxMinutesSinceCreated: (60 * 25),
  minMinutesSinceLastUpdated: (60 * 4)
}

export async function handle(e, ctx, cb) {
  try {
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const yesterdayItems = await getIndexItems(yesterday)
    const today = moment().format('YYYY-MM-DD')
    const todayItems = await getIndexItems(today)
    const indexItems = R.concat(todayItems, yesterdayItems)

    const eligibleIds = indexItems.filter(isEligibleIndexItem).map(i => i.id)
    console.log(`found ${eligibleIds.length} eligibile out of ${indexItems.length} total posts for today in index table`)

    const posts = await getPostsById(eligibleIds)
    console.log(`retreived ${posts.length} posts from reddit`)

    await updateIndexTable(posts)
    cb(null, 'done')
  } catch (e) {
    console.log('error', e)
    cb(e)
  }
}

function isEligibleIndexItem(item: IndexItem): boolean {
  const created = moment.unix(item.created_utc)
  const updated = moment.unix(item.last_updated)
  const now = moment()
  const isAfterMinSinceCreated = now.isAfter(created.add(updateEligibilityRules.minMinutesSinceCreated, 'minutes'))
  const isBeforeMaxSinceCreated = now.isBefore(created.add(updateEligibilityRules.maxMinutesSinceCreated, 'minutes'))
  const isAfterMinSinceUpdated = now.isAfter(updated.add(updateEligibilityRules.minMinutesSinceLastUpdated))
  return isAfterMinSinceCreated && isBeforeMaxSinceCreated && isAfterMinSinceUpdated
}

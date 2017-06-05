import * as moment from 'moment'
import * as R from 'ramda'
import {getIndexItems, updateIndexTable} from './shared/aws-utils'
import {getPostsById} from './shared/reddit-utils'

const updateEligibilityRules = {
  minMinutesSinceCreated: (60 * 4),
  maxMinutesSinceCreated: (60 * 26),
  minMinutesSinceLastUpdated: (60 * 4)
}

export async function handle(e, ctx, cb) {
  try {
    const yesterday = moment.utc().subtract(1, 'days').format('YYYY-MM-DD')
    const yesterdayItems = await getIndexItems(yesterday)
    const today = moment.utc().format('YYYY-MM-DD')
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
  const now = moment.utc()
  const isAfterMinSinceCreated = now.isAfter(created.clone().add(updateEligibilityRules.minMinutesSinceCreated, 'minutes'))
  const isBeforeMaxSinceCreated = now.isBefore(created.clone().add(updateEligibilityRules.maxMinutesSinceCreated, 'minutes'))
  const isAfterMinSinceUpdated = now.isAfter(updated.clone().add(updateEligibilityRules.minMinutesSinceLastUpdated, 'minutes'))
  return isAfterMinSinceCreated && isBeforeMaxSinceCreated && isAfterMinSinceUpdated
}

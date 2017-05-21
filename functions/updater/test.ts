import {getIndexItems} from './shared/aws-utils'
import * as moment from 'moment'

async function main() {
  const today = moment().format('YYYY-MM-DD')
  const items = await getIndexItems(today)
  console.log(items[0])
}

main()

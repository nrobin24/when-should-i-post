const credentials: Credentials = require('./credentials')
const dynasty = require('dynasty')(credentials.dynamo);

const indexTableName = 'nr-wsip-posts_index'
const dataTableName = 'nr-wsip-posts_data'

export const indexTable = dynasty.table(indexTableName)
export const dataTable = dynasty.table(dataTableName)

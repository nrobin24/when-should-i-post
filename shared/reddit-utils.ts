import * as snoowrap from 'snoowrap'
const credentials: Credentials = require('./credentials')

const {clientId, clientSecret, refreshToken} = credentials
export const r = new snoowrap({ userAgent: credentials.userAgent, clientId, clientSecret, refreshToken })

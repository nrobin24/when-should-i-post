const snoowrap = require('snoowrap')
const credentials : Credentials = require('./credentials')

interface Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export async function handle(e, ctx, cb) {
  try {
    console.log("running")
    const {clientId, clientSecret, refreshToken} = credentials
    const r = new snoowrap({
      userAgent: 'wsip_scraper',
      clientId,
      clientSecret,
      refreshToken
    })
    // Printing a list of the titles on the front page
    const titles = await r.getHot().map(post => post.title);
    console.log('titles', titles)
    cb(null, titles)
  } catch (e) {
    console.log("error", e)
    cb(e)
  }
}

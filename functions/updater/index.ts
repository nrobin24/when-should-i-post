import * as AWS from 'aws-sdk'
const s3 = new AWS.S3()
const s3Bucket = 'nr-wsip'

export async function handle(e, ctx, cb) {
  try {

    cb(null, 'done')
  } catch (e) {
    console.log('error', e)
    cb(e)
  }
}

function readS3Files() {


}

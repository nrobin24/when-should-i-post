import {S3} from 'aws-sdk'

const s3 = new S3()

export function putObject(bucket: string, key: string, body: string) {
  const params = {
    Bucket: bucket,
    Key: key,
    ContentType: "application/json",
    Body: body
  }
  return new Promise((resolve, reject) => {
    const cb = (err, data) => err ? reject(err) : resolve(data)
    s3.putObject(params, cb)
  })
}

export function listKeys(bucket: string, prefix: string): Promise<string[]> {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };
  return new Promise((resolve, reject) => {
    const cb = (err, data) => err ? reject(err) : resolve(data)
    s3.listObjectsV2(params, cb)
  }).then((r : any) => r.Contents.map(c => c.Key))
}

export function getObject(bucket, key): Promise<any[]> {
  const params = {Bucket: bucket, Key: key}
  return new Promise((resolve, reject) => {
    const cb = (err, data) => {
      if (err) {
        reject(err)
      } else {
        const lines = data.Body.toString('utf-8').split('\n').filter(x => x).map(JSON.parse)
        resolve(lines)
      }
    }
    s3.getObject(params, cb)
  })
}

import * as fetch from 'node-fetch'
import * as R from 'ramda'

const baseUrl = `https://www.reddit.com`

export function getPopularSubreddits(limit: number): string[] {
  const url = `${baseUrl}/subreddits/popular.json?limit=${limit}`
  return fetch(url).then(r => r.json()).then(j => j.data.children.map(c => c.data.display_name))
}

export function getNewPosts(limit: number, subreddit: string): Promise<Post[]> {
  const url = `${baseUrl}/r/${subreddit}/new.json?limit=${limit}`
  return fetch(url).then(r => r.json()).then(listingResponseToPosts)
}

export async function getPostsById(postIds: string[]): Promise<Post[]> {
  const postBatchSize = 20 // number of posts to retreive from reddit API in a single request
  const postIdBatches = R.splitEvery(postBatchSize, postIds)

  const urls = postIdBatches
    .map(batch => `${baseUrl}/by_id/${batch.map(i => `t3_${i}`).join(',')}.json`)

  const responses = await Promise.all(urls.map(u => fetch(u).then(r => r.json())))
  const postsNested = responses.map(listingResponseToPosts)
  const posts = R.unnest(postsNested)
  return posts
}

function listingResponseToPosts(listingResponse): Post[] {
  const children = listingResponse.data.children
  const maybePosts = children.map(listingChildToPost)
  const posts = R.reject(R.isEmpty, maybePosts)
  return posts
}

function listingChildToPost(listingChild): Post | {} {
  const {data} = listingChild
  let {subreddit, id, title, author, selftext, permalink, created_utc, score} = data

  // deal with special cases of author field
  if (typeof author == 'object' && author.name) {
    author = author.name
  } else if (typeof author == 'object' && author.RedditUser && author.RedditUser.name) {
    author = author.RedditUser.name
  }
  if (typeof author != 'string') { author = JSON.stringify(author) }
  // deal with empty selftext field
  if (selftext == "") { selftext = "emptyString" }

  if (typeof subreddit == 'object' && subreddit.display_name) { subreddit = subreddit.display_name }

  const post = { subreddit, id, title, author, selftext, permalink, created_utc, score }

  const reqFields = ['subreddit', 'id', 'title', 'author', 'selftext', 'permalink', 'created_utc']

  for (let field of reqFields) {
    if (typeof post[field] == 'undefined') {
      console.log(`post was skipped because of undefined field ${field}`)
      console.log('post:', post)
      return {}
    }
  }

  return post
}

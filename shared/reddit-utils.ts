import * as fetch from 'node-fetch'

const baseUrl = `https://www.reddit.com`

export function getPopularSubreddits(limit: number) {
  const url = `${baseUrl}/subreddits/popular.json?limit=${limit}`
  return fetch(url).then(r => r.json()).then(j => j.data.children.map(c => c.data.display_name))
}

export function getNewPosts(limit: number, subreddit: string) {
  const url = `${baseUrl}/r/${subreddit}/new.json?limit=${limit}`
  return fetch(url).then(r => r.json()).then(j => j.data.children.map(c => c.data))
}

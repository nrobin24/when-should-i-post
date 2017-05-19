
interface Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
  dynamo: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }
}

interface Post {
  id: string;
  created: number;
  subreddit: string;
  ups: number;
  title: string;
  author: any;
  selftext: string;
  permalink: string;
  score: number;
}

interface IndexRow {
  day: string;
  created: number;
  post_id: string;
  last_updated: number;
  score: number;
}

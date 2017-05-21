interface Post {
  id: string;
  created_utc: number;
  subreddit: string;
  ups: number;
  title: string;
  author: any;
  selftext: string;
  permalink: string;
  score?: number;
}

interface IndexItem {
  day: string;
  created_utc: number;
  id: string;
  last_updated?: number;
  score?: number;
}

interface TableUpdater {
  (posts: Post): Promise<any>
}

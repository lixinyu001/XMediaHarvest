export type TweetMedia = {
  id: string
  url: string
  type: 'image' | 'video'
  thumbnailUrl?: string
}

export type TweetInfo = {
  id: string
  text: string
  author: string
  createdAt: string
  media: TweetMedia[]
}

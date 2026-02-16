export type DownloadHistoryItem = {
  id: string
  tweetId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  downloadedAt: number
}

import { sanitize } from 'sanitize-filename'

export function generateFilename(
  tweetId: string,
  mediaType: 'image' | 'video',
  timestamp: number
): string {
  const date = new Date(timestamp)
  const dateStr = date.toISOString().split('T')[0]
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-')

  const extension = mediaType === 'video' ? 'mp4' : 'jpg'
  const baseName = `twitter_${tweetId}_${dateStr}_${timeStr}`

  return sanitize(baseName) + '.' + extension
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

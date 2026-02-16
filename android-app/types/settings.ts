export type VideoQuality = 'high' | 'medium' | 'low'

export type AppSettings = {
  includeVideoThumbnail: boolean
  keyboardShortcut: boolean
  videoQuality: VideoQuality
}

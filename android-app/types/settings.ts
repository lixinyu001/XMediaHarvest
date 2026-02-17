export type VideoQuality = 'high' | 'medium' | 'low'

export type SaveLocation = 'downloads' | 'pictures' | 'custom'

export type AppSettings = {
  includeVideoThumbnail: boolean
  keyboardShortcut: boolean
  videoQuality: VideoQuality
  saveLocation: SaveLocation
  customSavePath?: string
}

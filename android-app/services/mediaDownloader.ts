import { PermissionsAndroid, Platform, Alert } from 'react-native'
import { RNFS } from 'react-native-fs'
import { CameraRoll } from '@react-native-community/cameraroll'
import type { TweetMedia } from '../types/tweet'
import type { VideoQuality } from '../types/settings'
import { ErrorLogger } from './errorLogger'

export class MediaDownloader {
  private readonly baseUrl = 'https://twitter.com/i/api/graphql'

  async fetchTweetMedia(tweetId: string): Promise<TweetMedia[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/TweetDetail?variables=${encodeURIComponent(
          JSON.stringify({ tweetId })
        )}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return this.parseMediaFromResponse(data)
    } catch (error) {
      ErrorLogger.logError('Failed to fetch tweet media', error as Error, { tweetId })
      throw error
    }
  }

  private parseMediaFromResponse(data: any): TweetMedia[] {
    const media: TweetMedia[] = []
    const tweet = data?.data?.tweetResult?.result?.tweet

    if (!tweet) return media

    const mediaEntities = tweet?.legacy?.extended_entities?.media || []

    for (const entity of mediaEntities) {
      if (entity.type === 'photo') {
        media.push({
          id: entity.id_str,
          url: entity.media_url_https,
          type: 'image',
        })
      } else if (entity.type === 'video' || entity.type === 'animated_gif') {
        const videoInfo = entity.video_info || entity.video_info
        const variants = videoInfo?.variants || []

        const bestVideo = this.selectVideoByQuality(variants)

        if (bestVideo) {
          media.push({
            id: entity.id_str,
            url: bestVideo.url,
            type: 'video',
            thumbnailUrl: entity.media_url_https,
          })
        }
      }
    }

    return media
  }

  private selectVideoByQuality(variants: any[]): any {
    const mp4Variants = variants.filter(
      (v: any) => v.content_type === 'video/mp4'
    )

    if (mp4Variants.length === 0) {
      return variants[0]
    }

    return mp4Variants.sort((a: any, b: any) => {
      const bitrateA = a.bitrate || 0
      const bitrateB = b.bitrate || 0
      return bitrateB - bitrateA
    })[0]
  }

  async downloadMedia(
    media: TweetMedia,
    quality?: VideoQuality,
    savePath?: string
  ): Promise<string> {
    try {
      if (Platform.OS === 'android') {
        await this.requestStoragePermission()
      }

      let downloadUrl = media.url

      if (media.type === 'video' && quality) {
        const variants = await this.fetchVideoVariants(media.url)
        const selectedVariant = this.selectVariantByQuality(variants, quality)
        if (selectedVariant) {
          downloadUrl = selectedVariant.url
        }
      }

      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const base64Data = await this.blobToBase64(blob)

      const filename = this.generateFilename(media, quality)
      const filePath = savePath 
        ? `${savePath}/${filename}`
        : `${RNFS.DownloadDirectoryPath}/${filename}`

      await RNFS.writeFile(filePath, base64Data, 'base64')

      if (Platform.OS === 'android') {
        try {
          await CameraRoll.save(filePath)
        } catch (saveError) {
          ErrorLogger.logError(
            'Failed to save to camera roll, file saved to download directory',
            saveError as Error
          )
          Alert.alert(
            'Download Complete',
            `File saved to:\n${filePath}`,
            [{ text: 'OK' }]
          )
        }
      }

      return filePath
    } catch (error) {
      ErrorLogger.logError('Failed to download media', error as Error, { media })
      throw error
    }
  }

  private async fetchVideoVariants(videoUrl: string): Promise<any[]> {
    try {
      const response = await fetch(videoUrl)
      const data = await response.json()
      const tweet = data?.data?.tweetResult?.result?.tweet
      const mediaEntities = tweet?.legacy?.extended_entities?.media || []

      for (const entity of mediaEntities) {
        if (entity.media_url_https === videoUrl) {
          const videoInfo = entity.video_info || entity.video_info
          return videoInfo?.variants || []
        }
      }

      return []
    } catch (error) {
      ErrorLogger.logError('Failed to fetch video variants', error as Error)
      return []
    }
  }

  private selectVariantByQuality(
    variants: any[],
    quality: VideoQuality
  ): any {
    const mp4Variants = variants.filter(
      (v: any) => v.content_type === 'video/mp4'
    )

    if (mp4Variants.length === 0) {
      return variants[0]
    }

    switch (quality) {
      case 'high':
        return mp4Variants.sort((a: any, b: any) => {
          const bitrateA = a.bitrate || 0
          const bitrateB = b.bitrate || 0
          return bitrateB - bitrateA
        })[0]

      case 'medium':
        const sorted = mp4Variants.sort((a: any, b: any) => {
          const bitrateA = a.bitrate || 0
          const bitrateB = b.bitrate || 0
          return bitrateB - bitrateA
        })
        const midIndex = Math.floor(sorted.length / 2)
        return sorted[midIndex] || sorted[0]

      case 'low':
        return mp4Variants.sort((a: any, b: any) => {
          const bitrateA = a.bitrate || 0
          const bitrateB = b.bitrate || 0
          return bitrateA - bitrateB
        })[0]

      default:
        return mp4Variants[0]
    }
  }

  private async requestStoragePermission(): Promise<void> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Storage permission not granted')
      }
    } catch (error) {
      ErrorLogger.logError('Failed to request storage permission', error as Error)
      throw error
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  private generateFilename(
    media: TweetMedia,
    quality?: VideoQuality
  ): string {
    const timestamp = Date.now()
    const qualitySuffix = media.type === 'video' && quality ? `_${quality}` : ''
    const extension = media.type === 'video' ? 'mp4' : 'jpg'
    return `twitter_media_${timestamp}${qualitySuffix}.${extension}`
  }
}

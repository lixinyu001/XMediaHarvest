import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { RNFS } from 'react-native-fs'
import { MediaDownloader } from '../services/mediaDownloader'
import { ConcurrentDownloader } from '../services/concurrentDownloader'
import { DownloadHistoryService } from '../services/downloadHistory'
import { SettingsService } from '../services/settings'
import { ErrorLogger } from '../services/errorLogger'
import type { TweetMedia } from '../types/tweet'
import type { VideoQuality } from '../types/settings'
import MediaViewer from '../components/MediaViewer'

type TweetDetailScreenProps = {
  navigation: StackNavigationProp<any>
  route: {
    params: {
      tweetId: string
    }
  }
}

export default function TweetDetailScreen({ navigation, route }: TweetDetailScreenProps) {
  const { tweetId } = route.params
  const [mediaList, setMediaList] = useState<TweetMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Set<number>>(new Set())
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('medium')
  const [savePath, setSavePath] = useState<string | undefined>(undefined)
  const [viewerMedia, setViewerMedia] = useState<{
    url: string
    type: 'image' | 'video'
    thumbnailUrl?: string
  } | null>(null)

  useEffect(() => {
    loadSettings()
    loadTweetMedia()
  }, [tweetId])

  const loadSettings = async () => {
    try {
      const settingsService = new SettingsService()
      const settings = await settingsService.getSettings()
      setVideoQuality(settings.videoQuality)
      
      if (settings.saveLocation === 'custom' && settings.customSavePath) {
        setSavePath(settings.customSavePath)
      } else if (settings.saveLocation === 'pictures') {
        setSavePath(RNFS.PicturesDirectoryPath)
      } else {
        setSavePath(undefined)
      }
    } catch (error) {
      ErrorLogger.logError('Failed to load settings', error as Error)
    }
  }

  const loadTweetMedia = async () => {
    setIsLoading(true)
    try {
      const downloader = new MediaDownloader()
      const media = await downloader.fetchTweetMedia(tweetId)
      setMediaList(media)
    } catch (error) {
      ErrorLogger.logError('Failed to load tweet media', error as Error, { tweetId })
      Toast.show({
        type: 'error',
        text1: 'Failed to load tweet media',
      })
      Alert.alert('Error', 'Failed to load tweet media. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMediaSelection = (index: number) => {
    const newSelected = new Set(selectedMedia)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedMedia(newSelected)
  }

  const openMediaViewer = (media: TweetMedia) => {
    setViewerMedia({
      url: media.url,
      type: media.type,
      thumbnailUrl: media.thumbnailUrl,
    })
  }

  const handleDownload = async () => {
    if (selectedMedia.size === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one media',
      })
      return
    }

    setIsDownloading(true)
    try {
      const downloader = new ConcurrentDownloader(3)
      const historyService = new DownloadHistoryService()

      const selectedMediaList = Array.from(selectedMedia).map(
        (index) => mediaList[index]
      )

      await downloader.downloadMultiple(
        selectedMediaList,
        videoQuality,
        (progress) => {
        },
        savePath
      )

      for (const media of selectedMediaList) {
        await historyService.addDownload({
          tweetId,
          mediaUrl: media.url,
          mediaType: media.type,
          downloadedAt: Date.now(),
        })
      }

      Toast.show({
        type: 'success',
        text1: `${selectedMedia.size} media downloaded successfully`,
        text2: 'Saved to your gallery',
      })

      setSelectedMedia(new Set())
    } catch (error) {
      ErrorLogger.logError('Failed to download media', error as Error, { tweetId })
      Toast.show({
        type: 'error',
        text1: 'Download failed',
        text2: 'Please try again',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text style={styles.loadingText}>Loading tweet media...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {mediaList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media found in this tweet</Text>
          </View>
        ) : (
          <View style={styles.mediaContainer}>
            {mediaList.map((media, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.mediaItem,
                  selectedMedia.has(index) && styles.mediaItemSelected,
                ]}
                onPress={() => openMediaViewer(media)}
                onLongPress={() => toggleMediaSelection(index)}
                delayLongPress={500}
              >
                {media.type === 'image' ? (
                  <Image
                    source={{ uri: media.url }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoText}>🎬 Video</Text>
                    <Text style={styles.qualityText}>
                      Quality: {videoQuality}
                    </Text>
                  </View>
                )}
                {selectedMedia.has(index) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
                <View style={styles.viewHint}>
                  <Text style={styles.viewHintText}>Tap to view</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {mediaList.length > 0 && (
        <TouchableOpacity
          style={[styles.downloadButton, isDownloading && styles.buttonDisabled]}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.downloadButtonText}>
              Download Selected ({selectedMedia.size})
            </Text>
          )}
        </TouchableOpacity>
      )}
      <Toast />
      <MediaViewer
        visible={viewerMedia !== null}
        media={viewerMedia}
        onClose={() => setViewerMedia(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15202B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#202336',
  },
  mediaItemSelected: {
    borderWidth: 3,
    borderColor: '#1DA1F2',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#38444D',
  },
  videoText: {
    fontSize: 24,
  },
  qualityText: {
    color: '#8899A6',
    fontSize: 12,
    marginTop: 5,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewHint: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewHintText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8899A6',
    fontSize: 18,
  },
  downloadButton: {
    backgroundColor: '#1DA1F2',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#38444D',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

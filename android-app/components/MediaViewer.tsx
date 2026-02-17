import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { Image } from 'react-native'
import Video from 'react-native-video'
import { Share } from 'react-native'
import Toast from 'react-native-toast-message'

type MediaViewerProps = {
  visible: boolean
  media: {
    url: string
    type: 'image' | 'video'
    thumbnailUrl?: string
  } | null
  onClose: () => void
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function MediaViewer({ visible, media, onClose }: MediaViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [videoPaused, setVideoPaused] = useState(false)

  const handleShare = async () => {
    if (!media) return

    try {
      await Share.share({
        message: media.url,
        url: media.url,
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to share',
      })
    }
  }

  const handleVideoError = (error: any) => {
    console.error('Video playback error:', error)
    Toast.show({
      type: 'error',
      text1: 'Failed to play video',
    })
  }

  if (!media) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <Text style={styles.headerButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Text style={styles.headerButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
          )}

          {media.type === 'image' ? (
            <Image
              source={{ uri: media.url }}
              style={styles.media}
              resizeMode="contain"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          ) : (
            <TouchableOpacity
              style={styles.videoContainer}
              activeOpacity={1}
              onPress={() => setVideoPaused(!videoPaused)}
            >
              <Video
                source={{ uri: media.url }}
                style={styles.media}
                resizeMode="contain"
                paused={videoPaused}
                controls
                onError={handleVideoError}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
              />
              {videoPaused && (
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.mediaType}>
            {media.type === 'image' ? '📷 Image' : '🎬 Video'}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(29, 161, 242, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mediaType: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
})

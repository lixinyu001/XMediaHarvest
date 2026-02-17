import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { parseTweetUrl } from '../utils/tweetParser'
import { useClipboardListener } from '../services/clipboardListener'
import { shareIntentListener } from '../services/shareIntentListener'
import Header from '../components/Header'

type HomeScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [tweetUrl, setTweetUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [clipboardMonitoringEnabled, setClipboardMonitoringEnabled] = useState(false)
  const [detectedTweetUrl, setDetectedTweetUrl] = useState('')

  useClipboardListener({
    onTwitterLinkDetected: (tweetId, url) => {
      if (clipboardMonitoringEnabled) {
        setDetectedTweetUrl(url)
        setTweetUrl(url)
        Toast.show({
          type: 'info',
          text1: 'Twitter link detected!',
          text2: 'Tap Download to fetch media',
        })
      }
    },
  })

  useEffect(() => {
    const removeListener = shareIntentListener.addListener((data) => {
      const { sharedUrl } = data
      const tweetId = parseTweetUrl(sharedUrl)
      
      if (tweetId) {
        setTweetUrl(sharedUrl)
        setDetectedTweetUrl(sharedUrl)
        Toast.show({
          type: 'success',
          text1: 'Link shared from Twitter!',
          text2: 'Tap Download to fetch media',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Twitter link',
          text2: 'Please share a valid tweet URL',
        })
      }
    })

    return () => {
      removeListener()
    }
  }, [])

  const handleDownload = async () => {
    if (!tweetUrl.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a tweet URL',
      })
      return
    }

    const tweetId = parseTweetUrl(tweetUrl)
    if (!tweetId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid tweet URL',
      })
      return
    }

    setIsLoading(true)
    try {
      navigation.navigate('TweetDetail', { tweetId })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load tweet',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title="Media Harvest"
        onSettings={() => navigation.navigate('Settings')}
        onErrorLogs={() => navigation.navigate('ErrorLogs')}
        onAbout={() => navigation.navigate('About')}
      />

      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Download Media</Text>
            <Text style={styles.welcomeSubtitle}>
              Paste a Twitter/X tweet URL to download images and videos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowHelpModal(true)}
          >
            <Text style={styles.helpButtonText}>How to get tweet URL?</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.clipboardToggle}
              onPress={() => {
                setClipboardMonitoringEnabled(!clipboardMonitoringEnabled)
                Toast.show({
                  type: clipboardMonitoringEnabled ? 'info' : 'success',
                  text1: clipboardMonitoringEnabled 
                    ? 'Clipboard monitoring disabled' 
                    : 'Clipboard monitoring enabled',
                  text2: clipboardMonitoringEnabled 
                    ? 'Paste links manually' 
                    : 'Auto-detect Twitter links',
                })
              }}
            >
              <View style={styles.toggleContainer}>
                <View style={[
                  styles.toggleIndicator,
                  clipboardMonitoringEnabled && styles.toggleIndicatorActive
                ]} />
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>
                    {clipboardMonitoringEnabled ? 'Auto-detect links' : 'Enable auto-detect'}
                  </Text>
                  <Text style={styles.toggleSubtitle}>
                    {clipboardMonitoringEnabled 
                      ? 'Monitoring clipboard for Twitter links' 
                      : 'Automatically detect links from clipboard'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {detectedTweetUrl && (
              <View style={styles.detectedUrlContainer}>
                <View style={styles.detectedUrlHeader}>
                  <Text style={styles.detectedUrlIcon}>🔗</Text>
                  <Text style={styles.detectedUrlLabel}>Detected Link</Text>
                </View>
                <Text style={styles.detectedUrlText} numberOfLines={2}>
                  {detectedTweetUrl}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tweet URL</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste tweet URL here..."
                placeholderTextColor="#657786"
                value={tweetUrl}
                onChangeText={setTweetUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.downloadButton, isLoading && styles.downloadButtonDisabled]}
              onPress={handleDownload}
              disabled={isLoading}
            >
              <Text style={styles.downloadButtonText}>
                {isLoading ? 'Loading...' : 'Download Media'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('DownloadHistory')}
              >
                <Text style={styles.quickActionIcon}>📋</Text>
                <Text style={styles.quickActionText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.quickActionIcon}>⚙️</Text>
                <Text style={styles.quickActionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Toast />

      <Modal
        visible={showHelpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHelpModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Get Tweet URL</Text>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Open X (Twitter)</Text>
                <Text style={styles.stepDescription}>
                  Open the X app or website on your device
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Find the Tweet</Text>
                <Text style={styles.stepDescription}>
                  Navigate to the tweet you want to download media from
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Tap Share Button</Text>
                <Text style={styles.stepDescription}>
                  Tap the share icon (arrow) on the tweet
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Copy Link</Text>
                <Text style={styles.stepDescription}>
                  Select "Copy link" or "Copy link to tweet"
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Paste in App</Text>
                <Text style={styles.stepDescription}>
                  Paste the URL in the input field above
                </Text>
              </View>
            </View>

            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>Example URL:</Text>
              <Text style={styles.exampleText}>
                https://x.com/username/status/1234567890
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15202B',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#8899A6',
    lineHeight: 22,
  },
  helpButton: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  helpButtonText: {
    color: '#1DA1F2',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#202336',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  clipboardToggle: {
    backgroundColor: '#38444D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#657786',
    marginRight: 12,
  },
  toggleIndicatorActive: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  toggleSubtitle: {
    color: '#8899A6',
    fontSize: 13,
  },
  detectedUrlContainer: {
    backgroundColor: '#38444D',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },
  detectedUrlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectedUrlIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detectedUrlLabel: {
    color: '#8899A6',
    fontSize: 13,
    fontWeight: '600',
  },
  detectedUrlText: {
    color: '#1DA1F2',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#8899A6',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#15202B',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#38444D',
  },
  downloadButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: '#38444D',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#202336',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#202336',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stepDescription: {
    color: '#8899A6',
    fontSize: 14,
  },
  exampleContainer: {
    backgroundColor: '#38444D',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  exampleTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exampleText: {
    color: '#8899A6',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  modalCloseButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

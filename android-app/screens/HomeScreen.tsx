import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableHighlight,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { parseTweetUrl } from '../utils/tweetParser'

type HomeScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [tweetUrl, setTweetUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Twitter Media Harvest</Text>
        <Text style={styles.subtitle}>
          Download media from Twitter/X tweets
        </Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <Text style={styles.helpButtonText}>How to get tweet URL?</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Paste tweet URL here..."
            value={tweetUrl}
            onChangeText={setTweetUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleDownload}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Download'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('DownloadHistory')}
        >
          <Text style={styles.historyButtonText}>View Download History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15202B',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8899A6',
    marginBottom: 20,
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
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#202336',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#38444D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#202336',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  historyButtonText: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  settingsButtonText: {
    color: '#8899A6',
    fontSize: 16,
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

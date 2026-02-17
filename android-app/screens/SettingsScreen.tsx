import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { SettingsService } from '../services/settings'
import { ErrorLogger } from '../services/errorLogger'
import Header from '../components/Header'
import type { VideoQuality, SaveLocation } from '../types/settings'

type SettingsScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [includeVideoThumbnail, setIncludeVideoThumbnail] = useState(false)
  const [keyboardShortcut, setKeyboardShortcut] = useState(false)
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('medium')
  const [saveLocation, setSaveLocation] = useState<SaveLocation>('downloads')
  const [customSavePath, setCustomSavePath] = useState('')
  const [showQualityModal, setShowQualityModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  const qualityOptions: { value: VideoQuality, label: string, description: string }[] = [
    {
      value: 'high',
      label: 'High Quality',
      description: 'Best video quality, larger file size',
    },
    {
      value: 'medium',
      label: 'Medium Quality',
      description: 'Balanced quality and file size',
    },
    {
      value: 'low',
      label: 'Low Quality',
      description: 'Smallest file size, lower quality',
    },
  ]

  const locationOptions: { value: SaveLocation, label: string, description: string }[] = [
    {
      value: 'downloads',
      label: 'Downloads',
      description: 'Save to Downloads folder',
    },
    {
      value: 'pictures',
      label: 'Pictures',
      description: 'Save to Pictures folder',
    },
    {
      value: 'custom',
      label: 'Custom',
      description: 'Choose custom save location',
    },
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settingsService = new SettingsService()
      const settings = await settingsService.getSettings()
      setIncludeVideoThumbnail(settings.includeVideoThumbnail)
      setKeyboardShortcut(settings.keyboardShortcut)
      setVideoQuality(settings.videoQuality)
      setSaveLocation(settings.saveLocation)
      setCustomSavePath(settings.customSavePath || '')
    } catch (error) {
      ErrorLogger.logError('Failed to load settings', error as Error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const settingsService = new SettingsService()
      await settingsService.saveSettings({
        includeVideoThumbnail,
        keyboardShortcut,
        videoQuality,
        saveLocation,
        customSavePath: saveLocation === 'custom' ? customSavePath : undefined,
      })
      Toast.show({
        type: 'success',
        text1: 'Settings saved',
      })
    } catch (error) {
      ErrorLogger.logError('Failed to save settings', error as Error)
      Toast.show({
        type: 'error',
        text1: 'Failed to save settings',
      })
    }
  }

  const handleViewErrorLogs = async () => {
    try {
      const logs = await ErrorLogger.getLogs()
      if (logs.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No error logs',
          text2: 'No errors have been logged yet',
        })
        return
      }
      
      navigation.navigate('ErrorLogs')
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load error logs',
      })
    }
  }

  const handleShareErrorLogs = async () => {
    try {
      await ErrorLogger.shareLogs()
      Toast.show({
        type: 'success',
        text1: 'Logs shared successfully',
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to share logs',
      })
    }
  }

  const handleClearErrorLogs = async () => {
    Alert.alert(
      'Clear Error Logs',
      'Are you sure you want to clear all error logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await ErrorLogger.clearLogs()
              Toast.show({
                type: 'success',
                text1: 'Error logs cleared',
              })
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Failed to clear error logs',
              })
            }
          },
        },
      ]
    )
  }

  const handleQualitySelect = (quality: VideoQuality) => {
    setVideoQuality(quality)
    setShowQualityModal(false)
  }

  const getCurrentQualityLabel = () => {
    const option = qualityOptions.find(opt => opt.value === videoQuality)
    return option ? option.label : 'Medium'
  }

  const getCurrentLocationLabel = () => {
    const option = locationOptions.find(opt => opt.value === saveLocation)
    return option ? option.label : 'Downloads'
  }

  const handleLocationSelect = (location: SaveLocation) => {
    setSaveLocation(location)
    setShowLocationModal(false)
  }

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        onSettings={() => {}}
        onErrorLogs={() => navigation.navigate('ErrorLogs')}
        onAbout={() => navigation.navigate('About')}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Video Thumbnail</Text>
              <Text style={styles.settingDescription}>
                Download thumbnail with videos
              </Text>
            </View>
            <Switch
              value={includeVideoThumbnail}
              onValueChange={setIncludeVideoThumbnail}
              trackColor={{ false: '#38444D', true: '#1DA1F2' }}
              thumbColor={includeVideoThumbnail ? '#1DA1F2' : '#657786'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Keyboard Shortcut</Text>
              <Text style={styles.settingDescription}>
                Quick download with keyboard
              </Text>
            </View>
            <Switch
              value={keyboardShortcut}
              onValueChange={setKeyboardShortcut}
              trackColor={{ false: '#38444D', true: '#1DA1F2' }}
              thumbColor={keyboardShortcut ? '#1DA1F2' : '#657786'}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowQualityModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Video Quality</Text>
              <Text style={styles.settingDescription}>
                {getCurrentQualityLabel()}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowLocationModal(true)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Save Location</Text>
              <Text style={styles.settingDescription}>
                {getCurrentLocationLabel()}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {saveLocation === 'custom' && (
            <View style={styles.customPathContainer}>
              <Text style={styles.settingLabel}>Custom Path</Text>
              <TextInput
                style={styles.customPathInput}
                value={customSavePath}
                onChangeText={setCustomSavePath}
                placeholder="/storage/emulated/0/CustomFolder"
                placeholderTextColor="#8899A6"
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Error Logs</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleViewErrorLogs}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>View Error Logs</Text>
              <Text style={styles.settingDescription}>
                Check application errors
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleShareErrorLogs}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Share Error Logs</Text>
              <Text style={styles.settingDescription}>
                Export and share logs
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleClearErrorLogs}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, styles.dangerLabel]}>
                Clear Error Logs
              </Text>
              <Text style={styles.settingDescription}>
                Delete all error logs
              </Text>
            </View>
            <Text style={[styles.arrow, styles.dangerArrow]}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      <Toast />

      <Modal
        visible={showQualityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQualityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowQualityModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
          >
            <Text style={styles.modalTitle}>Select Video Quality</Text>

            {qualityOptions.map((option) => (
              <TouchableHighlight
                key={option.value}
                underlayColor="#38444D"
                onPress={() => handleQualitySelect(option.value)}
                style={[
                  styles.optionItem,
                  videoQuality === option.value && styles.optionItemSelected,
                ]}
              >
                <View style={styles.optionItemContent}>
                  <View style={styles.optionItemLeft}>
                    <Text style={styles.optionItemLabel}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionItemDesc}>
                      {option.description}
                    </Text>
                  </View>
                  {videoQuality === option.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQualityModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
          >
            <Text style={styles.modalTitle}>Select Save Location</Text>

            {locationOptions.map((option) => (
              <TouchableHighlight
                key={option.value}
                underlayColor="#38444D"
                onPress={() => handleLocationSelect(option.value)}
                style={[
                  styles.optionItem,
                  saveLocation === option.value && styles.optionItemSelected,
                ]}
              >
                <View style={styles.optionItemContent}>
                  <View style={styles.optionItemLeft}>
                    <Text style={styles.optionItemLabel}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionItemDesc}>
                      {option.description}
                    </Text>
                  </View>
                  {saveLocation === option.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8899A6',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: '#202336',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dangerItem: {
    backgroundColor: 'rgba(224, 36, 94, 0.1)',
    borderWidth: 1,
    borderColor: '#E0245E',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dangerLabel: {
    color: '#E0245E',
  },
  settingDescription: {
    color: '#8899A6',
    fontSize: 13,
  },
  arrow: {
    fontSize: 24,
    color: '#657786',
  },
  dangerArrow: {
    color: '#E0245E',
  },
  customPathContainer: {
    backgroundColor: '#202336',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  customPathInput: {
    backgroundColor: '#38444D',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#38444D',
  },
  saveButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#657786',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionItem: {
    backgroundColor: '#38444D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  optionItemSelected: {
    backgroundColor: '#1DA1F2',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  optionItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionItemLeft: {
    flex: 1,
  },
  optionItemLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionItemDesc: {
    color: '#8899A6',
    fontSize: 13,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#1DA1F2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#38444D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

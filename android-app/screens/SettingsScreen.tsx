import React, { useState } from 'react'
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
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { SettingsService } from '../services/settings'
import { ErrorLogger } from '../services/errorLogger'
import type { VideoQuality } from '../types/settings'

type SettingsScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [includeVideoThumbnail, setIncludeVideoThumbnail] = useState(false)
  const [keyboardShortcut, setKeyboardShortcut] = useState(false)
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('medium')
  const [showQualityModal, setShowQualityModal] = useState(false)

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

  const loadSettings = async () => {
    try {
      const settingsService = new SettingsService()
      const settings = await settingsService.getSettings()
      setIncludeVideoThumbnail(settings.includeVideoThumbnail)
      setKeyboardShortcut(settings.keyboardShortcut)
      setVideoQuality(settings.videoQuality)
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
      Alert.alert('Error Logs', JSON.stringify(logs, null, 2))
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load error logs',
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>
              Download Video Thumbnail
            </Text>
            <Text style={styles.settingDescription}>
              Download thumbnail when media is video
            </Text>
          </View>
          <Switch
            value={includeVideoThumbnail}
            onValueChange={setIncludeVideoThumbnail}
            trackColor={{ false: '#38444D', true: '#1DA1F2' }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>
              Keyboard Shortcut
            </Text>
            <Text style={styles.settingDescription}>
              Use keyboard shortcut to trigger download
            </Text>
          </View>
          <Switch
            value={keyboardShortcut}
            onValueChange={setKeyboardShortcut}
            trackColor={{ false: '#38444D', true: '#1DA1F2' }}
          />
        </View>

        <TouchableOpacity
          style={styles.qualityButton}
          onPress={() => setShowQualityModal(true)}
        >
          <View style={styles.qualityButtonContent}>
            <View style={styles.qualityInfo}>
              <Text style={styles.settingLabel}>Video Quality</Text>
              <Text style={styles.settingDescription}>
                {getCurrentQualityLabel()}
              </Text>
            </View>
            <Text style={styles.qualityArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Error Logs</Text>

        <TouchableOpacity style={styles.logButton} onPress={handleViewErrorLogs}>
          <Text style={styles.logButtonText}>View Error Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearLogsButton}
          onPress={handleClearErrorLogs}
        >
          <Text style={styles.clearLogsButtonText}>Clear Error Logs</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Video Quality</Text>

            {qualityOptions.map((option) => (
              <TouchableHighlight
                key={option.value}
                underlayColor="#38444D"
                onPress={() => handleQualitySelect(option.value)}
                style={[
                  styles.qualityOption,
                  videoQuality === option.value && styles.qualityOptionSelected,
                ]}
              >
                <View style={styles.qualityOptionContent}>
                  <Text style={styles.qualityOptionLabel}>
                    {option.label}
                  </Text>
                  <Text style={styles.qualityOptionDesc}>
                    {option.description}
                  </Text>
                  {videoQuality === option.value && (
                    <Text style={styles.qualityCheckmark}>✓</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  settingItem: {
    backgroundColor: '#202336',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingDescription: {
    color: '#8899A6',
    fontSize: 14,
  },
  qualityButton: {
    backgroundColor: '#202336',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  qualityButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityInfo: {
    flex: 1,
  },
  qualityArrow: {
    fontSize: 24,
    color: '#8899A6',
  },
  saveButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#38444D',
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  logButton: {
    backgroundColor: '#202336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  logButtonText: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearLogsButton: {
    backgroundColor: '#E0245E',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  clearLogsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#8899A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0.7)',
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
  qualityOption: {
    backgroundColor: '#38444D',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  qualityOptionSelected: {
    backgroundColor: '#1DA1F2',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  qualityOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityOptionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qualityOptionDesc: {
    color: '#8899A6',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  qualityCheckmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#38444D',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { AppSettings, VideoQuality } from '../types/settings'
import { ErrorLogger } from './errorLogger'

const SETTINGS_KEY = '@media_harvest:settings'

const defaultSettings: AppSettings = {
  includeVideoThumbnail: false,
  keyboardShortcut: false,
  videoQuality: 'medium',
}

export class SettingsService {
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY)
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
    } catch (error) {
      ErrorLogger.logError('Failed to get settings', error as Error)
      return defaultSettings
    }
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings()
      const newSettings = { ...currentSettings, ...settings }
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
    } catch (error) {
      ErrorLogger.logError('Failed to save settings', error as Error)
      throw error
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings))
    } catch (error) {
      ErrorLogger.logError('Failed to reset settings', error as Error)
      throw error
    }
  }

  async updateVideoQuality(quality: VideoQuality): Promise<void> {
    await this.saveSettings({ videoQuality: quality })
  }
}

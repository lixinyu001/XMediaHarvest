import AsyncStorage from '@react-native-async-storage/async-storage'
import type { DownloadHistoryItem } from '../types/downloadHistory'
import { ErrorLogger } from './errorLogger'

const HISTORY_KEY = '@media_harvest:download_history'

export class DownloadHistoryService {
  async addDownload(item: DownloadHistoryItem): Promise<void> {
    try {
      const history = await this.getHistory()
      history.unshift({
        ...item,
        id: Date.now().toString(),
      })

      const limitedHistory = history.slice(0, 100)
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory))
    } catch (error) {
      ErrorLogger.logError('Failed to add download to history', error as Error)
      throw error
    }
  }

  async getHistory(): Promise<DownloadHistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      ErrorLogger.logError('Failed to get download history', error as Error)
      return []
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY)
    } catch (error) {
      ErrorLogger.logError('Failed to clear download history', error as Error)
      throw error
    }
  }

  async deleteDownload(id: string): Promise<void> {
    try {
      const history = await this.getHistory()
      const filtered = history.filter(item => item.id !== id)
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
    } catch (error) {
      ErrorLogger.logError('Failed to delete download from history', error as Error)
      throw error
    }
  }
}

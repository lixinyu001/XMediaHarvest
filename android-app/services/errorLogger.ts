import AsyncStorage from '@react-native-async-storage/async-storage'
import { Share, Platform } from 'react-native'
import { RNFS } from 'react-native-fs'
import dayjs from 'dayjs'

export type ErrorLogEntry = {
  id: string
  timestamp: number
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  context?: Record<string, unknown>
}

const ERROR_LOGS_KEY = '@media_harvest:error_logs'
const MAX_ERROR_LOGS = 100

export class ErrorLogger {
  static async logError(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    const entry: ErrorLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      level: 'error',
      message,
      stack: error?.stack,
      context,
    }

    await this.addLog(entry)
    console.error(`[Error] ${message}`, error, context)
  }

  static async logWarning(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    const entry: ErrorLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      level: 'warning',
      message,
      context,
    }

    await this.addLog(entry)
    console.warn(`[Warning] ${message}`, context)
  }

  static async logInfo(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    const entry: ErrorLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      level: 'info',
      message,
      context,
    }

    await this.addLog(entry)
    console.info(`[Info] ${message}`, context)
  }

  private static async addLog(entry: ErrorLogEntry): Promise<void> {
    try {
      const logs = await this.getLogs()
      logs.unshift(entry)

      const limitedLogs = logs.slice(0, MAX_ERROR_LOGS)
      await AsyncStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(limitedLogs))
    } catch (error) {
      console.error('Failed to save error log:', error)
    }
  }

  static async getLogs(): Promise<ErrorLogEntry[]> {
    try {
      const data = await AsyncStorage.getItem(ERROR_LOGS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get error logs:', error)
      return []
    }
  }

  static async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ERROR_LOGS_KEY)
    } catch (error) {
      console.error('Failed to clear error logs:', error)
      throw error
    }
  }

  static async exportLogs(): Promise<string> {
    const logs = await this.getLogs()
    
    const formattedLogs = logs.map(log => {
      const timestamp = dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')
      const contextStr = log.context ? `\nContext: ${JSON.stringify(log.context, null, 2)}` : ''
      const stackStr = log.stack ? `\nStack:\n${log.stack}` : ''
      
      return `[${log.level.toUpperCase()}] ${timestamp}\n${log.message}${contextStr}${stackStr}\n---`
    }).join('\n\n')
    
    const header = `TwitterMediaHarvest Error Logs\nGenerated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\nPlatform: ${Platform.OS} ${Platform.Version}\n\n`
    
    return header + formattedLogs
  }

  static async shareLogs(): Promise<void> {
    try {
      const logs = await this.exportLogs()
      
      const fileName = `twitter_media_harvest_logs_${Date.now()}.txt`
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`
      
      await RNFS.writeFile(filePath, logs, 'utf8')
      
      await Share.share({
        message: `Error Logs from TwitterMediaHarvest\n\n${logs}`,
        url: Platform.OS === 'android' ? `file://${filePath}` : undefined,
      })
    } catch (error) {
      console.error('Failed to share logs:', error)
      throw error
    }
  }

  static async getLogsByLevel(level: ErrorLogEntry['level']): Promise<ErrorLogEntry[]> {
    const logs = await this.getLogs()
    return logs.filter(log => log.level === level)
  }

  static async getRecentLogs(count: number = 10): Promise<ErrorLogEntry[]> {
    const logs = await this.getLogs()
    return logs.slice(0, count)
  }

  static async getLogsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ErrorLogEntry[]> {
    const logs = await this.getLogs()
    return logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= startDate && logDate <= endDate
    })
  }
}

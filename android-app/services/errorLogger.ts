import AsyncStorage from '@react-native-async-storage/async-storage'

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
    return JSON.stringify(logs, null, 2)
  }
}

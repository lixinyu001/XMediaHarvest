import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { ErrorLogger, ErrorLogEntry } from '../services/errorLogger'
import dayjs from 'dayjs'

type ErrorLogsScreenProps = {
  navigation: StackNavigationProp<any>
}

type LogLevel = 'all' | 'error' | 'warning' | 'info'

export default function ErrorLogsScreen({ navigation }: ErrorLogsScreenProps) {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ErrorLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>('all')

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    if (selectedLevel === 'all') {
      setFilteredLogs(logs)
    } else {
      setFilteredLogs(logs.filter(log => log.level === selectedLevel))
    }
  }, [selectedLevel, logs])

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const errorLogs = await ErrorLogger.getLogs()
      setLogs(errorLogs)
      setFilteredLogs(errorLogs)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load error logs',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearLogs = () => {
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
              setLogs([])
              setFilteredLogs([])
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

  const handleShareLogs = async () => {
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

  const getLevelColor = (level: ErrorLogEntry['level']) => {
    switch (level) {
      case 'error':
        return '#E0245E'
      case 'warning':
        return '#FFAD1F'
      case 'info':
        return '#17BF63'
      default:
        return '#8899A6'
    }
  }

  const getLevelIcon = (level: ErrorLogEntry['level']) => {
    switch (level) {
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📝'
    }
  }

  const renderLogItem = (log: ErrorLogEntry) => (
    <View key={log.id} style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(log.level) }]}>
          <Text style={styles.levelBadgeText}>{getLevelIcon(log.level)}</Text>
        </View>
        <Text style={styles.logTimestamp}>
          {dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      </View>
      <Text style={styles.logMessage}>{log.message}</Text>
      {log.context && (
        <View style={styles.logContext}>
          <Text style={styles.logContextTitle}>Context:</Text>
          <Text style={styles.logContextText}>
            {JSON.stringify(log.context, null, 2)}
          </Text>
        </View>
      )}
      {log.stack && (
        <View style={styles.logStack}>
          <Text style={styles.logStackTitle}>Stack Trace:</Text>
          <Text style={styles.logStackText} numberOfLines={3}>
            {log.stack}
          </Text>
        </View>
      )}
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text style={styles.loadingText}>Loading error logs...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Error Logs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShareLogs}>
            <Text style={styles.headerButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleClearLogs}>
            <Text style={[styles.headerButtonText, styles.clearButtonText]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All ({logs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'error' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('error')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === 'error' && styles.filterButtonTextActive,
            ]}
          >
            Errors ({logs.filter(l => l.level === 'error').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'warning' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('warning')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === 'warning' && styles.filterButtonTextActive,
            ]}
          >
            Warnings ({logs.filter(l => l.level === 'warning').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'info' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('info')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedLevel === 'info' && styles.filterButtonTextActive,
            ]}
          >
            Info ({logs.filter(l => l.level === 'info').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logsContainer}>
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No error logs found</Text>
            <Text style={styles.emptySubtext}>
              {selectedLevel === 'all'
                ? 'No errors have been logged yet'
                : `No ${selectedLevel} logs found`}
            </Text>
          </View>
        ) : (
          filteredLogs.map(renderLogItem)
        )}
      </ScrollView>
      <Toast />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#202336',
    borderBottomWidth: 1,
    borderBottomColor: '#38444D',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
  headerButtonText: {
    color: '#1DA1F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#E0245E',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#202336',
    borderBottomWidth: 1,
    borderBottomColor: '#38444D',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#38444D',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1DA1F2',
  },
  filterButtonText: {
    color: '#8899A6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  logsContainer: {
    flex: 1,
  },
  logItem: {
    backgroundColor: '#202336',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38444D',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logTimestamp: {
    color: '#8899A6',
    fontSize: 12,
    flex: 1,
  },
  logMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  logContext: {
    backgroundColor: '#38444D',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  logContextTitle: {
    color: '#8899A6',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logContextText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  logStack: {
    backgroundColor: '#38444D',
    padding: 10,
    borderRadius: 8,
  },
  logStackTitle: {
    color: '#8899A6',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logStackText: {
    color: '#E0245E',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#8899A6',
    fontSize: 14,
    textAlign: 'center',
  },
})

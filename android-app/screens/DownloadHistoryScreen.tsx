import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { DownloadHistoryService } from '../services/downloadHistory'
import type { DownloadHistoryItem } from '../types/downloadHistory'

type DownloadHistoryScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function DownloadHistoryScreen({ navigation }: DownloadHistoryScreenProps) {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const historyService = new DownloadHistoryService()
      const items = await historyService.getHistory()
      setHistory(items)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load download history',
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadHistory()
    setIsRefreshing(false)
  }

  const handleClearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all download history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const historyService = new DownloadHistoryService()
              await historyService.clearHistory()
              setHistory([])
              Toast.show({
                type: 'success',
                text1: 'History cleared',
              })
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Failed to clear history',
              })
            }
          },
        },
      ]
    )
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No download history</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.tweetId}>Tweet ID: {item.tweetId}</Text>
                  <Text style={styles.mediaType}>
                    Type: {item.mediaType}
                  </Text>
                  <Text style={styles.date}>
                    {formatDate(item.downloadedAt)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {history.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}
      <Toast />
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
  listContainer: {
    padding: 10,
  },
  historyItem: {
    backgroundColor: '#202336',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
  },
  itemContent: {
    flex: 1,
  },
  tweetId: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mediaType: {
    color: '#8899A6',
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    color: '#8899A6',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#8899A6',
    fontSize: 18,
  },
  clearButton: {
    backgroundColor: '#E0245E',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

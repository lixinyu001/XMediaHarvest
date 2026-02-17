import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'
import { DownloadHistoryService } from '../services/downloadHistory'
import type { DownloadHistoryItem } from '../types/downloadHistory'
import Header from '../components/Header'

type DownloadHistoryScreenProps = {
  navigation: StackNavigationProp<any>
}

export default function DownloadHistoryScreen({ navigation }: DownloadHistoryScreenProps) {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DownloadHistoryItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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

  const handleItemPress = (item: DownloadHistoryItem) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getMediaIcon = (mediaType: string) => {
    return mediaType === 'video' ? '🎬' : '🖼️'
  }

  return (
    <View style={styles.container}>
      <Header
        title="Download History"
        onSettings={() => navigation.navigate('Settings')}
        onErrorLogs={() => navigation.navigate('ErrorLogs')}
        onAbout={() => navigation.navigate('About')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Download History</Text>
            <Text style={styles.emptySubtitle}>
              Downloaded media will appear here
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.emptyButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>{history.length} items</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemLeft}>
                  <Text style={styles.mediaIcon}>{getMediaIcon(item.mediaType)}</Text>
                  <View style={styles.itemContent}>
                    <Text style={styles.tweetId} numberOfLines={1}>
                      Tweet: {item.tweetId}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.downloadedAt)}</Text>
                  </View>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDetailModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
          >
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{getMediaIcon(selectedItem.mediaType)}</Text>
                  <Text style={styles.modalTitle}>Download Details</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Tweet ID</Text>
                  <Text style={styles.detailValue}>{selectedItem.tweetId}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Media Type</Text>
                  <Text style={styles.detailValue}>{selectedItem.mediaType}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Downloaded At</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedItem.downloadedAt).toLocaleString()}
                  </Text>
                </View>

                {selectedItem.metadata && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Metadata</Text>
                    <Text style={styles.detailValue}>
                      {JSON.stringify(selectedItem.metadata, null, 2)}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowDetailModal(false)
                    navigation.navigate('TweetDetail', { tweetId: selectedItem.tweetId })
                  }}
                >
                  <Text style={styles.modalButtonText}>View Tweet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowDetailModal(false)}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
  scrollContent: {
    flexGrow: 1,
  },
  listContainer: {
    padding: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    color: '#8899A6',
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    color: '#E0245E',
    fontSize: 14,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#202336',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mediaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  tweetId: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#8899A6',
    fontSize: 13,
  },
  arrow: {
    color: '#657786',
    fontSize: 24,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    color: '#8899A6',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    color: '#8899A6',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#38444D',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: '#8899A6',
  },
})

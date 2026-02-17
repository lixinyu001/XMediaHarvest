import { NativeEventEmitter, NativeModules, Platform } from 'react-native'

type SharedUrlEvent = {
  sharedUrl: string
}

class ShareIntentListener {
  private eventEmitter: NativeEventEmitter | null = null
  private listeners: Map<string, (data: SharedUrlEvent) => void> = new Map()

  constructor() {
    if (Platform.OS === 'android') {
      try {
        const { DeviceEventEmitter } = NativeModules
        this.eventEmitter = new NativeEventEmitter(DeviceEventEmitter)
      } catch (error) {
        console.error('Failed to initialize ShareIntentListener:', error)
      }
    }
  }

  addListener(callback: (data: SharedUrlEvent) => void): () => void {
    if (!this.eventEmitter) {
      return () => {}
    }

    const listenerId = Date.now().toString()
    this.listeners.set(listenerId, callback)

    const subscription = this.eventEmitter.addListener('SharedUrl', (data: SharedUrlEvent) => {
      callback(data)
    })

    return () => {
      subscription.remove()
      this.listeners.delete(listenerId)
    }
  }
}

export const shareIntentListener = new ShareIntentListener()

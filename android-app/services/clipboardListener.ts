import React, { useState, useEffect, useRef } from 'react'
import { Clipboard, AppState, AppStateStatus } from 'react-native'
import { parseTweetUrl } from '../utils/tweetParser'

export interface ClipboardListenerCallbacks {
  onTwitterLinkDetected: (tweetId: string, url: string) => void
}

export class ClipboardListener {
  private callbacks: ClipboardListenerCallbacks
  private lastClipboardContent: string = ''
  private appState: AppStateStatus = 'active'
  private checkInterval: NodeJS.Timeout | null = null

  constructor(callbacks: ClipboardListenerCallbacks) {
    this.callbacks = callbacks
  }

  start() {
    this.appState = AppState.currentState

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      this.appState = nextAppState
    })

    this.checkInterval = setInterval(() => {
      this.checkClipboard()
    }, 1000)

    return () => {
      this.stop()
      subscription.remove()
    }
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private async checkClipboard() {
    if (this.appState !== 'active') {
      return
    }

    try {
      const content = await Clipboard.getString()

      if (content && content !== this.lastClipboardContent) {
        this.lastClipboardContent = content

        const tweetId = parseTweetUrl(content)
        if (tweetId) {
          this.callbacks.onTwitterLinkDetected(tweetId, content)
        }
      }
    } catch (error) {
      console.error('Failed to check clipboard:', error)
    }
  }
}

export const useClipboardListener = (callbacks: ClipboardListenerCallbacks) => {
  const listenerRef = useRef<ClipboardListener | null>(null)

  useEffect(() => {
    const listener = new ClipboardListener(callbacks)
    listenerRef.current = listener

    const cleanup = listener.start()

    return () => {
      cleanup()
      listenerRef.current = null
    }
  }, [callbacks])
}

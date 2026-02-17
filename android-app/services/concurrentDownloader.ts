import { MediaDownloader } from './mediaDownloader'
import type { TweetMedia } from '../types/tweet'
import type { VideoQuality } from '../types/settings'
import { ErrorLogger } from './errorLogger'

export interface DownloadTask {
  media: TweetMedia
  quality: VideoQuality
  savePath?: string
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
  error?: string
}

export interface DownloadProgress {
  taskId: string
  progress: number
  status: DownloadTask['status']
}

export class ConcurrentDownloader {
  private mediaDownloader: MediaDownloader
  private maxConcurrentDownloads: number
  private activeDownloads: Map<string, Promise<void>>
  private downloadQueue: DownloadTask[]
  private progressCallbacks: Map<string, (progress: DownloadProgress) => void>

  constructor(maxConcurrentDownloads: number = 3) {
    this.mediaDownloader = new MediaDownloader()
    this.maxConcurrentDownloads = maxConcurrentDownloads
    this.activeDownloads = new Map()
    this.downloadQueue = []
    this.progressCallbacks = new Map()
  }

  async downloadMultiple(
    mediaList: TweetMedia[],
    quality: VideoQuality,
    onProgress?: (progress: DownloadProgress) => void,
    savePath?: string
  ): Promise<void> {
    const tasks: DownloadTask[] = mediaList.map((media) => ({
      media,
      quality,
      savePath,
      progress: 0,
      status: 'pending' as const,
    }))

    this.downloadQueue = [...tasks]

    const downloadPromises = tasks.map((task, index) => {
      const taskId = `task_${index}`
      if (onProgress) {
        this.progressCallbacks.set(taskId, onProgress)
      }
      return this.processDownload(task, taskId)
    })

    await Promise.all(downloadPromises)
  }

  private async processDownload(
    task: DownloadTask,
    taskId: string
  ): Promise<void> {
    while (this.activeDownloads.size >= this.maxConcurrentDownloads) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    task.status = 'downloading'
    this.notifyProgress(taskId, task)

    const downloadPromise = this.downloadSingle(task, taskId)
    this.activeDownloads.set(taskId, downloadPromise)

    try {
      await downloadPromise
      task.status = 'completed'
      task.progress = 100
      this.notifyProgress(taskId, task)
    } catch (error) {
      task.status = 'failed'
      task.error = (error as Error).message
      this.notifyProgress(taskId, task)
      throw error
    } finally {
      this.activeDownloads.delete(taskId)
      this.progressCallbacks.delete(taskId)
    }
  }

  private async downloadSingle(
    task: DownloadTask,
    taskId: string
  ): Promise<void> {
    try {
      await this.mediaDownloader.downloadMedia(
        task.media,
        task.quality,
        task.savePath
      )
    } catch (error) {
      ErrorLogger.logError(
        'Failed to download media in concurrent downloader',
        error as Error,
        { media: task.media }
      )
      throw error
    }
  }

  private notifyProgress(taskId: string, task: DownloadTask): void {
    const callback = this.progressCallbacks.get(taskId)
    if (callback) {
      callback({
        taskId,
        progress: task.progress,
        status: task.status,
      })
    }
  }

  cancelAll(): void {
    this.downloadQueue = []
    this.activeDownloads.clear()
    this.progressCallbacks.clear()
  }

  getActiveDownloadCount(): number {
    return this.activeDownloads.size
  }

  getQueueLength(): number {
    return this.downloadQueue.length
  }
}

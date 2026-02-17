package com.xmediaharvest.app.data.model

data class DownloadTask(
    val id: String,
    val mediaItem: MediaItem,
    val status: DownloadStatus,
    val progress: Int = 0,
    val downloadedBytes: Long = 0L,
    val totalBytes: Long = 0L,
    val speed: Long = 0L,
    val remainingTime: Long = 0L,
    val filePath: String? = null,
    val error: String? = null,
    val retryCount: Int = 0,
    val createdAt: Long = System.currentTimeMillis(),
    val completedAt: Long? = null
)

enum class DownloadStatus {
    PENDING,
    DOWNLOADING,
    PAUSED,
    COMPLETED,
    FAILED,
    CANCELLED
}

data class DownloadQueue(
    val tasks: List<DownloadTask> = emptyList(),
    val activeTaskCount: Int = 0,
    val maxConcurrentDownloads: Int = 3
)

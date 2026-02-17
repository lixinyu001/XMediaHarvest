package com.xmediaharvest.app.data.repository

import android.content.Context
import androidx.work.*
import com.xmediaharvest.app.data.local.dao.DownloadHistoryDao
import com.xmediaharvest.app.data.local.entity.DownloadHistoryEntity
import com.xmediaharvest.app.data.model.*
import com.xmediaharvest.app.data.api.TwitterParser
import com.xmediaharvest.app.data.worker.DownloadWorker
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.io.File
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DownloadRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val downloadHistoryDao: DownloadHistoryDao,
    private val twitterParser: TwitterParser,
    private val workManager: WorkManager
) {
    
    suspend fun parseTweetUrl(url: String): Result<TweetInfo> {
        return twitterParser.parseTweetUrl(url)
    }
    
    suspend fun startDownload(mediaItem: MediaItem): Result<String> {
        return try {
            val fileName = generateFileName(mediaItem)
            val filePath = getDownloadPath(mediaItem.type, fileName)
            
            val downloadRequest = OneTimeWorkRequestBuilder<DownloadWorker>()
                .setInputData(
                    workDataOf(
                        "media_url" to mediaItem.url,
                        "file_path" to filePath,
                        "file_name" to fileName,
                        "media_type" to mediaItem.type.name,
                        "media_quality" to mediaItem.quality.name,
                        "tweet_id" to (mediaItem.tweetId ?: ""),
                        "tweet_author" to (mediaItem.tweetAuthor ?: "")
                    )
                )
                .build()
            
            workManager.enqueue(downloadRequest)
            
            Result.success(downloadRequest.id.toString())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun startBatchDownload(mediaItems: List<MediaItem>): Result<List<String>> {
        return try {
            val downloadIds = mutableListOf<String>()
            
            mediaItems.forEach { mediaItem ->
                val result = startDownload(mediaItem)
                if (result.isSuccess) {
                    downloadIds.add(result.getOrNull() ?: "")
                }
            }
            
            Result.success(downloadIds)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    fun getDownloadHistory(): Flow<List<DownloadHistory>> {
        return downloadHistoryDao.getAllHistory().map { entities ->
            entities.map { it.toDownloadHistory() }
        }
    }
    
    fun getDownloadHistoryByType(type: MediaType): Flow<List<DownloadHistory>> {
        return downloadHistoryDao.getHistoryByType(type.name).map { entities ->
            entities.map { it.toDownloadHistory() }
        }
    }
    
    fun getDownloadHistoryByAuthor(author: String): Flow<List<DownloadHistory>> {
        return downloadHistoryDao.getHistoryByAuthor(author).map { entities ->
            entities.map { it.toDownloadHistory() }
        }
    }
    
    fun getDownloadHistoryByTimeRange(startTime: Long): Flow<List<DownloadHistory>> {
        return downloadHistoryDao.getHistoryByTimeRange(startTime).map { entities ->
            entities.map { it.toDownloadHistory() }
        }
    }
    
    suspend fun getDownloadStatistics(): DownloadStatistics {
        val count = downloadHistoryDao.getCount()
        val totalSize = downloadHistoryDao.getTotalSize() ?: 0L
        return DownloadStatistics(
            totalDownloads = count,
            totalSize = totalSize
        )
    }
    
    suspend fun deleteDownloadHistory(id: String) {
        downloadHistoryDao.deleteById(id)
    }
    
    suspend fun clearAllHistory() {
        downloadHistoryDao.deleteAll()
    }
    
    private fun generateFileName(mediaItem: MediaItem): String {
        val author = mediaItem.tweetAuthor ?: "unknown"
        val timestamp = System.currentTimeMillis()
        val extension = getFileExtension(mediaItem.type)
        return "${author}_${timestamp}${if (mediaItem.fileName != null) "_${mediaItem.fileName}" else ""}.$extension"
    }
    
    private fun getDownloadPath(type: MediaType, fileName: String): String {
        val downloadDir = when (type) {
            MediaType.VIDEO -> File(context.getExternalFilesDir(null), "Videos")
            MediaType.IMAGE -> File(context.getExternalFilesDir(null), "Images")
            MediaType.GIF -> File(context.getExternalFilesDir(null), "GIFs")
        }
        
        if (!downloadDir.exists()) {
            downloadDir.mkdirs()
        }
        
        return File(downloadDir, fileName).absolutePath
    }
    
    private fun getFileExtension(type: MediaType): String {
        return when (type) {
            MediaType.VIDEO -> "mp4"
            MediaType.IMAGE -> "jpg"
            MediaType.GIF -> "gif"
        }
    }
}

data class DownloadHistory(
    val id: String,
    val url: String,
    val type: MediaType,
    val quality: MediaQuality,
    val fileName: String,
    val filePath: String,
    val fileSize: Long,
    val tweetId: String?,
    val tweetAuthor: String?,
    val downloadedAt: Long
)

data class DownloadStatistics(
    val totalDownloads: Int,
    val totalSize: Long
)

private fun DownloadHistoryEntity.toDownloadHistory(): DownloadHistory {
    return DownloadHistory(
        id = id,
        url = url,
        type = MediaType.valueOf(type),
        quality = MediaQuality.valueOf(quality),
        fileName = fileName,
        filePath = filePath,
        fileSize = fileSize,
        tweetId = tweetId,
        tweetAuthor = tweetAuthor,
        downloadedAt = downloadedAt
    )
}

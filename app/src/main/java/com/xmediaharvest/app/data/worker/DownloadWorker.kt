package com.xmediaharvest.app.data.worker

import android.content.Context
import android.os.Environment
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.xmediaharvest.app.data.local.dao.DownloadHistoryDao
import com.xmediaharvest.app.data.local.entity.DownloadHistoryEntity
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException

@HiltWorker
class DownloadWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val downloadHistoryDao: DownloadHistoryDao
) : CoroutineWorker(context, params) {
    
    private val client = OkHttpClient.Builder()
        .retryOnConnectionFailure(true)
        .build()
    
    override suspend fun doWork(): Result {
        val mediaUrl = inputData.getString("media_url") ?: return Result.failure()
        val filePath = inputData.getString("file_path") ?: return Result.failure()
        val fileName = inputData.getString("file_name") ?: return Result.failure()
        val mediaType = inputData.getString("media_type") ?: return Result.failure()
        val mediaQuality = inputData.getString("media_quality") ?: return Result.failure()
        val tweetId = inputData.getString("tweet_id")
        val tweetAuthor = inputData.getString("tweet_author")
        
        return try {
            downloadFile(mediaUrl, filePath)
            
            val file = File(filePath)
            val fileSize = file.length()
            
            val historyEntity = DownloadHistoryEntity(
                id = fileName,
                url = mediaUrl,
                type = mediaType,
                quality = mediaQuality,
                fileName = fileName,
                filePath = filePath,
                fileSize = fileSize,
                tweetId = if (tweetId.isNullOrEmpty()) null else tweetId,
                tweetAuthor = if (tweetAuthor.isNullOrEmpty()) null else tweetAuthor
            )
            
            downloadHistoryDao.insert(historyEntity)
            
            Result.success()
        } catch (e: Exception) {
            Result.failure()
        }
    }
    
    private suspend fun downloadFile(url: String, filePath: String) {
        withContext(Dispatchers.IO) {
            val request = Request.Builder()
                .url(url)
                .build()
            
            val response = client.newCall(request).execute()
            
            if (!response.isSuccessful) {
                throw IOException("Unexpected code $response")
            }
            
            val file = File(filePath)
            file.parentFile?.mkdirs()
            
            response.body?.byteStream()?.use { input ->
                file.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
    }
}

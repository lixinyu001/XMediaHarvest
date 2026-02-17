package com.xmediaharvest.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "download_history")
data class DownloadHistoryEntity(
    @PrimaryKey
    val id: String,
    val url: String,
    val type: String,
    val quality: String,
    val fileName: String,
    val filePath: String,
    val fileSize: Long,
    val tweetId: String? = null,
    val tweetAuthor: String? = null,
    val downloadedAt: Long = System.currentTimeMillis()
)

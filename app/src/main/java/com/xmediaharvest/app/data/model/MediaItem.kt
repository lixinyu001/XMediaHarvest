package com.xmediaharvest.app.data.model

data class MediaItem(
    val id: String,
    val url: String,
    val type: MediaType,
    val quality: MediaQuality,
    val thumbnailUrl: String? = null,
    val fileName: String? = null,
    val fileSize: Long = 0L,
    val duration: Long? = null,
    val width: Int? = null,
    val height: Int? = null,
    val tweetId: String? = null,
    val tweetAuthor: String? = null,
    val tweetText: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

enum class MediaType {
    VIDEO,
    IMAGE,
    GIF
}

enum class MediaQuality {
    SD,
    HD,
    ORIGINAL
}

data class TweetInfo(
    val id: String,
    val author: String,
    val authorAvatar: String? = null,
    val text: String? = null,
    val mediaItems: List<MediaItem>,
    val createdAt: Long = System.currentTimeMillis()
)

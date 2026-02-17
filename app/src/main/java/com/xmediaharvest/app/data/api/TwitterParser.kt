package com.xmediaharvest.app.data.api

import com.xmediaharvest.app.data.model.MediaItem
import com.xmediaharvest.app.data.model.MediaQuality
import com.xmediaharvest.app.data.model.MediaType
import com.xmediaharvest.app.data.model.TweetInfo
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TwitterParser @Inject constructor(
    private val okHttpClient: OkHttpClient
) {
    
    suspend fun parseTweetUrl(url: String): Result<TweetInfo> {
        return try {
            val tweetId = extractTweetId(url)
            if (tweetId == null) {
                Result.failure(Exception("Invalid tweet URL"))
            } else {
                val tweetData = fetchTweetData(tweetId)
                parseTweetData(tweetData)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    internal fun extractTweetId(url: String): String? {
        val patterns = listOf(
            "twitter.com/\\w+/status/(\\d+)",
            "x.com/\\w+/status/(\\d+)",
            "mobile.twitter.com/\\w+/status/(\\d+)"
        )
        
        for (pattern in patterns) {
            val regex = Regex(pattern)
            val match = regex.find(url)
            if (match != null) {
                return match.groupValues[1]
            }
        }
        return null
    }
    
    private suspend fun fetchTweetData(tweetId: String): JSONObject {
        val request = Request.Builder()
            .url("https://api.twitter.com/1.1/statuses/show.json?id=$tweetId&include_entities=true")
            .build()
        
        val response = okHttpClient.newCall(request).execute()
        
        if (!response.isSuccessful) {
            throw Exception("Failed to fetch tweet data: ${response.code}")
        }
        
        val responseBody = response.body?.string() ?: throw Exception("Empty response")
        return JSONObject(responseBody)
    }
    
    private fun parseTweetData(json: JSONObject): Result<TweetInfo> {
        return try {
            val tweetId = json.optString("id_str", json.optString("id"))
            val user = json.optJSONObject("user")
            val author = user?.optString("screen_name") ?: user?.optString("name") ?: "Unknown"
            val authorAvatar = user?.optString("profile_image_url_https")
            val text = json.optString("text", json.optString("full_text"))
            
            val mediaItems = mutableListOf<MediaItem>()
            val extendedEntities = json.optJSONObject("extended_entities")
            val mediaArray = extendedEntities?.optJSONArray("media")
            
            if (mediaArray != null) {
                for (i in 0 until mediaArray.length()) {
                    val media = mediaArray.optJSONObject(i) ?: continue
                    val mediaType = media.optString("type")
                    
                    when (mediaType) {
                        "video", "animated_gif" -> {
                            val videoInfo = media.optJSONObject("video_info")
                            val variants = videoInfo?.optJSONArray("variants")
                            
                            if (variants != null) {
                                var bestVariant: JSONObject? = null
                                var maxBitrate = 0L
                                
                                for (j in 0 until variants.length()) {
                                    val variant = variants.optJSONObject(j) ?: continue
                                    val contentType = variant.optString("content_type")
                                    
                                    if (contentType == "video/mp4") {
                                        val bitrate = variant.optLong("bitrate", 0)
                                        if (bitrate > maxBitrate) {
                                            maxBitrate = bitrate
                                            bestVariant = variant
                                        }
                                    }
                                }
                                
                                bestVariant?.let { variant ->
                                    val url = variant.optString("url")
                                    val type = if (mediaType == "animated_gif") MediaType.GIF else MediaType.VIDEO
                                    val quality = determineQuality(maxBitrate)
                                    
                                    mediaItems.add(
                                        MediaItem(
                                            id = "${tweetId}_$i",
                                            url = url,
                                            type = type,
                                            quality = quality,
                                            thumbnailUrl = media.optString("media_url_https"),
                                            tweetId = tweetId,
                                            tweetAuthor = author,
                                            tweetText = text
                                        )
                                    )
                                }
                            }
                        }
                        "photo" -> {
                            val url = media.optString("media_url_https")
                            mediaItems.add(
                                MediaItem(
                                    id = "${tweetId}_$i",
                                    url = url,
                                    type = MediaType.IMAGE,
                                    quality = MediaQuality.ORIGINAL,
                                    thumbnailUrl = url,
                                    tweetId = tweetId,
                                    tweetAuthor = author,
                                    tweetText = text
                                )
                            )
                        }
                    }
                }
            }
            
            Result.success(
                TweetInfo(
                    id = tweetId,
                    author = author,
                    authorAvatar = authorAvatar,
                    text = text,
                    mediaItems = mediaItems
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    internal fun determineQuality(bitrate: Long): MediaQuality {
        return when {
            bitrate >= 800000 -> MediaQuality.HD
            bitrate >= 300000 -> MediaQuality.SD
            else -> MediaQuality.SD
        }
    }
}

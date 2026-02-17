package com.xmediaharvest.app.data.model

import org.junit.Test
import org.junit.Assert.*

class MediaItemTest {
    
    @Test
    fun testMediaItemCreation() {
        val mediaItem = MediaItem(
            id = "test_id",
            url = "https://example.com/video.mp4",
            type = MediaType.VIDEO,
            quality = MediaQuality.HD
        )
        
        assertEquals("test_id", mediaItem.id)
        assertEquals("https://example.com/video.mp4", mediaItem.url)
        assertEquals(MediaType.VIDEO, mediaItem.type)
        assertEquals(MediaQuality.HD, mediaItem.quality)
    }
    
    @Test
    fun testTweetInfoCreation() {
        val tweetInfo = TweetInfo(
            id = "123456789",
            author = "testuser",
            text = "Test tweet",
            mediaItems = emptyList()
        )
        
        assertEquals("123456789", tweetInfo.id)
        assertEquals("testuser", tweetInfo.author)
        assertEquals("Test tweet", tweetInfo.text)
        assertTrue(tweetInfo.mediaItems.isEmpty())
    }
}

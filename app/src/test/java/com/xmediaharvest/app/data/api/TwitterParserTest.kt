package com.xmediaharvest.app.data.api

import com.xmediaharvest.app.data.model.MediaType
import com.xmediaharvest.app.data.model.MediaQuality
import org.junit.Test
import org.junit.Assert.*
import org.junit.Before

class TwitterParserTest {
    
    private lateinit var parser: TwitterParser
    
    @Before
    fun setup() {
        parser = TwitterParser(okhttp3.OkHttpClient())
    }
    
    @Test
    fun testExtractTweetId_validUrl() {
        val url = "https://twitter.com/user/status/123456789"
        val tweetId = parser.extractTweetId(url)
        assertEquals("123456789", tweetId)
    }
    
    @Test
    fun testExtractTweetId_xComUrl() {
        val url = "https://x.com/user/status/987654321"
        val tweetId = parser.extractTweetId(url)
        assertEquals("987654321", tweetId)
    }
    
    @Test
    fun testExtractTweetId_invalidUrl() {
        val url = "https://example.com/something"
        val tweetId = parser.extractTweetId(url)
        assertNull(tweetId)
    }
    
    @Test
    fun testDetermineQuality_hd() {
        val quality = parser.determineQuality(1000000)
        assertEquals(MediaQuality.HD, quality)
    }
    
    @Test
    fun testDetermineQuality_sd() {
        val quality = parser.determineQuality(500000)
        assertEquals(MediaQuality.SD, quality)
    }
    
    @Test
    fun testDetermineQuality_low() {
        val quality = parser.determineQuality(100000)
        assertEquals(MediaQuality.SD, quality)
    }
}

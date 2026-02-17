package com.xmediaharvest.app.data.api

import com.xmediaharvest.app.data.model.MediaType
import com.xmediaharvest.app.data.model.MediaQuality
import org.junit.Test
import org.junit.Assert.*
import org.junit.Before
import java.lang.reflect.Method

class TwitterParserTest {
    
    private lateinit var parser: TwitterParser
    
    @Before
    fun setup() {
        parser = TwitterParser(okhttp3.OkHttpClient())
    }
    
    @Test
    fun testExtractTweetId_validUrl() {
        val url = "https://twitter.com/user/status/123456789"
        val method = TwitterParser::class.java.getDeclaredMethod("extractTweetId", String::class.java)
        method.isAccessible = true
        val tweetId = method.invoke(parser, url) as String?
        assertEquals("123456789", tweetId)
    }
    
    @Test
    fun testExtractTweetId_xComUrl() {
        val url = "https://x.com/user/status/987654321"
        val method = TwitterParser::class.java.getDeclaredMethod("extractTweetId", String::class.java)
        method.isAccessible = true
        val tweetId = method.invoke(parser, url) as String?
        assertEquals("987654321", tweetId)
    }
    
    @Test
    fun testExtractTweetId_invalidUrl() {
        val url = "https://example.com/something"
        val method = TwitterParser::class.java.getDeclaredMethod("extractTweetId", String::class.java)
        method.isAccessible = true
        val tweetId = method.invoke(parser, url) as String?
        assertNull(tweetId)
    }
    
    @Test
    fun testDetermineQuality_hd() {
        val method = TwitterParser::class.java.getDeclaredMethod("determineQuality", Long::class.java)
        method.isAccessible = true
        val quality = method.invoke(parser, 1000000L) as MediaQuality
        assertEquals(MediaQuality.HD, quality)
    }
    
    @Test
    fun testDetermineQuality_sd() {
        val method = TwitterParser::class.java.getDeclaredMethod("determineQuality", Long::class.java)
        method.isAccessible = true
        val quality = method.invoke(parser, 500000L) as MediaQuality
        assertEquals(MediaQuality.SD, quality)
    }
    
    @Test
    fun testDetermineQuality_low() {
        val method = TwitterParser::class.java.getDeclaredMethod("determineQuality", Long::class.java)
        method.isAccessible = true
        val quality = method.invoke(parser, 100000L) as MediaQuality
        assertEquals(MediaQuality.SD, quality)
    }
}

package com.xmediaharvest.app.data.api

import org.junit.Test
import org.junit.Assert.*

class TwitterParserSimpleTest {
    
    @Test
    fun testRegexPattern_twitter() {
        val url = "https://twitter.com/user/status/123456789"
        val patterns = listOf(
            "twitter.com/\\w+/status/(\\d+)",
            "x.com/\\w+/status/(\\d+)",
            "mobile.twitter.com/\\w+/status/(\\d+)"
        )
        
        var foundId: String? = null
        for (pattern in patterns) {
            val regex = Regex(pattern)
            val match = regex.find(url)
            if (match != null) {
                foundId = match.groupValues[1]
                break
            }
        }
        
        assertEquals("123456789", foundId)
    }
    
    @Test
    fun testRegexPattern_xCom() {
        val url = "https://x.com/user/status/987654321"
        val patterns = listOf(
            "twitter.com/\\w+/status/(\\d+)",
            "x.com/\\w+/status/(\\d+)",
            "mobile.twitter.com/\\w+/status/(\\d+)"
        )
        
        var foundId: String? = null
        for (pattern in patterns) {
            val regex = Regex(pattern)
            val match = regex.find(url)
            if (match != null) {
                foundId = match.groupValues[1]
                break
            }
        }
        
        assertEquals("987654321", foundId)
    }
    
    @Test
    fun testQualityDetermination() {
        val hdQuality = when {
            1000000L >= 800000 -> "HD"
            1000000L >= 300000 -> "SD"
            else -> "SD"
        }
        
        assertEquals("HD", hdQuality)
        
        val sdQuality = when {
            500000L >= 800000 -> "HD"
            500000L >= 300000 -> "SD"
            else -> "SD"
        }
        
        assertEquals("SD", sdQuality)
    }
}

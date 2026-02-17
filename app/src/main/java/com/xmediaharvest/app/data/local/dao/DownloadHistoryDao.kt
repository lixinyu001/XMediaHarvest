package com.xmediaharvest.app.data.local.dao

import androidx.room.*
import com.xmediaharvest.app.data.local.entity.DownloadHistoryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface DownloadHistoryDao {
    
    @Query("SELECT * FROM download_history ORDER BY downloadedAt DESC")
    fun getAllHistory(): Flow<List<DownloadHistoryEntity>>
    
    @Query("SELECT * FROM download_history WHERE type = :type ORDER BY downloadedAt DESC")
    fun getHistoryByType(type: String): Flow<List<DownloadHistoryEntity>>
    
    @Query("SELECT * FROM download_history WHERE tweetAuthor = :author ORDER BY downloadedAt DESC")
    fun getHistoryByAuthor(author: String): Flow<List<DownloadHistoryEntity>>
    
    @Query("SELECT * FROM download_history WHERE downloadedAt >= :startTime ORDER BY downloadedAt DESC")
    fun getHistoryByTimeRange(startTime: Long): Flow<List<DownloadHistoryEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(history: DownloadHistoryEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(historyList: List<DownloadHistoryEntity>)
    
    @Delete
    suspend fun delete(history: DownloadHistoryEntity)
    
    @Query("DELETE FROM download_history WHERE id = :id")
    suspend fun deleteById(id: String)
    
    @Query("DELETE FROM download_history")
    suspend fun deleteAll()
    
    @Query("SELECT COUNT(*) FROM download_history")
    suspend fun getCount(): Int
    
    @Query("SELECT SUM(fileSize) FROM download_history")
    suspend fun getTotalSize(): Long?
}

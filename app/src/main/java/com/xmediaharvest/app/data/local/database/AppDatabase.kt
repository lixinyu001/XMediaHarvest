package com.xmediaharvest.app.data.local.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.xmediaharvest.app.data.local.dao.DownloadHistoryDao
import com.xmediaharvest.app.data.local.entity.DownloadHistoryEntity

@Database(
    entities = [DownloadHistoryEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun downloadHistoryDao(): DownloadHistoryDao
}

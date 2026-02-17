package com.xmediaharvest.app.di

import android.content.Context
import androidx.room.Room
import com.xmediaharvest.app.data.api.TwitterParser
import com.xmediaharvest.app.data.local.dao.DownloadHistoryDao
import com.xmediaharvest.app.data.local.database.AppDatabase
import com.xmediaharvest.app.data.repository.DownloadRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build()
    }
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "xmediaharvest_database"
        )
            .fallbackToDestructiveMigration()
            .build()
    }
    
    @Provides
    @Singleton
    fun provideDownloadHistoryDao(database: AppDatabase): DownloadHistoryDao {
        return database.downloadHistoryDao()
    }
}

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {
    
    @Provides
    @Singleton
    fun provideTwitterParser(
        okHttpClient: OkHttpClient
    ): TwitterParser {
        return TwitterParser(okHttpClient)
    }
    
    @Provides
    @Singleton
    fun provideDownloadRepository(
        @ApplicationContext context: Context,
        downloadHistoryDao: DownloadHistoryDao,
        twitterParser: TwitterParser,
        workManager: androidx.work.WorkManager
    ): DownloadRepository {
        return DownloadRepository(context, downloadHistoryDao, twitterParser, workManager)
    }
}

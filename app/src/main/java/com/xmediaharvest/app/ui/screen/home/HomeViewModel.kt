package com.xmediaharvest.app.ui.screen.home

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.xmediaharvest.app.data.model.MediaItem
import com.xmediaharvest.app.data.model.TweetInfo
import com.xmediaharvest.app.data.repository.DownloadRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val downloadRepository: DownloadRepository
) : ViewModel() {
    
    var uiState by mutableStateOf(HomeUiState())
        private set
    
    fun onUrlInputChange(url: String) {
        uiState = uiState.copy(urlInput = url)
    }
    
    fun onPasteClick() {
    }
    
    fun onParseUrl() {
        if (uiState.urlInput.isBlank()) return
        
        viewModelScope.launch {
            uiState = uiState.copy(
                isLoading = true,
                error = null,
                tweetInfo = null
            )
            
            val result = downloadRepository.parseTweetUrl(uiState.urlInput)
            
            result.fold(
                onSuccess = { tweetInfo ->
                    uiState = uiState.copy(
                        isLoading = false,
                        tweetInfo = tweetInfo
                    )
                },
                onFailure = { exception ->
                    uiState = uiState.copy(
                        isLoading = false,
                        error = exception.message ?: "Failed to parse tweet"
                    )
                }
            )
        }
    }
    
    fun onDownloadItem(mediaItem: MediaItem) {
        viewModelScope.launch {
            downloadRepository.startDownload(mediaItem)
        }
    }
    
    fun onDownloadAll() {
        uiState.tweetInfo?.let { tweetInfo ->
            viewModelScope.launch {
                downloadRepository.startBatchDownload(tweetInfo.mediaItems)
            }
        }
    }
}

data class HomeUiState(
    val urlInput: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val tweetInfo: TweetInfo? = null
)

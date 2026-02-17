package com.xmediaharvest.app.ui.screen.home

import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.xmediaharvest.app.data.model.MediaItem
import com.xmediaharvest.app.data.model.TweetInfo
import com.xmediaharvest.app.data.repository.DownloadRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val downloadRepository: DownloadRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    
    fun onUrlInputChange(url: String) {
        _uiState.value = _uiState.value.copy(urlInput = url)
    }
    
    fun onPasteClick() {
    }
    
    fun onParseUrl() {
        if (_uiState.value.urlInput.isBlank()) return
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                error = null,
                tweetInfo = null
            )
            
            val result = downloadRepository.parseTweetUrl(_uiState.value.urlInput)
            
            result.fold(
                onSuccess = { tweetInfo ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        tweetInfo = tweetInfo
                    )
                },
                onFailure = { exception ->
                    _uiState.value = _uiState.value.copy(
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
        _uiState.value.tweetInfo?.let { tweetInfo ->
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

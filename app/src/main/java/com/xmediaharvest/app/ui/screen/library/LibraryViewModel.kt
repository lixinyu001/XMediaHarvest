package com.xmediaharvest.app.ui.screen.library

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.xmediaharvest.app.data.model.MediaType
import com.xmediaharvest.app.data.repository.DownloadHistory
import com.xmediaharvest.app.data.repository.DownloadRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LibraryViewModel @Inject constructor(
    private val downloadRepository: DownloadRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(LibraryUiState())
    val uiState: StateFlow<LibraryUiState> = _uiState.asStateFlow()
    
    init {
        loadDownloadHistory()
    }
    
    fun onFilterSelected(filter: FilterType) {
        _uiState.value = _uiState.value.copy(selectedFilter = filter)
        loadDownloadHistory()
    }
    
    fun onRefresh() {
        loadDownloadHistory()
    }
    
    fun onDeleteItem(id: String) {
        viewModelScope.launch {
            downloadRepository.deleteDownloadHistory(id)
            loadDownloadHistory()
        }
    }
    
    fun onClearAll() {
        viewModelScope.launch {
            downloadRepository.clearAllHistory()
            loadDownloadHistory()
        }
    }
    
    private var historyJob: kotlinx.coroutines.Job? = null
    
    private fun loadDownloadHistory() {
        historyJob?.cancel()
        historyJob = viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            val history = when (_uiState.value.selectedFilter) {
                FilterType.ALL -> downloadRepository.getDownloadHistory()
                FilterType.VIDEO -> downloadRepository.getDownloadHistoryByType(MediaType.VIDEO)
                FilterType.IMAGE -> downloadRepository.getDownloadHistoryByType(MediaType.IMAGE)
                FilterType.GIF -> downloadRepository.getDownloadHistoryByType(MediaType.GIF)
            }
            
            history.collect { list ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    downloadHistory = list
                )
            }
        }
    }
}

data class LibraryUiState(
    val isLoading: Boolean = false,
    val downloadHistory: List<DownloadHistory> = emptyList(),
    val selectedFilter: FilterType = FilterType.ALL
)

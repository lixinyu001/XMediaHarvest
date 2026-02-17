package com.xmediaharvest.app.ui.screen.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToLibrary: () -> Unit,
    onNavigateToSettings: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("XMediaHarvest") },
                actions = {
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToLibrary,
                    icon = { Icon(Icons.Default.PlayCircle, contentDescription = "Library") },
                    label = { Text("Library") }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            OutlinedTextField(
                value = uiState.urlInput,
                onValueChange = { viewModel.onUrlInputChange(it) },
                label = { Text("Paste Twitter URL") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                leadingIcon = { Icon(Icons.Default.Link, contentDescription = null) },
                trailingIcon = {
                    IconButton(onClick = { viewModel.onPasteClick() }) {
                        Icon(Icons.Default.ContentPaste, contentDescription = "Paste")
                    }
                }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { viewModel.onParseUrl() },
                modifier = Modifier.fillMaxWidth(),
                enabled = uiState.urlInput.isNotBlank()
            ) {
                Icon(Icons.Default.Download, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Parse Tweet")
            }
            
            when {
                uiState.isLoading -> {
                    Spacer(modifier = Modifier.height(32.dp))
                    CircularProgressIndicator()
                }
                uiState.error != null -> {
                    Spacer(modifier = Modifier.height(32.dp))
                    Text(
                        text = uiState.error,
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center
                    )
                }
                uiState.tweetInfo != null -> {
                    Spacer(modifier = Modifier.height(24.dp))
                    TweetInfoCard(
                        tweetInfo = uiState.tweetInfo,
                        onDownloadAll = { viewModel.onDownloadAll() },
                        onDownloadItem = { mediaItem -> viewModel.onDownloadItem(mediaItem) }
                    )
                }
            }
        }
    }
}

@Composable
fun TweetInfoCard(
    tweetInfo: com.xmediaharvest.app.data.model.TweetInfo,
    onDownloadAll: () -> Unit,
    onDownloadItem: (com.xmediaharvest.app.data.model.MediaItem) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "@${tweetInfo.author}",
                style = MaterialTheme.typography.titleMedium
            )
            
            tweetInfo.text?.let { text ->
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = text,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Media (${tweetInfo.mediaItems.size})",
                style = MaterialTheme.typography.titleSmall
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(tweetInfo.mediaItems) { mediaItem ->
                    MediaItemCard(
                        mediaItem = mediaItem,
                        onDownload = { onDownloadItem(mediaItem) }
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = onDownloadAll,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.DoneAll, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Download All")
            }
        }
    }
}

@Composable
fun MediaItemCard(
    mediaItem: com.xmediaharvest.app.data.model.MediaItem,
    onDownload: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = mediaItem.type.name,
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = mediaItem.quality.name,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            IconButton(onClick = onDownload) {
                Icon(Icons.Default.Download, contentDescription = "Download")
            }
        }
    }
}

package com.xmediaharvest.app.ui.screen.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onNavigateBack: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text(
                text = "Download Settings",
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingItem(
                title = "Max Concurrent Downloads",
                description = "Number of simultaneous downloads",
                value = "${uiState.maxConcurrentDownloads}",
                onClick = { viewModel.onMaxConcurrentDownloadsChange() }
            )
            
            SettingItem(
                title = "Download Timeout",
                description = "Timeout in seconds",
                value = "${uiState.downloadTimeout}s",
                onClick = { viewModel.onDownloadTimeoutChange() }
            )
            
            SettingItem(
                title = "Auto Retry",
                description = "Number of retry attempts",
                value = "${uiState.autoRetryCount}",
                onClick = { viewModel.onAutoRetryCountChange() }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Storage Settings",
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingItem(
                title = "Save Location",
                description = "Default save location",
                value = uiState.saveLocation,
                onClick = { viewModel.onSaveLocationChange() }
            )
            
            SettingSwitch(
                title = "Organize by Type",
                description = "Save files in type-specific folders",
                checked = uiState.organizeByType,
                onCheckedChange = { viewModel.onOrganizeByTypeChange(it) }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Appearance",
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingSwitch(
                title = "Dark Mode",
                description = "Use dark theme",
                checked = uiState.darkMode,
                onCheckedChange = { viewModel.onDarkModeChange(it) }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Notifications",
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingSwitch(
                title = "Download Complete",
                description = "Notify when download completes",
                checked = uiState.notifyOnComplete,
                onCheckedChange = { viewModel.onNotifyOnCompleteChange(it) }
            )
            
            SettingSwitch(
                title = "Download Failed",
                description = "Notify when download fails",
                checked = uiState.notifyOnFailed,
                onCheckedChange = { viewModel.onNotifyOnFailedChange(it) }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "About",
                style = MaterialTheme.typography.titleMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            SettingItem(
                title = "Version",
                description = "App version",
                value = "1.0.0",
                onClick = { }
            )
            
            SettingItem(
                title = "Privacy Policy",
                description = "Read privacy policy",
                value = "",
                onClick = { viewModel.onPrivacyPolicyClick() }
            )
            
            SettingItem(
                title = "User Agreement",
                description = "Read user agreement",
                value = "",
                onClick = { viewModel.onUserAgreementClick() }
            )
        }
    }
}

@Composable
fun SettingItem(
    title: String,
    description: String,
    value: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        onClick = onClick
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            if (value.isNotEmpty()) {
                Text(
                    text = value,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
fun SettingSwitch(
    title: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange
            )
        }
    }
}

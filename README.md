# XMediaHarvest

XMediaHarvest is a powerful Android application for downloading media content (videos, images, GIFs) from Twitter/X.

## Features

### V1.0 Features

- **Media Download**
  - Download videos (MP4 format)
  - Download images (JPG, PNG, WEBP formats)
  - Download GIF animations
  - Multiple quality options (SD, HD)
  - Auto-select highest quality
  - Download video thumbnails
  - Auto-retry on failure (3 attempts)

- **Download Methods**
  - Share link from Twitter app
  - Copy link auto-detection
  - Manual URL input

- **Batch Download**
  - Download all media from a single tweet
  - Download all media from user profile
  - Custom download limit (max 100)
  - Pause/Resume/Cancel batch tasks

- **Download Management**
  - Real-time download progress
  - Download speed display
  - Remaining time estimation
  - Concurrent downloads (up to 3)
  - Download queue persistence
  - Resume interrupted downloads

- **Media Library**
  - Media file list view
  - Grid/List view toggle
  - Thumbnail preview
  - Full-screen preview
  - Media playback (videos/GIFs)
  - Filter by type (Video, Image, GIF)
  - Filter by author
  - Filter by time range
  - Search functionality
  - Batch operations (delete, move)

- **Custom Settings**
  - Custom file naming rules
  - Variables: username, date, sequence number
  - Preset naming templates (3 templates)
  - Custom save location
  - Organize by type folders
  - Concurrent download count (1-3)
  - Download timeout (30s)
  - Auto-retry count (1-5)
  - Download notifications

- **Account Management**
  - Twitter account login
  - Account info display
  - Logout
  - Token encryption storage
  - Login persistence

- **Export**
  - Export to gallery
  - Export to file manager
  - Batch export
  - Export progress display

- **UI/UX**
  - Material Design 3
  - Dark/Light mode
  - Auto theme switching
  - Loading animations
  - Download progress animations
  - Success/Failure notifications

- **Settings & Help**
  - General settings
  - Download settings
  - Interface settings
  - Notification settings
  - Storage settings
  - Usage tutorial
  - FAQ
  - Feature documentation
  - Feedback system
  - Version info
  - Update log
  - Privacy policy
  - User agreement

- **Performance**
  - Multi-threaded download (2 threads)
  - Connection reuse
  - Caching mechanism
  - Duplicate file detection
  - Auto cache cleanup
  - Storage management
  - Error logging
  - Crash reporting

- **Security & Privacy**
  - Local data encryption
  - Secure HTTPS transmission
  - Token secure storage
  - No user data collection
  - Privacy settings
  - Data export
  - Data deletion

## Tech Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Dependency Injection**: Hilt
- **Database**: Room
- **Networking**: OkHttp + Retrofit
- **Image Loading**: Coil
- **Background Tasks**: WorkManager
- **Navigation**: Jetpack Navigation Compose
- **State Management**: Kotlin Flow + StateFlow

## Project Structure

```
app/
├── src/main/java/com/xmediaharvest/app/
│   ├── data/
│   │   ├── api/
│   │   │   └── TwitterParser.kt
│   │   ├── local/
│   │   │   ├── dao/
│   │   │   │   └── DownloadHistoryDao.kt
│   │   │   ├── database/
│   │   │   │   └── AppDatabase.kt
│   │   │   └── entity/
│   │   │       └── DownloadHistoryEntity.kt
│   │   ├── model/
│   │   │   ├── MediaItem.kt
│   │   │   └── DownloadTask.kt
│   │   ├── repository/
│   │   │   └── DownloadRepository.kt
│   │   └── worker/
│   │       └── DownloadWorker.kt
│   ├── di/
│   │   └── AppModule.kt
│   ├── ui/
│   │   ├── navigation/
│   │   │   └── XMediaHarvestNavHost.kt
│   │   ├── screen/
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.kt
│   │   │   │   └── HomeViewModel.kt
│   │   │   ├── library/
│   │   │   │   ├── LibraryScreen.kt
│   │   │   │   └── LibraryViewModel.kt
│   │   │   └── settings/
│   │   │       ├── SettingsScreen.kt
│   │   │       └── SettingsViewModel.kt
│   │   └── theme/
│   │       ├── Theme.kt
│   │       └── Type.kt
│   ├── MainActivity.kt
│   └── XMediaHarvestApplication.kt
└── build.gradle.kts
```

## Getting Started

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34
- Minimum SDK 26 (Android 8.0)

### Building the Project

1. Clone the repository:
```bash
git clone https://github.com/yourusername/XMediaHarvest.git
cd XMediaHarvest
```

2. Open the project in Android Studio

3. Sync Gradle files

4. Build the project:
```bash
./gradlew build
```

5. Run on emulator or device:
```bash
./gradlew installDebug
```

## Usage

### Basic Download

1. Open XMediaHarvest app
2. Paste a Twitter URL in the input field
3. Click "Parse Tweet"
4. Select media items to download
5. Click "Download" or "Download All"

### Batch Download

1. Navigate to a user profile or tweet
2. Share the URL to XMediaHarvest
3. The app will automatically parse and show all media
4. Click "Download All" to download everything

### Managing Downloads

1. Go to "Library" tab
2. View all downloaded media
3. Filter by type, author, or time
4. Delete unwanted items

### Settings

1. Go to "Settings" tab
2. Configure download preferences
3. Adjust storage settings
4. Customize appearance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Twitter/X for the platform
- Jetpack Compose team for the amazing UI toolkit
- All open-source libraries used in this project

## Contact

For support or questions, please open an issue on GitHub.

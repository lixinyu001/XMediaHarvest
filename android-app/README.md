# Twitter Media Harvest - Android App

Android version of Twitter Media Harvest - a powerful media downloader for Twitter/X.

## Features

- Download images and videos from Twitter/X tweets
- Download history tracking
- Local error logging (no data sent to external servers)
- Custom filename generation
- Batch download support
- Video quality selection (High/Medium/Low)
- Dark theme optimized for Twitter/X colors
- Settings management

## Requirements

- Node.js >= 18
- React Native 0.73+
- Android SDK 21+ (Android 5.0+)
- Gradle 8.3+

## Installation

### Option 1: Download Pre-built APK

You can download pre-built APKs from [GitHub Releases](../../releases).

### Option 2: Build from Source

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/TwitterMediaHarvest.git
cd TwitterMediaHarvest/android-app
```

#### Step 2: Generate Gradle Wrapper

**Linux/macOS:**
```bash
cd android
chmod +x setup-gradle.sh
./setup-gradle.sh
```

**Windows:**
```cmd
cd android
setup-gradle.bat
```

Or manually generate:
```bash
cd android
gradle wrapper --gradle-version 8.3
```

#### Step 3: Install Dependencies

```bash
npm install
```

#### Step 4: Run App

```bash
npm run android
```

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md).

## Usage

### Getting Tweet URLs

To download media from a tweet, you need to obtain the tweet URL:

1. Open the X (Twitter) app or website
2. Find the tweet you want to download media from
3. Tap the **Share** button (arrow icon) on the tweet
4. Select **Copy link** or **Copy link to tweet**
5. Paste the URL in the app

The URL format should be:
- `https://twitter.com/username/status/1234567890`
- `https://x.com/username/status/1234567890`

### App Navigation

1. **Home Screen**: Paste a tweet URL and tap "Download"
2. **Tweet Detail**: Select media items you want to download
3. **Download History**: View and manage your download history
4. **Settings**: Configure app preferences including video quality

### Video Quality Settings

The app supports three video quality options:

- **High Quality**: Best video quality, larger file size
- **Medium Quality**: Balanced quality and file size (default)
- **Low Quality**: Smallest file size, lower quality

To change video quality:
1. Go to Settings
2. Tap on "Video Quality"
3. Select your preferred quality
4. Save settings

## Building with GitHub Actions

### Automatic Builds

APKs are automatically built when:

1. **Push to main/master branch**
2. **Create a release tag** (e.g., `v1.0.0`)
3. **Pull request to main/master**
4. **Manual trigger** via GitHub Actions UI

### Downloading APKs from GitHub

#### From Actions Artifacts
1. Go to the **Actions** tab in the repository
2. Click on a recent workflow run
3. Scroll to the **Artifacts** section
4. Download:
   - `app-debug` - Debug APK for testing
   - `app-release` - Release APK (unsigned)
   - `app-release-signed` - Signed release APK (if configured)

#### From GitHub Releases
1. Go to the **Releases** tab
2. Click on a release version
3. Download APKs from the assets section

### Manual Build Trigger

To manually trigger a build:

1. Go to the **Actions** tab
2. Select the **Build Android APK** workflow
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

### APK Signing

For production distribution, you need to sign the APK. See [docs/SIGNING.md](docs/SIGNING.md) for detailed instructions.

To enable automatic signing in GitHub Actions:

1. Generate a keystore file (see [docs/SIGNING.md](docs/SIGNING.md))
2. Add the following secrets to your repository:
   - `KEYSTORE_FILE`: Base64 encoded keystore file
   - `KEYSTORE_PASSWORD`: Your keystore password
   - `KEY_ALIAS`: Your key alias (default: `release`)
   - `KEY_PASSWORD`: Your key password

Once configured, the workflow will automatically build signed APKs.

## Permissions

The app requires the following permissions:
- **WRITE_EXTERNAL_STORAGE**: To save downloaded media files
- **INTERNET**: To fetch tweet data and media

## Error Logging

All errors are stored locally on the device. No error data is sent to external servers. You can view error logs in the Settings screen.

## Project Structure

```
android-app/
├── screens/           # Screen components
│   ├── HomeScreen.tsx          # Main entry point
│   ├── TweetDetailScreen.tsx   # Media display and download
│   ├── DownloadHistoryScreen.tsx # Download history
│   └── SettingsScreen.tsx       # App settings
├── services/          # Business logic services
│   ├── mediaDownloader.ts      # Media download logic
│   ├── downloadHistory.ts      # Download history management
│   ├── settings.ts             # Settings management
│   └── errorLogger.ts          # Local error logging
├── types/             # TypeScript type definitions
│   ├── tweet.ts               # Tweet media types
│   ├── downloadHistory.ts     # Download history types
│   └── settings.ts            # Settings types
├── utils/             # Utility functions
│   ├── tweetParser.ts         # Tweet URL parsing
│   └── fileUtils.ts           # File utilities
├── android/           # Android native code
│   ├── app/                   # Application module
│   │   ├── src/               # Source code
│   │   ├── build.gradle        # App build config
│   │   └── proguard-rules.pro # ProGuard rules
│   ├── build.gradle            # Project build config
│   ├── gradle.properties        # Gradle properties
│   ├── gradlew                 # Unix/Linux/Mac script
│   ├── gradlew.bat             # Windows script
│   └── setup-gradle.*        # Setup scripts
├── docs/              # Documentation
│   ├── SETUP.md              # Initial setup guide
│   ├── BUILDING.md            # Local build guide
│   ├── SIGNING.md             # APK signing guide
│   └── GITHUB_ACTIONS.md      # GitHub Actions guide
├── App.tsx            # Main app component
└── package.json        # Dependencies
```

## Development

### Install dependencies
```bash
npm install
```

### Run on Android
```bash
npm run android
```

### Run tests
```bash
npm test
```

### Lint
```bash
npm run lint
```

### Type check
```bash
npm run typecheck
```

## Building for Production

### Using GitHub Actions (Recommended)

See the [Building with GitHub Actions](#building-with-github-actions) section above.

### Local Build

For detailed instructions, see [docs/BUILDING.md](docs/BUILDING.md).

Quick build:
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at `android/app/build/outputs/apk/release/`

## Documentation

- [docs/SETUP.md](docs/SETUP.md) - Initial setup and Gradle wrapper generation
- [docs/BUILDING.md](docs/BUILDING.md) - Building the app locally
- [docs/SIGNING.md](docs/SIGNING.md) - Signing your APK for distribution
- [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md) - Using GitHub Actions for automated builds

## Privacy

- No data is sent to external servers
- All data is stored locally on the device
- Error logs are stored locally only
- No tracking or analytics

## License

MPL-2.0

## Credits

Based on the browser extension TwitterMediaHarvest by Elton H.Y. Chou

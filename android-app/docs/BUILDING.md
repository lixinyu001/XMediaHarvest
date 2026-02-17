# Building the Android App Locally

This guide explains how to build the Android app on your local machine.

## Prerequisites

Before building, ensure you have:

- **Node.js** (v18 or higher)
- **Java JDK** (v17 or higher)
- **Android Studio** or **Android SDK**
- **Android SDK** (API level 34 or higher)
- **Android NDK** (v25.1.8937393 or higher)

### Setting up Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio
3. Go to **SDK Manager**
4. Install:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android NDK (Side by side) 25.1.8937393
   - Android SDK Platform-Tools
5. Set `ANDROID_HOME` environment variable to your SDK location

### Setting up Environment Variables

Add these to your system environment:

**Linux/macOS** (add to `~/.bashrc` or `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.1.8937393
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**Windows** (System Properties → Environment Variables):
```
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
ANDROID_NDK_HOME=C:\Users\YourName\AppData\Local\Android\Sdk\ndk\25.1.8937393
```

Add to PATH:
```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

## Installation

1. Navigate to the android-app directory:
```bash
cd android-app
```

2. Install dependencies:
```bash
npm install
```

3. Create local.properties:
```bash
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
echo "ndk.dir=$ANDROID_NDK_HOME" >> local.properties
```

## Building

### Debug Build

For testing and development:

```bash
cd android
./gradlew assembleDebug
```

The debug APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build

For production distribution:

```bash
cd android
./gradlew assembleRelease
```

The release APK will be at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Note:** The release APK is unsigned. See [SIGNING.md](SIGNING.md) for signing instructions.

## Running on Emulator or Device

### Using React Native CLI

1. Start Metro bundler:
```bash
npm start
```

2. Run on Android:
```bash
npm run android
```

### Using Android Studio

1. Open Android Studio
2. Open the project: `android-app/android`
3. Connect your device or start emulator
4. Click the **Run** button (green triangle)

## Troubleshooting

### Gradle Build Fails

**Error:** `Could not resolve com.facebook.react:react-native-gradle-plugin`

**Solution:**
```bash
cd android-app
npm install
cd android
./gradlew clean
./gradlew build
```

**Error:** `SDK location not found`

**Solution:**
Create `android/local.properties` with:
```
sdk.dir=/path/to/your/Android/Sdk
```

**Error:** `Failed to install the following SDK components`

**Solution:**
Open Android Studio → SDK Manager and install missing components

### Metro Bundler Issues

**Error:** `Metro bundler can't find entry file`

**Solution:**
```bash
npm start -- --reset-cache
```

**Error:** `Unable to load script`

**Solution:**
```bash
adb reverse tcp:8081 tcp:8081
npm start
```

### Device Connection Issues

**Error:** `adb: device not found`

**Solution:**
```bash
adb devices
adb kill-server
adb start-server
```

Enable USB debugging on your device:
- Settings → Developer Options → USB Debugging

### Build Speed

To speed up builds:

1. **Enable Gradle caching** (already configured in workflow)
2. **Use Gradle daemon** (default)
3. **Parallel builds** (add to `gradle.properties`):
   ```properties
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

4. **Incremental builds** (default)
5. **Exclude unnecessary tasks**:
   ```bash
   ./gradlew assembleDebug -x lint -x test
   ```

## Advanced Options

### Build Specific Architecture

```bash
./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a
```

### Build with Custom Configuration

```bash
./gradlew assembleDebug -PversionCode=2 -PversionName=1.1.0
```

### Generate Bundle (for Play Store)

```bash
./gradlew bundleRelease
```

The bundle will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Clean Build

To perform a clean build:

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

Or clean everything:
```bash
rm -rf node_modules
npm install
cd android
./gradlew clean
```

## Next Steps

- [Sign your APK](SIGNING.md) for distribution
- [Set up GitHub Actions](GITHUB_ACTIONS.md) for automated builds
- [Upload to Google Play](https://developer.android.com/studio/publish)

# Android App Setup Guide

This guide explains how to set up the Android project for the first time.

## Initial Setup

### 1. Generate Gradle Wrapper

The Gradle Wrapper files (`gradlew`, `gradlew.bat`, `gradle-wrapper.jar`) need to be generated.

**Option A: Using existing wrapper (Recommended)**

The project already includes `gradlew` and `gradlew.bat` scripts. You only need to generate the `gradle-wrapper.jar`:

```bash
cd android-app/android
gradle wrapper --gradle-version 8.3
```

**Option B: Generate from scratch**

```bash
cd android-app/android
gradle wrapper
```

This will generate:
- `gradlew` - Unix/Linux/Mac script
- `gradlew.bat` - Windows script
- `gradle/wrapper/gradle-wrapper.jar` - Wrapper JAR
- `gradle/wrapper/gradle-wrapper.properties` - Wrapper properties

### 2. Install Dependencies

```bash
cd android-app
npm install
```

### 3. Create local.properties

```bash
cd android-app/android
echo "sdk.dir=$ANDROID_HOME" > local.properties
echo "ndk.dir=$ANDROID_NDK_HOME" >> local.properties
```

## Verify Setup

Check that all required files exist:

```bash
cd android-app/android
ls -la gradlew gradlew.bat
ls -la gradle/wrapper/gradle-wrapper.jar
ls -la gradle/wrapper/gradle-wrapper.properties
ls -la local.properties
```

## Common Issues

### Missing gradle-wrapper.jar

**Error:** `Could not find or load main class 'org.gradle.wrapper.GradleWrapperMain'`

**Solution:** Generate the wrapper:
```bash
cd android-app/android
gradle wrapper --gradle-version 8.3
```

### Permission Denied on gradlew

**Error:** `Permission denied: ./gradlew`

**Solution:** Grant execute permission:
```bash
chmod +x gradlew
```

### JAVA_HOME Not Set

**Error:** `JAVA_HOME is not set`

**Solution:** Set JAVA_HOME environment variable:

**Linux/macOS** (add to `~/.bashrc` or `~/.zshrc`):
```bash
export JAVA_HOME=/path/to/java
export PATH=$PATH:$JAVA_HOME/bin
```

**Windows** (System Properties → Environment Variables):
```
JAVA_HOME=C:\Program Files\Java\jdk-17
PATH=%PATH%;%JAVA_HOME%\bin
```

### ANDROID_HOME Not Set

**Error:** `sdk.dir is not defined`

**Solution:** Set ANDROID_HOME environment variable:

**Linux/macOS**:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

**Windows**:
```
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

## Next Steps

After setup is complete:

1. **Build Debug APK**:
   ```bash
   cd android-app/android
   ./gradlew assembleDebug
   ```

2. **Build Release APK**:
   ```bash
   cd android-app/android
   ./gradlew assembleRelease
   ```

3. **Run on Device**:
   ```bash
   cd android-app
   npm run android
   ```

For more details, see:
- [BUILDING.md](BUILDING.md) - Building guide
- [SIGNING.md](SIGNING.md) - APK signing
- [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) - GitHub Actions

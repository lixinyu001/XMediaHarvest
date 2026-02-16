# GitHub Actions Build Guide

This guide explains how to build Android APKs using GitHub Actions.

## Automatic Builds

APKs are automatically built when:

1. **Push to main/master branch**
2. **Create a release tag** (e.g., `v1.0.0`)
3. **Pull request to main/master**
4. **Manual trigger** via GitHub Actions UI

## Workflow Triggers

### Push to Main Branch
```bash
git push origin main
```

### Create Release Tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

This will:
- Build both debug and release APKs
- Create a GitHub Release
- Attach APKs to the release

### Manual Trigger
1. Go to **Actions** tab in your repository
2. Select **Build Android APK** workflow
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## Downloading APKs

### From Actions Artifacts
1. Go to **Actions** tab
2. Click on the workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `app-debug` - Debug APK for testing
   - `app-release` - Release APK (unsigned)

### From GitHub Releases
1. Go to **Releases** tab
2. Click on the release version
3. Download the APKs from the assets section

## Build Types

### Debug APK
- **Purpose**: Testing and development
- **Signing**: Automatically signed with debug keystore
- **Size**: Larger (includes debug symbols)
- **Performance**: Slower
- **Use case**: Internal testing, development

### Release APK
- **Purpose**: Distribution to users
- **Signing**: Unsigned (needs signing for distribution)
- **Size**: Optimized
- **Performance**: Optimized
- **Use case**: Production distribution

## Build Logs

To view build logs:

1. Go to **Actions** tab
2. Click on the workflow run
3. Click on the job name
4. Expand each step to see logs

Common issues to check:
- Dependency installation failures
- Compilation errors
- Test failures
- APK signing issues

## Caching

The workflow uses caching to speed up builds:

- **Node modules**: Cached by `package-lock.json`
- **Gradle packages**: Cached by Gradle files
- **Android SDK**: Not cached (installed fresh each time)

Cache is automatically invalidated when dependencies change.

## Environment Variables

The workflow uses these environment variables:

- `ANDROID_HOME`: Android SDK location
- `ANDROID_NDK_HOME`: Android NDK location
- `JAVA_HOME`: Java installation location

These are automatically set by the setup actions.

## Troubleshooting

### Build Fails

1. **Check the logs** for specific error messages
2. **Verify dependencies** in `package.json`
3. **Check Gradle version** compatibility
4. **Ensure all files** are committed

### APK Not Generated

1. **Verify build completed** successfully
2. **Check artifact section** for APK files
3. **Look for build errors** in the logs
4. **Ensure Gradle wrapper** is properly configured

### Release Not Created

1. **Verify tag format** (must start with `v`)
2. **Check GITHUB_TOKEN** permissions
3. **Ensure workflow** has write permissions
4. **Verify repository settings** allow releases

## Customization

### Change Build Configuration

Edit `.github/workflows/build-android-apk.yml` to:
- Change Node.js version
- Modify Gradle commands
- Add additional build steps
- Change artifact retention period

### Add Signing

Follow the [SIGNING.md](SIGNING.md) guide to add APK signing.

### Add Tests

Add test steps to the workflow:

```yaml
- name: Run Tests
  working-directory: ./android-app
  run: npm test
```

## Best Practices

1. **Test locally** before pushing
2. **Use meaningful commit messages**
3. **Follow semantic versioning** for tags
4. **Review build logs** regularly
5. **Keep dependencies updated**
6. **Monitor build times** and optimize if needed

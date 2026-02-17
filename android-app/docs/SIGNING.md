# Android APK Signing Guide

This guide explains how to sign your APK for distribution.

## Option 1: Debug APK (For Testing)

The debug APK is automatically signed with a debug keystore and can be used for testing.

## Option 2: Release APK (For Distribution)

To create a signed release APK, you need to:

### 1. Generate a Keystore

Run this command in your terminal:

```bash
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

You will be prompted to enter:
- Keystore password
- Key password
- Name, organization, etc.

**Important:** Store the keystore file and passwords securely. Never commit them to Git!

### 2. Add Keystore to GitHub Secrets

For GitHub Actions to sign the APK, add the following secrets to your repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   - `KEYSTORE_FILE`: Base64 encoded keystore file
   - `KEYSTORE_PASSWORD`: Your keystore password
   - `KEY_ALIAS`: Your key alias (default: `release`)
   - `KEY_PASSWORD`: Your key password

To encode the keystore file:

```bash
base64 -i release.keystore | pbcopy  # macOS
base64 -w 0 release.keystore  # Linux
certutil -encode release.keystore output.txt  # Windows
```

### 3. Update GitHub Actions Workflow

The workflow will automatically sign the APK if the secrets are configured.

### 4. Local Signing

To sign the APK locally:

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

## Security Best Practices

1. **Never commit keystore files** to version control
2. **Use strong passwords** for keystore and key
3. **Store passwords securely** using GitHub Secrets or a password manager
4. **Backup your keystore** in a secure location
5. **Use different passwords** for keystore and key

## Troubleshooting

### Invalid Keystore Format

If you get an error about invalid keystore format, ensure you:
- Used Base64 encoding correctly
- Added the entire encoded string to the secret
- Didn't add any extra whitespace or line breaks

### Password Errors

If password errors occur:
- Verify the passwords match what you entered during keystore creation
- Check for typos in the secret values
- Ensure you're using the correct key alias

### Signing Failed

If signing fails:
- Verify the keystore file is not corrupted
- Check that the key alias is correct
- Ensure the passwords are correct
- Try regenerating the keystore if necessary

#!/bin/bash

echo "======================================"
echo "Twitter Media Harvest - Android Setup"
echo "======================================"
echo ""

cd "$(dirname "$0")"

echo "Checking for Gradle..."
if ! command -v gradle &> /dev/null; then
    echo "❌ Gradle is not installed"
    echo ""
    echo "Please install Gradle first:"
    echo "  macOS: brew install gradle"
    echo "  Linux: sudo apt install gradle"
    echo "  Or download from: https://gradle.org/install/"
    exit 1
fi

echo "✓ Gradle found: $(gradle --version | grep Gradle)"
echo ""

echo "Generating Gradle Wrapper..."
gradle wrapper --gradle-version 8.3

if [ $? -eq 0 ]; then
    echo "✓ Gradle Wrapper generated successfully"
    echo ""
    echo "Generated files:"
    ls -la gradlew gradlew.bat 2>/dev/null || echo "  (gradlew - Unix/Linux/Mac script)"
    ls -la gradle/wrapper/gradle-wrapper.jar 2>/dev/null || echo "  (gradle-wrapper.jar - Wrapper JAR)"
    ls -la gradle/wrapper/gradle-wrapper.properties 2>/dev/null || echo "  (gradle-wrapper.properties - Wrapper properties)"
    echo ""
    echo "======================================"
    echo "Setup complete!"
    echo "======================================"
    echo ""
    echo "Next steps:"
    echo "  1. Run: npm install"
    echo "  2. Run: npm run android"
    echo "  3. Or build APK: ./gradlew assembleDebug"
else
    echo "❌ Failed to generate Gradle Wrapper"
    exit 1
fi

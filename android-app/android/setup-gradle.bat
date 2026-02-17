@echo off
echo ======================================
echo Twitter Media Harvest - Android Setup
echo ======================================
echo.

cd /d "%~dp0"

echo Checking for Gradle...
where gradle >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Gradle is not installed
    echo.
    echo Please install Gradle first:
    echo   Download from: https://gradle.org/install/
    exit /b 1
)

for /f "tokens=*" %%i in ('gradle --version') do set GRADLE_VERSION=%%i
echo ✓ Gradle found: %GRADLE_VERSION%
echo.

echo Generating Gradle Wrapper...
call gradle wrapper --gradle-version 8.3

if %ERRORLEVEL% equ 0 (
    echo ✓ Gradle Wrapper generated successfully
    echo.
    echo Generated files:
    if exist gradlew.bat echo   gradlew.bat - Windows script
    if exist gradle\wrapper\gradle-wrapper.jar echo   gradle-wrapper.jar - Wrapper JAR
    if exist gradle\wrapper\gradle-wrapper.properties echo   gradle-wrapper.properties - Wrapper properties
    echo.
    echo ======================================
    echo Setup complete!
    echo ======================================
    echo.
    echo Next steps:
    echo   1. Run: npm install
    echo   2. Run: npm run android
    echo   3. Or build APK: gradlew.bat assembleDebug
) else (
    echo ❌ Failed to generate Gradle Wrapper
    exit /b 1
)

# UI Assets Guide

## 📱 Application Icons

### App Icon (应用图标)
- **File**: `assets/icons/app-icon.svg`
- **Description**: Main application icon for launcher
- **Required Sizes**:
  - mdpi: 48×48px
  - hdpi: 72×72px
  - xhdpi: 96×96px
  - xxhdpi: 144×144px
  - xxxhdpi: 192×192px
  - Play Store: 512×512px

### Conversion Instructions
```bash
# Using ImageMagick
convert app-icon.svg -resize 48x48 ic_launcher-mdpi.png
convert app-icon.svg -resize 72x72 ic_launcher-hdpi.png
convert app-icon.svg -resize 96x96 ic_launcher-xhdpi.png
convert app-icon.svg -resize 144x144 ic_launcher-xxhdpi.png
convert app-icon.svg -resize 192x192 ic_launcher-xxxhdpi.png
convert app-icon.svg -resize 512x512 play-store-icon.png
```

### Installation
Copy the generated PNG files to:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

## 🎨 Feature Icons (功能图标)

### Available Icons
1. **Download Icon** - `assets/icons/download.svg`
2. **Share Icon** - `assets/icons/share.svg`
3. **Settings Icon** - `assets/icons/settings.svg`
4. **History Icon** - `assets/icons/history.svg`
5. **Video Icon** - `assets/icons/video.svg`
6. **Image Icon** - `assets/icons/image.svg`

### Usage in React Native
```typescript
import { Image } from 'react-native'

// Using SVG directly (requires react-native-svg)
import SvgDownload from '../assets/icons/download.svg'

<SvgDownload width={24} height={24} />

// Or convert to PNG and use
<Image 
  source={require('../assets/icons/download.png')} 
  style={{ width: 24, height: 24 }} 
/>
```

### Conversion to PNG
```bash
# Convert all icons to 24x24 PNG
for file in assets/icons/*.svg; do
  basename=$(basename "$file" .svg)
  convert "$file" -resize 24x24 "assets/icons/${basename}.png"
done
```

## 🖼️ Splash Screen (启动画面)

### File
- **File**: `assets/splash-screen.svg`
- **Size**: 1080×1920px (1080p)
- **Alternative Sizes**:
  - 720×1280px (720p)
  - 1440×2560px (2K)

### Installation
1. Convert SVG to PNG:
```bash
convert splash-screen.svg -resize 1080x1920 splash_screen.png
```

2. Copy to drawable folder:
```bash
cp splash_screen.png android/app/src/main/res/drawable/splash_screen.png
```

3. Update `android/app/src/main/res/values/styles.xml`:
```xml
<style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowBackground">@drawable/splash_screen</item>
</style>
```

4. Update `AndroidManifest.xml`:
```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/SplashTheme"
    ...>
```

## 🎨 Color Palette (配色方案)

### Primary Colors
```css
--twitter-blue: #1DA1F2
--twitter-blue-dark: #0D8BD9
```

### Background Colors
```css
--bg-primary: #15202B
--bg-secondary: #202336
--bg-tertiary: #38444D
```

### Text Colors
```css
--text-primary: #FFFFFF
--text-secondary: #8899A6
--text-tertiary: #657786
```

### Accent Colors
```css
--accent-error: #E0245E
--accent-warning: #FFAD1F
--accent-success: #17BF63
--accent-info: #1DA1F2
```

## 📐 Design Guidelines

### Icon Design Principles
1. **Simplicity**: Keep icons simple and recognizable
2. **Consistency**: Use consistent stroke width and corner radius
3. **Color**: Use Twitter Blue (#1DA1F2) as primary color
4. **Size**: Design at 24×24px base size, scale up as needed

### Typography
- **Font Family**: System fonts (San Francisco on iOS, Roboto on Android)
- **Font Weights**:
  - Bold: Headings and titles
  - Medium: Body text
  - Regular: Secondary text
- **Font Sizes**:
  - Large: 28-32px (Titles)
  - Medium: 16-18px (Body)
  - Small: 12-14px (Captions)

### Spacing
- **Base Unit**: 8px
- **Padding**: 16px (2 units)
- **Margin**: 8-16px (1-2 units)
- **Border Radius**: 8px (1 unit)

## 🛠️ Tools for Asset Conversion

### Online Tools
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png)
- [SVG to PNG](https://svgtopng.com/)

### Desktop Tools
- **ImageMagick**: Command-line tool for batch conversion
- **Inkscape**: Free vector graphics editor
- **Adobe Illustrator**: Professional vector graphics editor
- **Figma**: Design tool with export options

### React Native Libraries
```bash
# For using SVG directly
npm install react-native-svg
npx react-native link react-native-svg

# For image optimization
npm install react-native-fast-image
npx react-native link react-native-fast-image
```

## 📦 Asset Organization

```
android-app/
├── assets/
│   ├── icons/
│   │   ├── app-icon.svg
│   │   ├── download.svg
│   │   ├── share.svg
│   │   ├── settings.svg
│   │   ├── history.svg
│   │   ├── video.svg
│   │   └── image.svg
│   └── splash-screen.svg
└── android/
    └── app/
        └── src/
            └── main/
                └── res/
                    ├── mipmap-*/ic_launcher.png
                    ├── drawable/splash_screen.png
                    └── values/colors.xml
```

## 🎯 Next Steps

1. **Convert SVG to PNG**: Use the conversion instructions above
2. **Install Icons**: Copy PNG files to appropriate directories
3. **Test**: Run the app to verify icons display correctly
4. **Optimize**: Compress PNG files to reduce app size
5. **Version Control**: Commit asset files to Git

## 💡 Tips

- Use vector formats (SVG) for scalability
- Optimize PNG files for smaller app size
- Test icons on different screen densities
- Follow Material Design guidelines for Android
- Ensure good contrast for accessibility
- Test on real devices, not just emulators

## 📞 Support

If you need custom icons or have questions about the assets:
- Check the [React Native Icons](https://github.com/oblador/react-native-vector-icons) library
- Use [Material Design Icons](https://material.io/resources/icons/)
- Refer to [Android Iconography](https://material.io/design/iconography/) guidelines

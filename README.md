# TwitterMediaHarvest Android

**一键获取Twitter媒体内容的Android应用。**

## 功能特性

- [x] 一键获取原始尺寸图片
- [x] 一键获取视频
- [x] 下载历史记录
- [x] 剪贴板自动监测Twitter链接
- [x] 分享菜单集成
- [x] 内置媒体查看器
- [x] 多线程并发下载
- [x] 视频质量选择（高/中/低）
- [x] 本地错误日志记录
- [x] 不依赖第三方服务
- [x] 美观且强大

## 安装

### 从GitHub Actions构建APK

1. 前往项目的 [Actions](https://github.com/EltonChou/TwitterMediaHarvest/actions) 页面
2. 选择 "Build Android APK" 工作流
3. 点击 "Run workflow" 手动触发构建
4. 构建完成后，在Artifacts部分下载APK文件

### 本地构建

#### 环境要求

- Node.js 18+
- Java JDK 11 或 17
- Android SDK
- React Native CLI

#### 构建步骤

1. 安装依赖：
```bash
cd android-app
npm install
```

2. 设置Gradle（如果需要）：
```bash
# Windows
setup-gradle.bat

# Linux/Mac
bash setup-gradle.sh
```

3. 构建APK：
```bash
cd android
./gradlew assembleRelease
```

构建完成后，APK文件位于 `android/app/build/outputs/apk/release/` 目录。

## 配置

### APK签名

要生成签名的发布版APK，请参考 [SIGNING.md](android-app/docs/SIGNING.md) 文档。

### GitHub Secrets配置

在GitHub仓库的Settings -> Secrets and variables -> Actions中配置以下密钥：

- `KEYSTORE_FILE_BASE64`: 签名文件的Base64编码
- `KEYSTORE_PASSWORD`: 密钥库密码
- `KEY_ALIAS`: 密钥别名
- `KEY_PASSWORD`: 密钥密码

详细说明请参考 [GITHUB_ACTIONS.md](android-app/docs/GITHUB_ACTIONS.md)。

## 文档

- [构建指南](android-app/docs/BUILDING.md)
- [GitHub Actions配置](android-app/docs/GITHUB_ACTIONS.md)
- [APK签名指南](android-app/docs/SIGNING.md)
- [设置指南](android-app/docs/SETUP.md)
- [UI资源文档](android-app/docs/UI_ASSETS.md)

## 开发

### 项目结构

```
android-app/
├── android/              # Android原生代码
├── assets/              # 资源文件
├── components/          # React Native组件
├── docs/               # 文档
├── navigation/         # 导航配置
├── screens/            # 应用页面
├── services/           # 业务逻辑服务
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── App.tsx             # 应用入口
├── package.json        # 依赖配置
└── README.md           # Android应用说明
```

### 主要功能模块

- **HomeScreen**: 主页面，支持手动输入Twitter链接
- **TweetDetailScreen**: 推文详情页面，显示和下载媒体内容
- **DownloadHistoryScreen**: 下载历史记录页面
- **SettingsScreen**: 设置页面，包含视频质量、保存位置等设置
- **ErrorLogsScreen**: 错误日志查看页面
- **AboutScreen**: 关于页面

### 服务模块

- **mediaDownloader**: 媒体下载服务
- **concurrentDownloader**: 并发下载服务
- **clipboardListener**: 剪贴板监听服务
- **shareIntentListener**: 分享意图监听服务
- **downloadHistory**: 下载历史管理
- **errorLogger**: 错误日志记录
- **settings**: 设置管理

## 许可证

- [LICENSE](LICENSE)

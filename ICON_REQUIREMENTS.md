# Android 应用图标需求清单

## 1. 应用启动器图标（Launcher Icons）

### 1.1 标准启动器图标
这些图标显示在Android设备的主屏幕和应用抽屉中。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 48×48 | `res/mipmap-mdpi/ic_launcher.png` | 中等密度屏幕 |
| hdpi | 72×72 | `res/mipmap-hdpi/ic_launcher.png` | 高密度屏幕 |
| xhdpi | 96×96 | `res/mipmap-xhdpi/ic_launcher.png` | 超高密度屏幕 |
| xxhdpi | 144×144 | `res/mipmap-xxhdpi/ic_launcher.png` | 超超高密度屏幕 |
| xxxhdpi | 192×192 | `res/mipmap-xxxhdpi/ic_launcher.png` | 超超超高密度屏幕 |

**作用**：
- 显示在Android设备的主屏幕上
- 显示在应用抽屉中
- 代表应用的品牌形象
- 用户点击后启动应用

**设计要求**：
- 建议使用正方形图标
- 避免过于复杂的细节
- 使用品牌主色调
- 确保在小尺寸下仍然清晰可辨

### 1.2 圆形启动器图标
这些图标用于支持圆形图标显示的设备。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 48×48 | `res/mipmap-mdpi/ic_launcher_round.png` | 中等密度屏幕 |
| hdpi | 72×72 | `res/mipmap-hdpi/ic_launcher_round.png` | 高密度屏幕 |
| xhdpi | 96×96 | `res/mipmap-xhdpi/ic_launcher_round.png` | 超高密度屏幕 |
| xxhdpi | 144×144 | `res/mipmap-xxhdpi/ic_launcher_round.png` | 超超高密度屏幕 |
| xxxhdpi | 192×192 | `res/mipmap-xxxhdpi/ic_launcher_round.png` | 超超超高密度屏幕 |

**作用**：
- 在支持圆形图标的设备上显示
- 提供更统一的视觉体验
- 适配不同厂商的UI设计

**设计要求**：
- 必须是圆形图标
- 内容居中显示
- 避免重要内容被裁剪
- 与标准图标保持一致的设计风格

## 2. 自适应图标（Adaptive Icons）

Android 8.0（API 26）及以上版本支持自适应图标，允许设备厂商自定义图标形状。

### 2.1 前景层（Foreground Layer）

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 108×108 | `res/mipmap-anydpi-v26/ic_launcher_foreground.xml` | 中等密度屏幕 |
| hdpi | 162×162 | `res/drawable-hdpi/ic_launcher_foreground.png` | 高密度屏幕 |
| xhdpi | 216×216 | `res/drawable-xhdpi/ic_launcher_foreground.png` | 超高密度屏幕 |
| xxhdpi | 324×324 | `res/drawable-xxhdpi/ic_launcher_foreground.png` | 超超高密度屏幕 |
| xxxhdpi | 432×432 | `res/drawable-xxxhdpi/ic_launcher_foreground.png` | 超超超高密度屏幕 |

**作用**：
- 自适应图标的前景部分
- 显示在蒙版之上
- 可以是透明背景

**设计要求**：
- 尺寸为108dp（实际像素根据密度调整）
- 可以包含透明区域
- 重要的视觉元素应保持在中心66×66dp区域内

### 2.2 背景层（Background Layer）

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 108×108 | `res/mipmap-anydpi-v26/ic_launcher_background.xml` | 中等密度屏幕 |
| hdpi | 162×162 | `res/drawable-hdpi/ic_launcher_background.png` | 高密度屏幕 |
| xhdpi | 216×216 | `res/drawable-xhdpi/ic_launcher_background.png` | 超高密度屏幕 |
| xxhdpi | 324×324 | `res/drawable-xxhdpi/ic_launcher_background.png` | 超超高密度屏幕 |
| xxxhdpi | 432×432 | `res/drawable-xxxhdpi/ic_launcher_background.png` | 超超超高密度屏幕 |

**作用**：
- 自适应图标的背景部分
- 填充整个图标区域
- 通常使用纯色或渐变

**设计要求**：
- 尺寸为108dp
- 不应包含透明区域
- 使用品牌主色调

### 2.3 单色图标（Monochrome Icon）

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 108×108 | `res/mipmap-anydpi-v26/ic_launcher_monochrome.xml` | 中等密度屏幕 |
| hdpi | 162×162 | `res/drawable-hdpi/ic_launcher_monochrome.png` | 高密度屏幕 |
| xhdpi | 216×216 | `res/drawable-xhdpi/ic_launcher_monochrome.png` | 超高密度屏幕 |
| xxhdpi | 324×324 | `res/drawable-xxhdpi/ic_launcher_monochrome.png` | 超超高密度屏幕 |
| xxxhdpi | 432×432 | `res/drawable-xxxhdpi/ic_launcher_monochrome.png` | 超超超高密度屏幕 |

**作用**：
- 用于浅色/深色主题切换
- 提供单色版本的图标
- 适配系统主题

**设计要求**：
- 只使用白色或黑色
- 保持图标形状
- 简洁清晰

## 3. 通知图标（Notification Icons）

### 3.1 状态栏图标
显示在状态栏的通知区域。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 24×24 | `res/drawable-mdpi/ic_notification.png` | 中等密度屏幕 |
| hdpi | 36×36 | `res/drawable-hdpi/ic_notification.png` | 高密度屏幕 |
| xhdpi | 48×48 | `res/drawable-xhdpi/ic_notification.png` | 超高密度屏幕 |
| xxhdpi | 72×72 | `res/drawable-xxhdpi/ic_notification.png` | 超超高密度屏幕 |
| xxxhdpi | 96×96 | `res/drawable-xxxhdpi/ic_notification.png` | 超超超高密度屏幕 |

**作用**：
- 显示在状态栏
- 表示有新的通知
- 提示用户查看

**设计要求**：
- 尺寸为24dp
- 必须是白色（透明背景）
- 简洁的单色图标
- 避免过于复杂的细节

### 3.2 通知大图标
显示在通知卡片中。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 64×64 | `res/drawable-mdpi/ic_notification_large.png` | 中等密度屏幕 |
| hdpi | 96×96 | `res/drawable-hdpi/ic_notification_large.png` | 高密度屏幕 |
| xhdpi | 128×128 | `res/drawable-xhdpi/ic_notification_large.png` | 超高密度屏幕 |
| xxhdpi | 192×192 | `res/drawable-xxhdpi/ic_notification_large.png` | 超超高密度屏幕 |
| xxxhdpi | 256×256 | `res/drawable-xxxhdpi/ic_notification_large.png` | 超超超高密度屏幕 |

**作用**：
- 显示在通知卡片中
- 提供更详细的视觉信息
- 增强通知的识别度

**设计要求**：
- 尺寸为64dp
- 可以使用彩色
- 与应用图标风格一致
- 清晰可辨

## 4. 其他图标（可选）

### 4.1 快捷方式图标（Shortcut Icons）
用于应用快捷方式。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 48×48 | `res/mipmap-mdpi/ic_shortcut_*.png` | 中等密度屏幕 |
| hdpi | 72×72 | `res/mipmap-hdpi/ic_shortcut_*.png` | 高密度屏幕 |
| xhdpi | 96×96 | `res/mipmap-xhdpi/ic_shortcut_*.png` | 超高密度屏幕 |
| xxhdpi | 144×144 | `res/mipmap-xxhdpi/ic_shortcut_*.png` | 超超高密度屏幕 |
| xxxhdpi | 192×192 | `res/mipmap-xxxhdpi/ic_shortcut_*.png` | 超超超高密度屏幕 |

**作用**：
- 用于应用快捷方式
- 长按应用图标显示
- 快速访问特定功能

### 4.2 操作栏图标（Action Bar Icons）
用于应用内的操作按钮。

| 密度 | 尺寸（像素） | 文件路径 | 用途 |
|------|-------------|----------|------|
| mdpi | 24×24 | `res/drawable-mdpi/ic_action_*.png` | 中等密度屏幕 |
| hdpi | 36×36 | `res/drawable-hdpi/ic_action_*.png` | 高密度屏幕 |
| xhdpi | 48×48 | `res/drawable-xhdpi/ic_action_*.png` | 超高密度屏幕 |
| xxhdpi | 72×72 | `res/drawable-xxhdpi/ic_action_*.png` | 超超高密度屏幕 |
| xxxhdpi | 96×96 | `res/drawable-xxxhdpi/ic_action_*.png` | 超超超高密度屏幕 |

**作用**：
- 显示在操作栏中
- 表示各种操作（如设置、搜索等）
- 提供直观的视觉反馈

## 5. 最小必需图标清单

为了应用能够正常构建和运行，至少需要以下图标：

### 必需（V1.0版本）
- ✅ `ic_launcher` - 5种密度（mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi）
- ✅ `ic_launcher_round` - 5种密度（mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi）

### 推荐（V1.0版本）
- ⭐ `ic_notification` - 5种密度（用于下载通知）
- ⭐ `ic_notification_large` - 5种密度（用于通知卡片）

### 可选（后续版本）
- 🔸 自适应图标（Adaptive Icons）
- 🔸 快捷方式图标（Shortcut Icons）
- 🔸 操作栏图标（Action Bar Icons）

## 6. 图标设计建议

### 6.1 设计原则
1. **简洁性**：避免过于复杂的细节
2. **一致性**：所有图标保持统一的设计风格
3. **可识别性**：在小尺寸下仍然清晰可辨
4. **品牌性**：体现应用的品牌特色

### 6.2 颜色建议
- 使用品牌主色调
- 确保在不同背景下都清晰可见
- 考虑浅色/深色主题的适配

### 6.3 格式建议
- 使用PNG格式（支持透明背景）
- 确保适当的压缩质量
- 优化文件大小以提高性能

## 7. 生成工具推荐

### 7.1 在线工具
- **Android Asset Studio**: https://romannurik.github.io/AssetStudio/
- **MakeAppIcon**: https://makeappicon.com/
- **AppIconGenerator**: https://appicon.co/

### 7.2 设计软件
- **Adobe Illustrator**: 专业矢量图形设计
- **Figma**: 在线设计工具，支持图标设计
- **Sketch**: Mac平台的设计工具
- **GIMP**: 免费开源的图像编辑软件

### 7.3 命令行工具
- **ImageMagick**: 批量处理图标
- **Android Studio**: 内置的Image Asset工具

## 8. 实施步骤

### 8.1 创建图标
1. 设计主图标（建议从512×512开始）
2. 导出为PNG格式
3. 使用工具生成所有尺寸

### 8.2 放置图标
1. 在`app/src/main/res/`下创建相应的目录
2. 将图标文件放置到对应的目录中
3. 确保文件名与AndroidManifest.xml中引用的一致

### 8.3 测试图标
1. 在不同密度的设备上测试
2. 检查在主屏幕、应用抽屉、通知中的显示效果
3. 验证在浅色/深色主题下的表现

## 9. 当前项目状态

### 缺失的图标
- ❌ `ic_launcher` - 所有密度
- ❌ `ic_launcher_round` - 所有密度

### 需要创建的目录
- `app/src/main/res/mipmap-mdpi/`
- `app/src/main/res/mipmap-hdpi/`
- `app/src/main/res/mipmap-xhdpi/`
- `app/src/main/res/mipmap-xxhdpi/`
- `app/src/main/res/mipmap-xxxhdpi/`

### 下一步行动
1. 设计或生成应用图标
2. 创建所需的mipmap目录
3. 将图标文件放置到对应目录
4. 测试构建是否成功

---

**文档版本**: 1.0
**创建日期**: 2026-02-17
**适用项目**: XMediaHarvest
**目标版本**: V1.0

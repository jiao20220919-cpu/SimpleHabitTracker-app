# 🚀 极简习惯追踪器 - 多端上架与发布准备指南 (Desktop & Mobile Launch Guide)

我们已为您配置了 **PWA (Progressive Web App) 渐进式网页型桌面端支持** 以及 **Capacitor 安卓原生移动端基础结构**。此外，我们生成并放置了符合上架视觉包装标准的首发应用图标 `/public/icon.jpg`。

以下是帮助您在「电脑端（桌面端）」和「手机端（移动端）」成功上架、分发、部署及安装的所有前置准备工作。

---

## 💻 一、电脑桌面端 (Desktop/Web) 极速发布指南

本项目不仅是网页，由于已融入 PWA 标准，发布后将**支持桌面端一键安装（免下载 exe，双击图标像 native 软件一样在独立窗口运行）**。

### 1-1. 网页托管部署 (首选)
要将习惯追踪器发布为线上网站，您可选择以下免费且支持秒级自动化构建的服务：
- **Vercel** ([Vercel.com](https://vercel.com/)) 或 **Netlify** ([Netlify.com](https://netlify.com/)):
  1. 注册并登录，支持关联 GitHub。
  2. 点击 "Add New Project" 并导入当前代码。
  3. 配置参数（使用默认）：
     - Build Command: `npm run build`
     - Output Directory: `dist`
  4. 点击 **Deploy**，部署成功后即可获得专属 HTTPS 域名链接。

### 1-2. 体验桌面端“原生”应用安装
在部署后的 HTTPS 地址下：
1. 使用 **Google Chrome / Microsoft Edge** 浏览器在电脑上打开您的链接。
2. 您会发现在地址栏右侧会出现一个 **「🌟 电脑下载/安装应用程序」** 图标。
3. 点击 **安装**，应用将直接添加到您的电脑桌面与应用程序列表（启动台/开始菜单）。
4. 启动后，它拥有独立的无浏览器边框窗口、原生顶栏、完全脱离普通网址的沉浸体验！

---

## 📱 二、手机移动端 (Mobile - Android) 原生上架准备

我们已经为您预埋了完整的 Capacitor 配置：

### 2-1. 确认应用包名（App ID）与名称
项目根目录下的 `capacitor.config.ts` 是原生的中枢配置文件：
- **应用包名**: 当前默认是 `com.minimalhabit.app`。
  - 如果您需要上架 Google Play 等应用商店，可以替换为您的专属域名倒序（如 `com.yourcompany.habit`）。
- **应用名称**: 默认是 `极简习惯追踪器`。
- **注意**：修改此配置后，需要在本地解压项目运行 `npx cap sync` 刷新原生应用底层设定。

### 2-2. 手机端应用图标与启动页 (Icons & Splash) 的批量替换
上架手机应用商店需要准备多套尺寸的图标。我们在 `/public/icon.jpg` 放置了一张高品质 3D 渲染的 **512x512** 现代极简习惯打卡（勾与萌芽）主题图作为根源材质，您可以直接：
1. 建议在本地使用 `cordova-res` 等命令行工具**一键生成安卓所需的所有多层级、自适应图标与启动页**：
   ```bash
   # 在您的电脑终端执行（需先安装该工具）
   npm install -g cordova-res
   
   # 在项目根目录下，准备符合尺寸的 icon.png (至少 1024x1024) 放入 /resources/
   cordova-res android --skip-config --copy
   ```
2. 或者是直接启动 Local 的 **Android Studio**，使用 Image Asset Studio 资源导入工具生成对应的 mipmap 图标：
   - 打开 Android Studio ➜ 右键 `app/res` 目录 ➜ 选择 `New` ➜ `Image Asset`。
   - `Asset Type` 选择 `Image`，路径选择 `/public/icon.jpg`。
   - 适当调整缩放比例 (Resize) 与背景颜色（由于是极简深色/浅色，可设置为近黑色的 Hex `#09090b` 或者是乳白色），点击 `Finish`，AS 将秒级为您适配安卓各分辨率。

### 2-3. 生成用于上架的自签名证书安全密钥 (Keystore)
上架 Google Play 或国内各大应用商城，都需要对 APK 或者是 AAB 文件进行签名。请在电脑的终端中使用以下 JDK 命令行工具（或者在 Android Studio 的 Generate Signed Bundle 窗口可视化操作）生成签名：
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias habit-key -keyalg RSA -keysize 2048 -validity 10000
```
- 之后生成的 `.keystore` 文件需要妥善保管。未来每次版本更新，都必须使用同一个密钥加密签名，否则商店会拒绝更新。

### 2-4. 打包并打包生成 `.aab` (Google Play 专用格式)
现在所有应用商店（特别是 Google Play）都要求提交 `.aab` (Android App Bundle) 格式，而不是 debug 使用的 `.apk` 文件。
1. 在本地打开解压后的 **Android Studio** 项目。
2. 顶栏菜单选择：`Build` ➜ `Generate Signed Bundle / APK(s)...`
3. 选择 `Android App Bundle` 并点击 `Next`。
4. 选择上面步骤中生成的 `my-release-key.keystore` 密钥，输入设定的密钥库密码。
5. 选择 `release` 变体，并点击 `Create` 按钮。
6. 打包进度条读完后，点击提示框的 `locate` 即可找到您的 `app-release.aab` 文件。
7. 直接将这个 `.aab` 精品发布文件上传至您的 **Google Play Console / 华为/小米开发者平台** 即可！

---

## 🛠️ 三、开发者本地 1 分钟开机极速编译指南（Capacitor 原理说明）
当您点击 **Export to ZIP** 下载了代码包后，只需在电脑做以下动作即可完全掌握整个源码：
1. **安装环境依赖**：
   ```bash
   npm install
   ```
2. **预览 & 修改调试**：
   ```bash
   npm run dev
   ```
3. **打包网络底层，并将改动一键部署到手机底座**（这也是 Android Studio 内代码自动刷新的底层原理）：
   ```bash
   npm run build:android
   ```

祝您的《极简习惯追踪器》多平台（Desktop 独立客户端 + 移动端 Native App）发布大获成功！ 🎉

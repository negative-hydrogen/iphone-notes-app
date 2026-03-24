# 📝 Notes App — Apple Notes Clone for Android

A pixel-perfect Apple Notes clone for Android with full feature parity.

## ✅ Features

- **Rich Text Editor** — Bold, italic, underline, strikethrough, headings (Title/Heading/Subheading/Body), blockquote, code blocks
- **Checklists** — Tap to check/uncheck items, visual strikethrough on done items
- **Bullet & Numbered Lists**
- **Tables** — Insert tables directly in notes
- **Folders** — Default + create custom folders, move notes between folders
- **Tags** — Auto-detect `#tags` in note content, tap tags to filter notes
- **Pinning** — Pin notes to top of list, swipe left to pin quickly
- **Flagging** — Flag notes, dedicated Flagged folder
- **Lock Notes** — 4-digit PIN to lock private notes, biometric unlock
- **Note Colors** — 9 color options for visual organization
- **Search** — Global search across all notes, folder-level search
- **Sort Options** — By date edited, date created, or title
- **Group by Date** — Today / Yesterday / This Week / This Month / Older
- **Image Attachments** — Attach photos from gallery
- **Share** — Share note text via any app, or copy to clipboard
- **Swipe Actions** — Swipe left on notes to quickly Pin or Delete
- **Recently Deleted** — Soft delete with recovery
- **Settings** — Font selection, sort preferences, show/hide preview, password management
- **Dark Mode** — Full automatic dark mode support
- **Offline** — 100% offline, no account needed
- **Auto-save** — Notes auto-save as you type

---

## 🚀 Build the APK (3 methods)

### Method 1: EAS Build (Easiest — Builds in the Cloud, Free)

```bash
# 1. Install Node.js (https://nodejs.org)

# 2. Install Expo CLI and EAS CLI globally
npm install -g expo-cli eas-cli

# 3. Navigate into project
cd android-project

# 4. Install dependencies
npm install

# 5. Login to Expo (free account at expo.dev)
eas login

# 6. Build APK (takes ~5 minutes, no Android Studio needed)
eas build --platform android --profile preview

# The APK download link will appear when done!
```

### Method 2: Local Build with Android Studio

```bash
# Prerequisites: Android Studio + Android SDK installed
# Set ANDROID_HOME environment variable

# 1. Install dependencies
cd android-project
npm install

# 2. Generate native Android project
npx expo prebuild --platform android

# 3. Build debug APK
cd android
./gradlew assembleDebug

# APK location: android/app/build/outputs/apk/debug/app-debug.apk

# 4. Or build release APK
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Method 3: Expo Go (Instant Preview, No Build Needed)

```bash
# 1. Install "Expo Go" app on your Android phone from Play Store

# 2. Install dependencies and start
cd android-project
npm install
npx expo start

# 3. Scan the QR code with Expo Go app
# The app runs instantly on your phone!
```

---

## 📱 Install the APK on Your Phone

After building with Method 1 or 2:

1. **Download** the APK to your phone
2. Go to **Settings → Security** on your Android phone
3. Enable **"Install from Unknown Sources"** (or "Install unknown apps")
4. Open the APK file and tap **Install**
5. Launch **Notes** from your app drawer

---

## 🌐 Use Right Now (Web Version)

Open `index.html` (in the parent folder) in any browser — it works fully as a PWA!

On Android Chrome:
1. Open `index.html` in Chrome
2. Tap the **⋮ menu → Add to Home Screen**
3. It installs as a native-feeling app!

---

## 📁 Project Structure

```
android-project/
├── App.js              # React Native entry point
├── app.json            # Expo configuration
├── eas.json            # EAS Build configuration
├── package.json        # Dependencies
├── babel.config.js     # Babel config
└── src/
    └── app.html        # Complete app (HTML/CSS/JS)

index.html              # Standalone web version (works immediately!)
```

---

## 🛠️ Tech Stack

- **React Native** + **Expo** for Android packaging
- **WebView** rendering the full-featured HTML5 app
- **AsyncStorage** for native persistent storage
- **expo-haptics** for native haptic feedback
- **expo-image-picker** for photo attachment
- **expo-local-authentication** for biometric unlock
- Pure **HTML5 + CSS + Vanilla JS** for the app UI

---

## 💡 Tips

- Use `#tagname` in any note to auto-create tags
- Long-press (future) or use the `···` button for note options
- Swipe left on notes for quick actions
- Set a PIN in Settings to enable note locking

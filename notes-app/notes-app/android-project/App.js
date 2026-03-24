import React, { useRef, useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
  BackHandler,
  AppState,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';

SplashScreen.preventAutoHideAsync();

// The entire app HTML is embedded here for offline use
const APP_HTML = require('./src/app.html');

export default function App() {
  const webViewRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          (function() {
            const activeViews = document.querySelectorAll('.view.active');
            if (activeViews.length > 0) {
              const viewId = activeViews[activeViews.length-1].id;
              if (viewId === 'editor-view') { saveAndGoBack(); return true; }
              if (viewId === 'notes-view') { goBack('notes-view'); return true; }
              if (viewId === 'settings-view') { goBack('settings-view'); return true; }
            }
            return false;
          })();
        `);
        return true;
      }
      return false;
    });

    // Handle app state changes (save on background)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript('clearTimeout(saveTimer); saveCurrentNote(); true;');
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      backHandler.remove();
      subscription?.remove();
    };
  }, []);

  const onMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'HAPTIC':
          if (data.style === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          else if (data.style === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          else if (data.style === 'heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
          
        case 'STORAGE_SET':
          await AsyncStorage.setItem(data.key, data.value);
          webViewRef.current?.injectJavaScript(`
            window.__storageCallbacks && window.__storageCallbacks['${data.callbackId}'] && 
            window.__storageCallbacks['${data.callbackId}'](true);
          `);
          break;
          
        case 'STORAGE_GET':
          const val = await AsyncStorage.getItem(data.key);
          webViewRef.current?.injectJavaScript(`
            window.__storageCallbacks && window.__storageCallbacks['${data.callbackId}'] && 
            window.__storageCallbacks['${data.callbackId}'](${JSON.stringify(val)});
          `);
          break;
          
        case 'STORAGE_REMOVE':
          await AsyncStorage.removeItem(data.key);
          break;
          
        case 'PICK_IMAGE':
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
          });
          if (!result.canceled && result.assets[0]) {
            const base64 = result.assets[0].base64;
            const mime = result.assets[0].mimeType || 'image/jpeg';
            webViewRef.current?.injectJavaScript(`
              window.__imagePickerCallback && window.__imagePickerCallback('data:${mime};base64,${base64}');
            `);
          }
          break;
          
        case 'SHARE':
          if (await Sharing.isAvailableAsync()) {
            const filePath = FileSystem.documentDirectory + 'note.txt';
            await FileSystem.writeAsStringAsync(filePath, data.text);
            await Sharing.shareAsync(filePath, { mimeType: 'text/plain', dialogTitle: data.title });
          } else {
            await Clipboard.setStringAsync(data.text);
            webViewRef.current?.injectJavaScript(`showToast('Copied to clipboard');`);
          }
          break;
          
        case 'CLIPBOARD_COPY':
          await Clipboard.setStringAsync(data.text);
          break;
      }
    } catch (e) {
      console.log('Message error:', e);
    }
  };

  const handleLoad = async () => {
    // Load saved data and inject into webview
    try {
      const savedData = await AsyncStorage.getItem('notes_db');
      if (savedData) {
        const escaped = savedData.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        webViewRef.current?.injectJavaScript(`
          try {
            const data = JSON.parse(\`${escaped}\`);
            db = {...db, ...data};
            const defaults = ['All iCloud', 'Notes', 'Flagged', 'Recently Deleted'];
            defaults.forEach(f => { if (!db.folders.includes(f)) db.folders.push(f); });
            renderFolders();
            document.getElementById('group-toggle').classList.toggle('on', db.settings.groupByDate);
            document.getElementById('preview-toggle').classList.toggle('on', db.settings.showPreview);
          } catch(e) {}
          true;
        `);
      }
    } catch (e) {}
    
    await SplashScreen.hideAsync();
    setIsLoaded(true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={require('./src/app.html')}
          style={styles.webview}
          onLoad={handleLoad}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardDisplayRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
          originWhitelist={['*']}
          androidLayerType="hardware"
          setSupportMultipleWindows={false}
          overScrollMode="never"
          nestedScrollEnabled={true}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

# Peoples Portfolio - React Native Mobile App

## Overview

React Native mobile application for the Peoples Portfolio, providing gesture recognition, sound preferences, and real-time collaboration features on iOS and Android platforms.

## Features

- **Gesture Recognition** - Hand tracking with offline caching
- **Sound Preferences** - Mobile-optimized audio controls
- **Real-Time Collaboration** - Live visitor activity updates
- **Offline Support** - Gesture data syncing when connection restored
- **Analytics Tracking** - Mobile-specific engagement metrics
- **Responsive UI** - Optimized for all screen sizes

## Setup

### Prerequisites

- Node.js 22.13.0+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Create React Native project
npx react-native init PeoplesPortfolioMobile

# Install dependencies
cd PeoplesPortfolioMobile
npm install

# Install additional packages
npm install socket.io-client react-native-gesture-handler react-native-reanimated
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

### Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── GestureScreen.tsx
│   │   ├── SoundScreen.tsx
│   │   ├── CollaborationScreen.tsx
│   │   └── AnalyticsScreen.tsx
│   ├── components/
│   │   ├── GestureDetector.tsx
│   │   ├── SoundControls.tsx
│   │   └── ActivityFeed.tsx
│   ├── hooks/
│   │   ├── useGestureRecognition.ts
│   │   ├── useRealtimeSync.ts
│   │   └── useOfflineStorage.ts
│   ├── services/
│   │   ├── socketService.ts
│   │   ├── storageService.ts
│   │   └── gestureService.ts
│   ├── App.tsx
│   └── index.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Key Components

### GestureDetector Component

Handles hand gesture recognition with offline support:

```typescript
<GestureDetector
  onGestureDetected={(gesture) => handleGesture(gesture)}
  enableOfflineMode={true}
/>
```

### SoundControls Component

Mobile-optimized audio preferences:

```typescript
<SoundControls
  masterVolume={volume}
  onVolumeChange={(vol) => setVolume(vol)}
  soundEffects={effects}
/>
```

### ActivityFeed Component

Real-time collaboration activity display:

```typescript
<ActivityFeed
  events={recentEvents}
  activeVisitors={visitorCount}
/>
```

## Hooks

### useGestureRecognition

```typescript
const { isDetecting, lastGesture, gestures } = useGestureRecognition({
  enableOffline: true,
  syncInterval: 30000,
});
```

### useRealtimeSync

```typescript
const { isConnected, syncData, pendingSync } = useRealtimeSync({
  serverURL: 'https://api.peoples-portfolio.com',
});
```

### useOfflineStorage

```typescript
const { saveGesture, getGestures, clearStorage } = useOfflineStorage();
```

## Building

### iOS

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### Android

```bash
npx react-native run-android
```

## Deployment

### iOS App Store

1. Create App Store Connect account
2. Create app record
3. Build archive: `xcodebuild -scheme PeoplesPortfolioMobile -configuration Release -archivePath build/PeoplesPortfolioMobile.xcarchive archive`
4. Upload to App Store Connect

### Google Play Store

1. Create Google Play Developer account
2. Generate signed APK: `cd android && ./gradlew assembleRelease`
3. Upload APK to Google Play Console

## Testing

```bash
# Run tests
npm test

# Run on device
npx react-native run-ios --device
npx react-native run-android --device
```

## Performance Optimization

- **Gesture Recognition**: Runs at 30fps on mobile
- **Offline Caching**: Stores up to 500 gestures locally
- **Data Sync**: Batches updates every 30 seconds
- **Memory Management**: Automatic cleanup of old data

## Troubleshooting

### Camera Permissions

Ensure camera permissions are requested:

```typescript
import { Camera } from 'react-native-camera-kit';

Camera.requestCameraPermission().then((result) => {
  if (result === 'granted') {
    // Start gesture recognition
  }
});
```

### Connection Issues

Implement automatic reconnection:

```typescript
const reconnectSocket = () => {
  socket.connect();
  socket.on('reconnect', () => {
    syncPendingData();
  });
};
```

## Contributing

1. Create feature branch
2. Implement feature with tests
3. Submit pull request

## License

Proprietary - Jonathan Peoples

## Support

For mobile app issues, contact: mobile@peoples-portfolio.dev

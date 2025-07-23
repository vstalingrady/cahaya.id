
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cahaya.app',
  appName: 'Cahaya',
  webDir: 'out',
  bundledWebRuntime: false,
  // server: {
  //   // Connect to your development server for hot reload
  //   url: 'http://192.168.1.10:3000',
  //   cleartext: true,
  //   allowNavigation: ['192.168.1.10:3000', 'localhost:3000', '*']
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e293b',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e293b'
    },
    App: {
      handleOpenUrl: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '859834790066-web-client-id.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;


import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cahaya.app',
  appName: 'Cahaya',
  webDir: 'out',
  bundledWebRuntime: false,
  // No server config - this will be a true standalone app
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e293b',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e293b'
    }
  }
};

export default config;

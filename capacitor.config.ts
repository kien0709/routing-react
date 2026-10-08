import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'routing_react',
  webDir: 'dist',
  plugins: {
    // https://capacitorjs.com/docs/apis/splash-screen#configuration
    SplashScreen: {
      // de app verbergt het splash scherm zelf zie hideSplashScreen in src native ts
      launchAutoHide: false,
      backgroundColor: '#6c63f6',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    // https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication#configuration
    FirebaseAuthentication: {
      // web SDK blijft de bron van waarheid, native login geeft alleen de credential terug
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;

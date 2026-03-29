// app.config.js — overrides app.json, picks up .env for EAS Update builds
const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = {
  expo: {
    name: IS_DEV ? 'Wait (dev)' : 'Wait',
    slug: 'waitai-app',
    owner: 'akaireds-organization',
    version: '1.0.0',
    scheme: 'waitapp',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'dev.davidemaiorana.wait',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0A0A0A',
      },
      package: 'dev.davidemaiorana.wait',
    },
    updates: {
      url: 'https://u.expo.dev/944af668-11f8-48b8-88d7-7c51ce0341b5',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    plugins: ['expo-router', 'expo-secure-store'],
    experiments: { typedRoutes: true },
    extra: {
      // Variabili disponibili nel bundle (EXPO_PUBLIC_ prefix)
      supabaseUrl:  process.env.EXPO_PUBLIC_SUPABASE_URL  ?? '',
      supabaseKey:  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
      apiBase:      process.env.EXPO_PUBLIC_API_BASE ?? 'https://lab.davidemaiorana.dev',
      eas: {
        projectId: '944af668-11f8-48b8-88d7-7c51ce0341b5',
      },
    },
  },
};

import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.B00728955.app',
  appName: 'websiteApplication',
  webDir: 'dist/website-application/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;

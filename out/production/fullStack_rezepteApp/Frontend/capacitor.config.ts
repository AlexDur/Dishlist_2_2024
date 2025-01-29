import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.dishlist.app',
  appName: 'DishList',
  webDir: 'dist',
  server: {
    url: 'https://www.dish-list.de',
    androidScheme: 'https'
  },
  android: {
    flavor: 'dev'
  }
};

export default config;

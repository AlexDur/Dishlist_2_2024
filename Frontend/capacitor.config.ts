import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rezepte_app',
  appName: 'DishList',
  webDir: 'dist',
  server: {
    url: 'https://www.dish-list.de',
    cleartext: true
  }
};

export default config;

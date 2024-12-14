import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.dishlist.app',
  appName: 'DishList',
  webDir: 'dist/fullStack_rezepteApp',
  bundledWebRuntime: false,
  server: {
    url: 'https://www.dish-list.de',
    cleartext: true
  }
};

export default config;

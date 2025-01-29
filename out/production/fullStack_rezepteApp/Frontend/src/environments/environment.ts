import {config} from "./config";

export const environment = {
  production: false,
  apiUrl: config.apiUrl,
  spoonacularApiKey: 'd63b99bd1aaa4d149becceeaf5659548',
  enableDebug: true,
  featureToggle: {
    enableNewFeature: true,
    enableExperimentalFeatures: true
  },
  analytics: {
    googleTrackingId: 'UA-123456789-0'
  },
  security: {
    enableStrictSecurityMode: false
  }
};

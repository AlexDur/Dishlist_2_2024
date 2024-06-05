import {config} from "./config";

export const environment = {
  production: false,
  apiUrl: config.apiUrl,
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

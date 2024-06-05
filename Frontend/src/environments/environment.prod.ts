import {config} from "./config.prod";

export const environment = {
  production: true,
  apiUrl: config.apiUrl,
  enableDebug: false,
  featureToggle: {
    enableNewFeature: true,
    enableExperimentalFeatures: false
  },
  analytics: {
    googleTrackingId: 'UA-123456789-1'
  },
  security: {
    enableStrictSecurityMode: true
  }
};

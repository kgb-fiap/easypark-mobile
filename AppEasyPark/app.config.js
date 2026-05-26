import 'dotenv/config';
import { execSync } from 'child_process';

// Busca o Hash do Git dinamicamente no seu computador
let commitHash = 'dev-build';
try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
    console.log("Aviso: Não foi possível ler o Git Hash. O projeto está com o Git iniciado?");
}

export default {
  "expo": {
    "name": "AppEasyPark",
    "slug": "AppEasyPark",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/miniLogoWhite.png",
      "resizeMode": "contain",
      "backgroundColor": "#03BB85"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.appeasypark",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Precisamos da sua localização para mostrar os estacionamentos próximos a você."
      },
      "config": {
        "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.appeasypark",
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY 
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font",
      "expo-location"
    ],
    "extra": {
      "commitHash": commitHash
    }
  }
};
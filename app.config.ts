import { ConfigContext, ExpoConfig } from 'expo/config';
import { version } from './package.json';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ENV?: 'development' | 'preview' | 'production';
            EXPO_PUBLIC_API_URL?: string;
        }
    }
}

const EAS_PROJECT_ID = '3c03cfae-43a1-4670-a3d7-b2123ac108db';
const PROJECT_SLUG = 'expense-pro';
const OWNER = 'webstaurantstore';

// App production config
const APP_NAME = 'Expense-Pro';
const BUNDLE_IDENTIFIER = 'com.webstaurantstore.expense-pro';
const PACKAGE_NAME = 'com.webstaurantstore.expensepro';
const ICON = './assets/app-icon.png';
const ADAPTIVE_ICON = './assets/adaptive-icon.png';
const SCHEME = 'expensepro';

export default ({ config }: ConfigContext): ExpoConfig => {
    console.log('⚙️ Building app for environment:', process.env.APP_ENV);

    const environment =
        (process.env.APP_ENV as 'development' | 'preview' | 'production') || 'development';

    const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
        getDynamicAppConfig(environment);
    return {
        ...config,
        name: name,
        version,
        slug: PROJECT_SLUG,
        orientation: 'portrait',
        userInterfaceStyle: 'automatic',
        icon: icon,
        scheme: scheme,
        plugins: [
            'sentry-expo',
            [
                'expo-tracking-transparency',
                {
                    userTrackingPermission:
                        'We use tracking to personalize your experience and improve our services.',
                },
            ],
        ],
        ios: {
            supportsTablet: false,
            bundleIdentifier: bundleIdentifier,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSCameraUsageDescription:
                    'The app uses your camera to take photos of receipts for expense tracking.',
                NSPhotoLibraryUsageDescription:
                    'The app accesses your photo library so you can upload receipt images for logging expenses.',
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: adaptiveIcon,
                backgroundColor: '#ffffff',
            },
            package: packageName,
        },
        updates: {
            url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        },
        runtimeVersion: {
            policy: 'appVersion',
        },
        extra: {
            eas: {
                projectId: EAS_PROJECT_ID,
            },
            appEnv: environment,
        },
        web: {
            bundler: 'metro',
            favicon: './assets/images/favicon.png',
        },

        experiments: {},
        owner: OWNER,
    };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (environment: 'development' | 'preview' | 'production') => {
    if (environment === 'production') {
        return {
            name: APP_NAME,
            bundleIdentifier: BUNDLE_IDENTIFIER,
            packageName: PACKAGE_NAME,
            icon: ICON,
            adaptiveIcon: ADAPTIVE_ICON,
            scheme: SCHEME,
        };
    }

    if (environment === 'preview') {
        return {
            name: `${APP_NAME} Preview`,
            bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
            packageName: `${PACKAGE_NAME}.preview`,
            icon: './assets/app-icon.png',
            adaptiveIcon: './assets/adaptive-icon.png',
            scheme: `${SCHEME}-prev`,
        };
    }

    return {
        name: `${APP_NAME} Development`,
        bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
        packageName: `${PACKAGE_NAME}.dev`,
        icon: './assets/app-icon.png',
        adaptiveIcon: './assets/adaptive-icon.png',
        scheme: `${SCHEME}-dev`,
    };
};

// global.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        EXPO_PUBLIC_API_URL: string;
        EXPO_PUBLIC_ENV: 'development' | 'production';
        EXPO_PUBLIC_PAYCHANGU_PUBLIC_KEY: string;
        EXPO_PUBLIC_PAYCHANGU_BASE_URL: string;
    }
}
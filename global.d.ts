// global.d.ts

// Only EXPO_PUBLIC_* variables reach the app bundle, and only these two are
// actually read. The PayChangu keys live in the backend's own environment --
// the client calls POST /api/payment/process and never sees a gateway secret.
declare namespace NodeJS {
    interface ProcessEnv {
        EXPO_PUBLIC_API_URL?: string;
        EXPO_PUBLIC_ENV?: 'development' | 'production';
    }
}

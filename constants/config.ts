/**
 * Single source of truth for the API base URL.
 *
 * Everything that talks to the backend imports API_URL from here rather than
 * reading process.env itself. Two reasons:
 *
 *   1. Every screen used to carry its own `|| 'http://192.168.x.x:5000'`
 *      fallback, and there were three different LAN addresses in rotation. In a
 *      shipped build a missing variable therefore silently pointed the app at
 *      a private IP that can never resolve.
 *   2. Expo inlines EXPO_PUBLIC_* at bundle time, so the value is frozen into
 *      the APK. Changing targets means rebuilding, not toggling anything at
 *      runtime -- one place to look is the point.
 *
 * Where the value comes from:
 *   local dev  -> .env at the repo root (your LAN address)
 *   EAS build  -> the "env" block on the profile in eas.json
 */

/** Base URL with no trailing slash, e.g. https://ground-token-node.onrender.com */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

if (!API_URL) {
    // Warned, not thrown: a throw here would white-screen the app on launch,
    // and a blank screen tells you far less than this does.
    console.warn(
        '[config] EXPO_PUBLIC_API_URL is not set, so every API call will fail.\n' +
            '  local dev : put your LAN address in .env at the repo root\n' +
            '  EAS build : add an "env" block to the profile in eas.json'
    );
}

/** Build a full URL for an API path. */
export function apiUrl(path: string): string {
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** True when the app has a usable API target configured. */
export const isApiConfigured = API_URL.length > 0;

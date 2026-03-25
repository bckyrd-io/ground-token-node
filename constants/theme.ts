/**
 * App theme colors and fonts.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2E7D32'; // Forest Green primary
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Application color palette
 */
export const COLORS = {
  primary: '#2E7D32',
  white: '#ffffff',
  black: '#000000',
  error: '#d32f2f',
  
  // Slate colors (neutral grays)
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  
  // Semantic colors
  bgLight: '#f8f6f6',
  neutralGray: '#757575',
  
  // Status colors
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber100: '#fef3c7',
  amber50: '#fffbeb',
  green500: '#22c55e',
  amber400: '#fbbf24',
  red600: '#dc2626',
  red500: '#ef4444',
  orange600: '#ea580c',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

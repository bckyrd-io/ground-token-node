/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
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

//'#00c951',primary color old
export const COLORS = {
  primary: '#00c951',
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
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green700: '#15803d',
  amber400: '#fbbf24',
  red600: '#dc2626',
  red500: '#ef4444',
  orange600: '#ea580c',
  orange100: '#ffedd5',
  orange700: '#c2410c',
};


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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

export const FORM_INPUT_TOKENS = {
  height: 56,
  borderWidth: 1,
  borderRadius: 12,
  borderColor: COLORS.slate300,
  backgroundColor: COLORS.slate50,
  textColor: COLORS.slate900,
  placeholderColor: COLORS.slate400,
  fontSize: 16,
  horizontalPadding: 16,
  iconLeftPadding: 44,
} as const;

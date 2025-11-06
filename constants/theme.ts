/**
 * Theme colors inspired by Nintendo - Rosso, Bianco e Nero
 */

import { Platform } from 'react-native';

// Palette Nintendo ufficiale
const nintendoRed = '#E60012'; // Rosso ufficiale del logo Nintendo
const white = '#FFFFFF';
const black = '#000000';

export const Colors = {
  light: {
    text: black,
    background: white,
    surface: white,
    tint: nintendoRed,
    secondary: nintendoRed,
    accent: nintendoRed,
    icon: black,
    tabIconDefault: '#666666',
    tabIconSelected: nintendoRed,
    gradient: {
      start: nintendoRed,
      end: '#B8000E', // Rosso più scuro per gradiente
    },
    card: white,
    border: '#E0E0E0',
  },
  dark: {
    text: white,
    background: black,
    surface: '#1A1A1A', // Grigio molto scuro per superficie
    tint: nintendoRed,
    secondary: nintendoRed,
    accent: nintendoRed,
    icon: white,
    tabIconDefault: '#999999',
    tabIconSelected: nintendoRed,
    gradient: {
      start: black,
      end: '#1A1A1A', // Grigio scuro per gradiente
    },
    card: '#1A1A1A',
    border: '#333333',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Inter',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Font globale da usare nell'app
export const GlobalFont = Platform.select({
  ios: 'System', // Usa il font di sistema iOS (San Francisco)
  android: 'Roboto', // Roboto è il font di default su Android
  default: 'System',
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

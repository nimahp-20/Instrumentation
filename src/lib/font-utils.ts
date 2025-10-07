/**
 * Persian Font Utilities
 * Easy-to-use font classes and utilities for IRANSansX
 */

// Font weight classes
export const fontWeights = {
  thin: 'font-thin',           // 100
  ultraLight: 'font-ultra-light', // 200
  light: 'font-light',         // 300
  regular: 'font-regular',     // 400
  medium: 'font-medium',       // 500
  demiBold: 'font-demi-bold', // 600
  bold: 'font-bold',          // 700
  extraBold: 'font-extra-bold', // 800
  black: 'font-black',        // 900
  extraBlack: 'font-extra-black', // 950
  heavy: 'font-heavy',        // 1000
} as const;

// Font size classes
export const fontSizes = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl',  // 36px
  '5xl': 'text-5xl',  // 48px
  '6xl': 'text-6xl',  // 60px
} as const;

// Line height classes
export const lineHeights = {
  tight: 'leading-tight',     // 1.25
  snug: 'leading-snug',      // 1.375
  normal: 'leading-normal',  // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose',    // 2
} as const;

// Combined font classes for common use cases
export const fontClasses = {
  // Headings
  h1: 'font-iran-sans font-bold text-4xl leading-tight',
  h2: 'font-iran-sans font-bold text-3xl leading-tight',
  h3: 'font-iran-sans font-bold text-2xl leading-snug',
  h4: 'font-iran-sans font-bold text-xl leading-snug',
  h5: 'font-iran-sans font-bold text-lg leading-normal',
  h6: 'font-iran-sans font-bold text-base leading-normal',
  
  // Body text
  body: 'font-iran-sans font-regular text-base leading-relaxed',
  bodyLarge: 'font-iran-sans font-regular text-lg leading-relaxed',
  bodySmall: 'font-iran-sans font-regular text-sm leading-normal',
  
  // UI elements
  button: 'font-iran-sans font-medium text-base',
  buttonLarge: 'font-iran-sans font-medium text-lg',
  buttonSmall: 'font-iran-sans font-medium text-sm',
  
  // Labels and captions
  label: 'font-iran-sans font-medium text-sm',
  caption: 'font-iran-sans font-regular text-xs',
  
  // Persian-specific
  persianText: 'font-iran-sans font-regular text-base leading-relaxed text-right',
  persianHeading: 'font-iran-sans font-bold text-2xl leading-tight text-right',
} as const;

// Utility function to combine font classes
export const combineFontClasses = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common font combinations
export const commonFonts = {
  // Persian headings with different weights
  persianH1: combineFontClasses('font-iran-sans', 'font-bold', 'text-4xl', 'leading-tight'),
  persianH2: combineFontClasses('font-iran-sans', 'font-bold', 'text-3xl', 'leading-tight'),
  persianH3: combineFontClasses('font-iran-sans', 'font-bold', 'text-2xl', 'leading-snug'),
  
  // Persian body text
  persianBody: combineFontClasses('font-iran-sans', 'font-regular', 'text-base', 'leading-relaxed'),
  persianBodyLarge: combineFontClasses('font-iran-sans', 'font-regular', 'text-lg', 'leading-relaxed'),
  
  // Persian UI elements
  persianButton: combineFontClasses('font-iran-sans', 'font-medium', 'text-base'),
  persianButtonLarge: combineFontClasses('font-iran-sans', 'font-medium', 'text-lg'),
  
  // Persian labels
  persianLabel: combineFontClasses('font-iran-sans', 'font-medium', 'text-sm'),
  persianCaption: combineFontClasses('font-iran-sans', 'font-regular', 'text-xs'),
} as const;

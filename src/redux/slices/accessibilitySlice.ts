import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AccessibilityState {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  screenReaderEnabled: boolean;
  autoReadEnabled: boolean;
  handsFreeEnabled: boolean;
}

const initialState: AccessibilityState = {
  highContrast: false,
  fontSize: 'normal',
  colorBlindMode: 'none',
  reducedMotion: false,
  dyslexiaFont: false,
  screenReaderEnabled: false,
  autoReadEnabled: false,
  handsFreeEnabled: false,
};

const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },
    setFontSize: (state, action: PayloadAction<'normal' | 'large' | 'xlarge'>) => {
      state.fontSize = action.payload;
    },
    setColorBlindMode: (state, action: PayloadAction<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>) => {
      state.colorBlindMode = action.payload;
    },
    toggleReducedMotion: (state) => {
      state.reducedMotion = !state.reducedMotion;
    },
    toggleDyslexiaFont: (state) => {
      state.dyslexiaFont = !state.dyslexiaFont;
    },
    toggleScreenReader: (state) => {
      state.screenReaderEnabled = !state.screenReaderEnabled;
    },
    toggleAutoRead: (state) => {
      state.autoReadEnabled = !state.autoReadEnabled;
    },
    toggleHandsFree: (state) => {
      state.handsFreeEnabled = !state.handsFreeEnabled;
    },
    setHandsFree: (state, action: PayloadAction<boolean>) => {
      state.handsFreeEnabled = action.payload;
    },
  },
});

export const {
  toggleHighContrast,
  setFontSize,
  setColorBlindMode,
  toggleReducedMotion,
  toggleDyslexiaFont,
  toggleScreenReader,
  toggleAutoRead,
  toggleHandsFree,
  setHandsFree,
} = accessibilitySlice.actions;

export default accessibilitySlice.reducer;

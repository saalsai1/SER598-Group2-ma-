import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const COLOR_MODES = ["none", "protanopia", "deuteranopia", "tritanopia"] as const;
const FONT_SIZES = ["normal", "large", "xlarge"] as const;

export default function AccessibilityEffects() {
  const {
    highContrast,
    fontSize,
    colorBlindMode,
    reducedMotion,
    dyslexiaFont,
  } = useSelector((state: RootState) => state.accessibility);

  useEffect(() => {
    const root = document.documentElement;

    // Color-blind mode
    COLOR_MODES.forEach((mode) => root.classList.remove(`cb-${mode}`));
    root.classList.add(`cb-${colorBlindMode}`);

    // Font size
    FONT_SIZES.forEach((size) => root.classList.remove(`fs-${size}`));
    root.classList.add(`fs-${fontSize}`);

// Toggles - using explicit if/else for debugging
    if (highContrast) {
      root.classList.add("a11y-high-contrast");
    } else {
      root.classList.remove("a11y-high-contrast");
    }

    if (reducedMotion) {
      root.classList.add("a11y-reduced-motion");
      console.log(" Reduced motion enabled - class added to HTML");
    } else {
      root.classList.remove("a11y-reduced-motion");
      console.log(" Reduced motion disabled - class removed from HTML");
    }

    if (dyslexiaFont) {
      root.classList.add("a11y-dyslexia-font");
    } else {
      root.classList.remove("a11y-dyslexia-font");
    }

    // Log current classes for debugging
    console.log("Current HTML classes:", root.className);
  }, [highContrast, fontSize, colorBlindMode, reducedMotion, dyslexiaFont]);

  return null; // no UI, just side effects
}

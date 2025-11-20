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

    // Toggles
    root.classList.toggle("a11y-high-contrast", highContrast);
    root.classList.toggle("a11y-reduced-motion", reducedMotion);
    root.classList.toggle("a11y-dyslexia-font", dyslexiaFont);
  }, [highContrast, fontSize, colorBlindMode, reducedMotion, dyslexiaFont]);

  return null; // no UI, just side effects
}

import { useState, useEffect } from "react";

const MODES = ["normal", "protanopia", "deuteranopia", "tritanopia"];

export default function AccessibilityOptions() {
  const [colorMode, setColorMode] = useState("normal");

  // Update <html> class whenever the mode changes
  useEffect(() => {
    const root = document.documentElement; // <html>

    // Remove old classes
    MODES.forEach((mode) => {
      root.classList.remove(`cb-${mode}`);
    });

    // Add the new class
    root.classList.add(`cb-${colorMode}`);
  }, [colorMode]);

  return (
    <aside
      className="accessibility-panel"
      role="dialog"
      aria-label="Accessibility options"
    >
      <h2 className="accessibility-title">Accessibility Options</h2>

      <div className="field">
        <label htmlFor="colorMode">Color Blind Mode</label>
        <select
          id="colorMode"
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>
      </div>
    </aside>
  );
}

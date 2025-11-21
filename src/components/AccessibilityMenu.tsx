import React from 'react'
import { RootState } from '@/redux/store'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Ghost, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setColorBlindMode, setFontSize, toggleDyslexiaFont, toggleHighContrast, toggleReducedMotion } from '@/redux/slices/accessibilitySlice'


interface AccessibilityProps {
  onClose: () => void;
}
const Accessibility = ({onClose} : AccessibilityProps) => {

    const dispatch = useDispatch()
    const accessibility = useSelector((state: RootState) => state.accessibility)

    return (
    <div className="absolute top-16 right-4 z-50 animate-scale-in" role="dialog" aria-label="Accessibility options">
      <Card className="w-80 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold" id="accessibility-title">Accessibility Options</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close accessibility menu">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-sm font-medium">
              High Contrast
            </label>
            <Button
              id="high-contrast"
              variant={accessibility.highContrast ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(toggleHighContrast())}
              aria-pressed={accessibility.highContrast}
            >
              {accessibility.highContrast ? 'On' : 'Off'}
            </Button>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label htmlFor="font-size" className="text-sm font-medium block">
              Font Size
            </label>
            <div className="flex gap-2" role="group" aria-labelledby="font-size">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <Button
                  key={size}
                  variant={accessibility.fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => dispatch(setFontSize(size))}
                  className="flex-1"
                  aria-pressed={accessibility.fontSize === size}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Blind Mode */}
          <div className="space-y-2">
            <label htmlFor="colorblind-mode" className="text-sm font-medium block">
              Color Blind Mode
            </label>
            <select
              id="colorblind-mode"
              value={accessibility.colorBlindMode}
              onChange={(e) => dispatch(setColorBlindMode(e.target.value as any))}
              className="w-full p-2 rounded-md border border-input bg-background text-foreground"
              aria-label="Select color blindness type"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <label htmlFor="reduced-motion" className="text-sm font-medium">
              Reduced Motion
            </label>
            <Button
              id="reduced-motion"
              variant={accessibility.reducedMotion ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(toggleReducedMotion())}
              aria-pressed={accessibility.reducedMotion}
            >
              {accessibility.reducedMotion ? 'On' : 'Off'}
            </Button>
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <label htmlFor="dyslexia-font" className="text-sm font-medium">
              Dyslexia-Friendly Font
            </label>
            <Button
              id="dyslexia-font"
              variant={accessibility.dyslexiaFont ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(toggleDyslexiaFont())}
              aria-pressed={accessibility.dyslexiaFont}
            >
              {accessibility.dyslexiaFont ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Accessibility



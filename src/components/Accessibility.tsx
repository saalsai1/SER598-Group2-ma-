import React from 'react'
import { RootState } from '@/redux/store'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Ghost, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setColorBlindMode, setFontSize, toggleReducedMotion } from '@/redux/slices/accessibilitySlice'

const Accessibility = () => {

    const dispatch = useDispatch()
    const accessibility = useSelector((state: RootState) => state.accessibility)

    return (
        <div>
            <Card>


                <div>
                    <h2>Accessibility Options</h2>
                    <Button
                        variant='ghost'
                        onClick={close}
                        aria-label='Close Accessibility MEnu'
                    >
                        <X />
                    </Button>
                </div>

                <div>
                    {/* high contrast optionaluity */}
                    <div>
                        <label>
                            High Contrast
                        </label>
                        <Button
                            id='high-contrast'
                            variant={accessibility.highContrast ? 'default' : 'outline'}
                            aria-pressed={accessibility.highContrast}
                        >
                            {accessibility.highContrast ? 'On' : 'Off'}
                        </Button>
                    </div>

                    {/* FONT SIZE */}
                    <div>
                        <label >
                            Font Size
                        </label>
                        <div>
                            {(['normal', 'large', 'xlarge'] as const).map((size) => (

                                <Button
                                    key={size}
                                    onClick={() => dispatch(setFontSize(size))}
                                    variant={accessibility.fontSize === size ? 'default' : 'outline'}
                                    aria-pressed={accessibility.fontSize === size}
                                >

                                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* COLOR BLIND ODE */}
                    <div>
                        <label >
                            Color Blind Mode
                        </label>
                        <select
                            id="colorBlind-mode"
                            value={accessibility.colorBlindMode}
                            onChange={(e) => dispatch(setColorBlindMode(e.target.value as any))}>
                            <option value="none">NONE</option>
                            <option value="protanopia">Protanopia</option>
                            <option value="deuteranopia">Deuteranopia</option>
                            <option value="tritanopia">Tritanopia</option>
                        </select>
                    </div>


                    {/* REDUCED MOTION, less refresh rate  */}
                    <div>
                        <label htmlFor="">
                            Reduced Motion
                        </label>
                        <Button
                            id='reduced-motion'
                            variant={accessibility.reducedMotion ? 'default' : 'outline'}
                            onClick={() => dispatch(toggleReducedMotion())}
                            aria-pressed={accessibility.reducedMotion}
                        >
                            {accessibility.reducedMotion ? 'On' : 'Off'}
                        </Button>
                    </div>


                    {/* Dyslexsia Font */}
                    <div>
                        <label htmlFor="">
                            Dyslexsia-Friendly Font
                        </label>
                        <Button
                            id='dyslexia-font'
                            variant={accessibility.dyslexiaFont ? 'default' : 'outline'}
                            aria-pressed={accessibility.dyslexiaFont}
                        >
                            {accessibility.dyslexiaFont ? 'On' : 'Off'}
                        </Button>
                    </div>

                </div>

            </Card>

        </div>
    )
}

export default Accessibility



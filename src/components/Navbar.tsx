import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {     Leaf } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Accessibility from './Accessibility'

const Navbar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [accessibilityOpen, setAccessibilityOpen] = useState(false)

    
  return (
  <nav>
    <div>
        <div>
            {/* LOGO */}
            
            <Link to={'/'} aria-label='Orange Sulphur Home'>
            <Leaf/>
            <span>
                Orange Sulphur
            </span>
            </Link>

            {/* desktop navigation */}
            <div>
                <Link to={'/'}>HOME</Link>
                <Link to={'/store'}>STORE</Link>
                <Link to={'/recipe'}>RECIPES</Link>
                <Link to={'/about'}>ABOUT</Link>
                <Link to={'/contact'}>CONTACT</Link>
            </div>


            {/* Actions enablement */}
            <div>
                {/* Accessibility */}
                <Button>
                    <Accessibility />

                </Button>
                {/* Cart  */}
                <Button>
                    <ShoppingCart />
                </Button>

                {/* SHOP NOW */}
                <Button>
                    Shop Now
                </Button>


            </div>


            {/* HAMBIRGER : MOBILE versopn MENU */}

        </div>
    </div>

    {accessibilityOpen && <Accessibility onClose={() => setAccessibilityOpen(false)} />}
  </nav>
  )
}

export default Navbar

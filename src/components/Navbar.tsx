import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility, Leaf, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccessibilityMenu from "./AccessibilityMenu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95"
      role="navigation"
      aria-label="Main navigation"
    >
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Orange Sulphur Home"
          >
            <Leaf
              className="h-8 w-8 text-primary group-hover:animate-bounce-gentle"
              aria-hidden="true"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Orange Sulphur
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors duration-200"
              aria-label="Home"
            >
              Home
            </Link>
            <Link
              to="/store"
              className="text-foreground hover:text-primary transition-colors duration-200"
              aria-label="Store"
            >
              Store
            </Link>
            <Link
              to="/recipes"
              className="text-foreground hover:text-primary transition-colors duration-200"
              aria-label="Recipes"
            >
              Recipes
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors duration-200"
              aria-label="About"
            >
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAccessibilityOpen(!accessibilityOpen)}
              aria-label="Toggle accessibility options"
              aria-expanded={accessibilityOpen}
            >
              <Accessibility className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Shopping cart">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="default" size="default">
              Shop Now
            </Button>
            <Button variant="default" size="default" className="cursor-pointer">
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in" role="menu">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                role="menuitem"
              >
                Home
              </Link>
              <Link
                to="/store"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                role="menuitem"
              >
                Store
              </Link>
              <Link
                to="/recipes"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                role="menuitem"
              >
                Recipes
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                role="menuitem"
              >
                About
              </Link>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                  aria-label="Accessibility options"
                >
                  <Accessibility className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Shopping cart">
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button variant="default" className="flex-1">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Menu */}
      {accessibilityOpen && (
        <AccessibilityMenu onClose={() => setAccessibilityOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;

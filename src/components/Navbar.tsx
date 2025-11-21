import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Accessibility, Leaf, Menu, ShoppingCart, X, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccessibilityMenu from "./AccessibilityMenu";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  // const accessibility = useSelector((state:RootState) => state.accessibility)

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // handle the onSelect on accessibilityMenu
  // const hasAccessibilitOverrides = 
  // accessibility.highContrast || 
  // accessibility.reducedMotion || 
  // accessibility.dyslexiaFont || 
  // accessibility.fontSize !== "normal" || 
  // accessibility.colorBlindMode !== "none"

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

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
              // className={`relative tracking-all duration-200 ${ 
              //   hasAccessibilitOverrides ? "text-orange-500 bg-orange-500/10 ring-2-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.9)] hover:bg-orange-500/20"
              //   : ""
              //   }`}
            >
              <Accessibility className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Link to="/checkout">
              <Button variant="ghost" size="icon" aria-label="Shopping cart" className="relative">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="relative flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                  className={`transition-all duration-200 ${
                              userMenuOpen
                                ? 'bg-primary/10 text-primary ring-2 ring-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                                : 'text-primary'
                        }`}
                >
                  {/* {user?.name} */}
                  <User className="h-5 w-5" aria-hidden="true" />
                </Button>
                
                {/* name under icon */}
                {/* {user?.name && ( 
                  <span
                  className="mt-[-5] text-[0.7rem] text-muted-foreground max-w-[80px] truncate text-center"
                  >
                    {user.name}
                  </span>
                )} */}
                
                {userMenuOpen && (
                  <div className="absolute right-6 mt-9 w-56 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                     
                    <Link to="/order-history" onClick={() => setUserMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Package className="h-4 w-4 mr-2" />
                        Order History
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="default">
                  Login
                </Button>
              </Link>
            )}
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
                <Link to="/checkout">
                  <Button variant="ghost" size="icon" aria-label="Shopping cart" className="relative">
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/order-history" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Orders
                      </Button>
                    </Link>
                    <Button variant="default" onClick={handleLogout} className="flex-1">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" className="flex-1">
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
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

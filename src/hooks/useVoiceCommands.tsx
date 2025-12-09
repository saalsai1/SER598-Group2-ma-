import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setHandsFree } from '@/redux/slices/accessibilitySlice';
import { products } from '@/data/products';

export interface CommandResult {
  action: string;
  announcement: string;
  executed: boolean;
}

export const useVoiceCommands = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const reducedMotion = useSelector((state: RootState) => state.accessibility.reducedMotion);

  const scrollPage = useCallback((direction: 'up' | 'down' | 'top' | 'bottom') => {
    const behavior = reducedMotion ? 'auto' : 'smooth';
    
    switch (direction) {
      case 'up':
        window.scrollBy({ top: -400, behavior });
        break;
      case 'down':
        window.scrollBy({ top: 400, behavior });
        break;
      case 'top':
        window.scrollTo({ top: 0, behavior });
        break;
      case 'bottom':
        window.scrollTo({ top: document.body.scrollHeight, behavior });
        break;
    }
  }, [reducedMotion]);

  const getCartSummary = useCallback((): string => {
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (itemCount === 0) {
      return 'Your cart is empty.';
    }
    
    const dollars = Math.floor(total);
    const cents = Math.round((total - dollars) * 100);
    return `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart, total ${dollars} dollars and ${cents} cents.`;
  }, [cart.items]);

  const getPageDescription = useCallback((path: string): string => {
    const descriptions: Record<string, string> = {
      '/': 'Home page. Featured organic products and quick links to store and recipes.',
      '/store': 'Store page. Browse organic groceries with search and category filters.',
      '/recipes': 'Recipes page. Search recipes and view step-by-step instructions.',
      '/cart': 'Cart page. Review your items before checkout.',
      '/checkout': 'Checkout page. Review your cart, enter address, and place your order.',
      '/accessibility': 'Accessibility page. Configure visual settings and speech tools.',
      '/order-history': 'Order history page. View your past orders and their status.',
      '/login': 'Login page. Sign in to your account.',
      '/register': 'Registration page. Create a new account.',
      '/about': 'About page. Learn about Orange Sulphur organic grocery.',
    };
    return descriptions[path] || 'Page content.';
  }, []);

  const getProductsDescription = useCallback((): string => {
    const productList = products.slice(0, 5);
    const descriptions = productList.map((p, i) => 
      `${i + 1}. ${p.name}, ${p.price.toFixed(2)} dollars`
    ).join('. ');
    return `Featured products: ${descriptions}. And ${products.length - 5} more products available.`;
  }, []);

  const getHelpText = useCallback((): string => {
    return `Available commands: 
      Navigation: Say go to home, go to store, go to recipes, go to cart, or open accessibility settings.
      Search: Say search for, followed by your query.
      Scrolling: Say scroll up, scroll down, scroll to top, or scroll to bottom.
      Reading: Say read this page, or read products on the store page.
      Cart: Say show my cart to hear your cart summary.
      Exit: Say exit hands-free mode to deactivate voice control.
      For help anytime, say help.`;
  }, []);

  const parseCommand = useCallback((transcript: string): CommandResult => {
    const text = transcript.toLowerCase().trim();
    
    // Navigation commands
    if (text.includes('go to home') || text.includes('go home') || text === 'home') {
      navigate('/');
      return { action: 'navigate', announcement: 'Navigating to home page.', executed: true };
    }
    
    if (text.includes('go to store') || text.includes('open store') || text === 'store') {
      navigate('/store');
      return { action: 'navigate', announcement: 'Navigating to store.', executed: true };
    }
    
    if (text.includes('go to recipes') || text.includes('open recipes') || text === 'recipes') {
      navigate('/recipes');
      return { action: 'navigate', announcement: 'Navigating to recipes.', executed: true };
    }
    
    if (text.includes('go to cart') || text.includes('open cart') || text.includes('checkout') || text === 'cart') {
      navigate('/cart');
      return { action: 'navigate', announcement: 'Navigating to cart.', executed: true };
    }
    
    if (text.includes('order history') || text.includes('orders') || text.includes('my orders')) {
      navigate('/order-history');
      return { action: 'navigate', announcement: 'Navigating to order history.', executed: true };
    }
    
    if (text.includes('accessibility') || text.includes('accessibility settings')) {
      navigate('/accessibility');
      return { action: 'navigate', announcement: 'Opening accessibility settings.', executed: true };
    }
    
    if (text.includes('about') || text.includes('about us')) {
      navigate('/about');
      return { action: 'navigate', announcement: 'Navigating to about page.', executed: true };
    }
    
    if (text.includes('login') || text.includes('sign in')) {
      navigate('/login');
      return { action: 'navigate', announcement: 'Navigating to login.', executed: true };
    }
    
    if (text.includes('register') || text.includes('sign up')) {
      navigate('/register');
      return { action: 'navigate', announcement: 'Navigating to registration.', executed: true };
    }

    // Search command
    const searchMatch = text.match(/search (?:for )?(.+)/);
    if (searchMatch && searchMatch[1]) {
      const query = searchMatch[1].trim();
      navigate(`/store?search=${encodeURIComponent(query)}`);
      return { action: 'search', announcement: `Searching for ${query}.`, executed: true };
    }

    // Scroll commands
    if (text.includes('scroll down')) {
      scrollPage('down');
      return { action: 'scroll', announcement: 'Scrolling down.', executed: true };
    }
    
    if (text.includes('scroll up')) {
      scrollPage('up');
      return { action: 'scroll', announcement: 'Scrolling up.', executed: true };
    }
    
    if (text.includes('scroll to top') || text.includes('go to top')) {
      scrollPage('top');
      return { action: 'scroll', announcement: 'Scrolling to top.', executed: true };
    }
    
    if (text.includes('scroll to bottom') || text.includes('go to bottom')) {
      scrollPage('bottom');
      return { action: 'scroll', announcement: 'Scrolling to bottom.', executed: true };
    }

    // Read commands
    if (text.includes('read this page') || text.includes('read page')) {
      const path = window.location.pathname;
      const description = getPageDescription(path);
      return { action: 'read', announcement: description, executed: true };
    }
    
    if (text.includes('read products') || text.includes('list products')) {
      const description = getProductsDescription();
      return { action: 'read', announcement: description, executed: true };
    }

    // Cart commands
    if (text.includes('show my cart') || text.includes('cart summary') || text.includes('what\'s in my cart')) {
      const summary = getCartSummary();
      navigate('/cart');
      return { action: 'cart', announcement: summary, executed: true };
    }

    // Help command
    if (text === 'help' || text.includes('what can i say') || text.includes('commands')) {
      const helpText = getHelpText();
      return { action: 'help', announcement: helpText, executed: true };
    }

    // Exit command
    if (text.includes('exit hands-free') || text.includes('stop hands-free') || text.includes('disable hands-free') || text.includes('turn off hands-free')) {
      dispatch(setHandsFree(false));
      return { action: 'exit', announcement: 'Hands-free mode deactivated.', executed: true };
    }

    // Command not recognized
    return { 
      action: 'unknown', 
      announcement: `Sorry, I didn't understand "${transcript}". Say help to hear available commands.`, 
      executed: false 
    };
  }, [navigate, dispatch, scrollPage, getCartSummary, getPageDescription, getProductsDescription, getHelpText]);

  return { parseCommand, getHelpText };
};

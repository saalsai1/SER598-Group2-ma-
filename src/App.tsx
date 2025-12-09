import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import Recipe from './pages/Recipe';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';  // ← Add this
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import AccessibilityEffects from "@/components/AccessibilityEffects";
import Accessibility from './pages/Accessibility';
import HandsFreeWrapper from './components/HandsFreeWrapper';

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AccessibilityEffects />
          <Sonner />
           <HandsFreeWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<Store />} />
            <Route path="/recipes" element={<Recipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />  
            <Route path='/accessibility' element={<Accessibility />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </HandsFreeWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
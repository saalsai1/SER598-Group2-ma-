import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { clearCart, removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import { addOrder } from '@/redux/slices/orderHistorySlice';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items, total } = useSelector((state: RootState) => state.cart);
  const accessibility = useSelector((state: RootState) => state.accessibility);

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string | number) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  // Manual save to localStorage as backup
  const manualSaveOrder = (order: any) => {
    try {
      console.log('💾 Manual save - Starting...');
      const existingOrders = localStorage.getItem('order_history');
      console.log('💾 Existing orders:', existingOrders);
      
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      console.log('💾 Parsed orders:', orders);
      
      orders.unshift(order);
      console.log('💾 Orders after adding new:', orders);
      
      localStorage.setItem('order_history', JSON.stringify(orders));
      console.log('💾 Manual save - SUCCESS');
      
      // Verify
      const verify = localStorage.getItem('order_history');
      console.log('💾 Verification:', verify);
      
      return true;
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      return false;
    }
  };

  const handlePlaceOrder = () => {
    console.log('🛒 ========== PLACE ORDER CLICKED ==========');
    console.log('📦 Cart items:', items);
    console.log('👤 Current user:', user);
    console.log('📍 Shipping address:', shippingAddress);
    console.log('💳 Payment method:', paymentMethod);
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    if (!user) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }

    try {
      // Create order with explicit property mapping
      const order = {
        id: Date.now().toString(),
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || 'Uncategorized',
        })),
        total: total,
        date: new Date().toISOString(),
        status: 'pending' as const,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      };

      console.log('📦 ========== ORDER CREATED ==========');
      console.log('Order ID:', order.id);
      console.log('User ID:', order.userId);
      console.log('Items count:', order.items.length);
      console.log('Total:', order.total);
      console.log('Full order object:', order);

      // Method 1: Manual save to localStorage
      console.log('💾 Method 1: Manual save...');
      const manuallySaved = manualSaveOrder(order);
      console.log('💾 Manual save result:', manuallySaved);

      // Method 2: Redux dispatch
      console.log('🔄 Method 2: Redux dispatch...');
      dispatch(addOrder(order));
      console.log('✅ Redux dispatch completed');

      // Verify after a short delay
      setTimeout(() => {
        const savedOrders = localStorage.getItem('order_history');
        console.log('🔍 ========== VERIFICATION ==========');
        console.log('LocalStorage raw:', savedOrders);
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          console.log('LocalStorage parsed:', parsed);
          console.log('Number of orders:', parsed.length);
        } else {
          console.error('❌ NO ORDERS IN LOCALSTORAGE!');
        }
      }, 200);

      // Clear cart
      dispatch(clearCart());
      console.log('🗑️ Cart cleared');

      // Success message
      toast.success('Order placed successfully!');
      console.log('✅ ========== ORDER PROCESS COMPLETE ==========');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/order-history');
      }, 500);

    } catch (error) {
      console.error('❌ ========== ERROR PLACING ORDER ==========');
      console.error('Error details:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`min-h-screen ${
        accessibility.highContrast ? 'contrast-125' : ''
      } ${accessibility.reducedMotion ? 'motion-reduce:transition-none' : ''}`}
      style={{
        fontSize:
          accessibility.fontSize === 'large'
            ? '1.125rem'
            : accessibility.fontSize === 'xlarge'
            ? '1.25rem'
            : '1rem',
        fontFamily: accessibility.dyslexiaFont
          ? 'OpenDyslexic, Comic Sans MS, sans-serif'
          : 'inherit',
      }}
    >
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/store">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items and complete your purchase
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Link to="/store">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.category}
                        </p>
                        <p className="text-primary font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Shipping Address
                    </label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, State, ZIP"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      aria-label="Shipping address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="payment" className="text-sm font-medium">
                      Payment Method
                    </label>
                    <select
                      id="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                      aria-label="Payment method"
                    >
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Cash on Delivery</option>
                    </select>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useLocation, replace } from 'react-router-dom';
import { RootState } from '@/redux/store';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, DollarSign, ArrowLeft } from 'lucide-react';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.orderHistory);
  const accessibility = useSelector((state: RootState) => state.accessibility);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

  // fix the protected route from login
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login' , { state : { from: location, replace: true}});
    }
  }, [isAuthenticated, navigate, location]);


  const userOrders = user ? orders.filter(order => order.userId === user.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
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
              Back to Store
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">
            View and track all your previous orders
          </p>
        </div>

        {userOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/store">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">Order #{order.id.slice(0, 8)}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Items:</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress && (
                      <div className="pt-3 border-t">
                        <p className="text-sm">
                          <span className="font-semibold">Shipping Address:</span>{' '}
                          {order.shippingAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;

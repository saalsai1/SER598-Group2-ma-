import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Heart, ShoppingBag, Users, Mail, Phone, MapPin } from 'lucide-react';

const About = () => {
  const accessibility = useSelector((state: RootState) => state.accessibility);

  return (
    <div
      className={`min-h-screen ${
        accessibility.highContrast ? 'contrast-125' : ''
      }`}
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
      <main id="main-content">
        {/* Hero Banner Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80"
            alt="Fresh organic produce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
                About Orange Sulphur
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                Your trusted source for fresh, organic produce delivered straight to your door
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Mission Statement */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Leaf className="h-8 w-8 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                At Orange Sulphur, we believe in providing the freshest, highest-quality organic 
                produce to our community. We work directly with local farmers to ensure that every 
                fruit and vegetable meets our standards for freshness, taste, and sustainability. 
                Our mission is to make healthy eating accessible and convenient for everyone.
              </p>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80"
                    alt="Fresh organic produce"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                    Fresh Organic Produce
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    100% organic fruits and vegetables sourced from certified local farms. 
                    No pesticides, no GMOs, just pure, natural goodness.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                    alt="Easy online shopping"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                    Easy Online Shopping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse our selection, add items to your cart, and checkout with ease. 
                    Your fresh produce is just a few clicks away.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
                    alt="Community focused"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-600" />
                    Community Focused
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Supporting local farmers and promoting sustainable agriculture practices 
                    to build a healthier community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why Choose Us */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Why Choose Orange Sulphur?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
                  <p className="text-muted-foreground">
                    Every product is hand-selected and inspected to ensure it meets our 
                    high standards. If you're not satisfied, we'll make it right.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Farm to Table</h3>
                  <p className="text-muted-foreground">
                    We work directly with local farmers, cutting out the middleman to bring 
                    you the freshest produce at competitive prices.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
                  <p className="text-muted-foreground">
                    We're committed to environmentally friendly farming practices that 
                    protect our planet for future generations.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Convenient Delivery</h3>
                  <p className="text-muted-foreground">
                    Fast, reliable delivery right to your doorstep. Fresh produce without 
                    the hassle of shopping.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      123 Farm Road<br />
                      Phoenix, AZ 85001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      (555) 123-4567<br />
                      Mon-Fri: 9AM - 6PM<br />
                      Sat-Sun: 10AM - 4PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      info@orangesulphur.com<br />
                      support@orangesulphur.com<br />
                      orders@orangesulphur.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <p className="text-center text-muted-foreground">
                  <strong>Academic Project Notice:</strong> Orange Sulphur is a class project 
                  developed for SER598. This is a demonstration e-commerce platform showcasing 
                  authentication, order management, and accessibility features.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
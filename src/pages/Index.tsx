import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import heroProduce from '@/assets/hero-produce.jpg'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Heart, Leaf, ShieldCheck } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

const Index = () => {

    const featuredProducts = products.slice(0,4)
  return (
    <div>
      <Navbar />
      
     <section 
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted overflow-hidden"
        role="banner"
        aria-labelledby="hero-title"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h1 id="hero-title" className="text-5xl md:text-6xl font-bold leading-tight">
                Fresh{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Organic Produce
                </span>
                <br />
                Delivered to Your Door
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover the finest selection of organic fruits and vegetables. 
                Learn about nutrition, find delicious recipes, and embrace a healthier lifestyle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="lg" asChild>
                  <Link to="/store">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/recipes">Explore Recipes</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroProduce}
                alt="Fresh organic fruits and vegetables"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

        {/* FEATURED  */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="features-title">
        <div className="max-w-7xl mx-auto">
          <h2 id="features-title" className="sr-only">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
                <p className="text-muted-foreground">
                  All our produce is certified organic and sustainably sourced from local farms.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-secondary-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nutrition First</h3>
                <p className="text-muted-foreground">
                  Detailed nutritional information and vitamin facts for every product.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessible for All</h3>
                <p className="text-muted-foreground">
                  Inclusive design with comprehensive accessibility features for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

        {/* FEATURED PRODUCTS in list */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50" aria-labelledby="featured-title">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="featured-title" className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground">
              Handpicked organic produce for your healthy lifestyle
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="default" size="lg" asChild>
              <Link to="/store">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

        {/* FOOTER VERY IMP */}
        <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8" role="contentinfo">
            <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-xl font-bold">Orange Sulphur</span>
            </div>
            <p className="text-muted-foreground mb-4">
                Fresh organic produce for a healthier tomorrow
            </p>
            <p className="text-sm text-muted-foreground">
                © 2025 Orange Sulphur. All rights reserved. | SER598 Advanced Web Project
            </p>
            </div>
      </footer>
    </div>
  )
}

export default Index

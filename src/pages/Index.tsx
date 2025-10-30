import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import heroProduce from '@/assets/hero-produce.jpg'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Leaf, ShieldCheck } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

const Index = () => {
  return (
    <div>
      <Navbar />
      
      <section>
        <div>
            <div>
                <h1>
                    Fresh{' '}
                    <span>
                        Organic Produce
                    </span>
                    Delivered to YOUR DOORSTEP's
                </h1>
                <p>
                Discover the finest selection of organic fruits and vegetables. 
                Learn about nutrition, find delicious recipes, and embrace a healthier lifestyle.
                </p>

                <div>
                    <Button asChild>
                        <Link to='/store'>
                        Shop Now
                        </Link>
                    </Button>

                    <Button>
                        <Link to='/recipe'>
                            Explore Recipes
                        </Link>
                    </Button>


                </div>
            </div>

            <div>
                <img src={heroProduce} alt="" />
            </div>

        </div>
      </section>

        {/* FEATURED  */}
        <section>
            <div>
                <h2>Our Features</h2>
                <div>
                    <Card>
                        <CardContent>
                            <div>
                                <Leaf>
                                    
                                </Leaf>
                            </div>
                            <h3>100% Organic</h3>
                            <p>
                                 All our produce is certified organic and sustainably sourced from local farms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div>
                                <Heart/>
                                    
                               
                            </div>
                            <h3>Nutrition First</h3>
                            <p>
                                 Detailed nutritional information and vitamin facts for every product.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div>
                                <ShieldCheck/>
                                    
                               
                            </div>
                            <h3>Accessible for ALL </h3>
                            <p>
                               Inclusive design with comprehensive accessibility features for everyone.
                            </p>
                        </CardContent>
                    </Card>


                </div>
            </div>
        </section>

        {/* FEATURED PRODUCTS in list */}
        <section>
            <div>
                <div>
                    <h2>Featured Products</h2>
                    <p>
                        Handpicked Organic produce for your healthy lifestyle
                    </p>
                </div>
                <div>
                    <ProductCard />
                </div>
                <div>
                    <Button>
                        <Link>
                        View ALL Products
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* FOOTER VERY IMP */}
        <footer>
            <div>
                <div>
                    <Leaf/>
                    <span>Orange Sulphur</span>
                </div>
                <p>
                    Fresh Oragnic produce for a healthier tomorrow
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

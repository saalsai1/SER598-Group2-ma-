import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '@/redux/store';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Store = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const accessibility = useSelector((state: RootState) => state.accessibility);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Update search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // Auto-read results when enabled and search changes
  useEffect(() => {
    if (accessibility.autoReadEnabled && searchQuery && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Build text to read
      let textToRead = '';
      if (filteredProducts.length === 0) {
        textToRead = `No products found for "${searchQuery}". Try adjusting your search.`;
      } else {
        textToRead = `Found ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} for "${searchQuery}". `;
        
        // Read first 5 products
        const productsToRead = filteredProducts.slice(0, 5);
        productsToRead.forEach((product, index) => {
          textToRead += `${index + 1}. ${product.name}, priced at $${product.price.toFixed(2)}. `;
        });
        
        if (filteredProducts.length > 5) {
          textToRead += `And ${filteredProducts.length - 5} more products.`;
        }
      }

      // Speak after a short delay to allow UI to update
      const timer = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }, 500);

      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }
  }, [searchQuery, filteredProducts.length, accessibility.autoReadEnabled]);

  return (
    <div 
      className={`min-h-screen ${accessibility.highContrast ? 'high-contrast' : ''} ${accessibility.reducedMotion ? 'reduce-motion' : ''} ${accessibility.colorBlindMode !== 'none' ? accessibility.colorBlindMode : ''}`}
      style={{
        fontSize: accessibility.fontSize === 'large' ? '1.5rem' : accessibility.fontSize === 'xlarge' ? '2rem' : '1rem',
        fontFamily: accessibility.dyslexiaFont ? 'OpenDyslexic, Arial, sans-serif' : 'inherit',
      }}
    >
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Organic Store
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our complete selection of fresh, organic fruits and vegetables
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between animate-slide-up">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search products"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-64" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground" role="status" aria-live="polite">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {searchQuery && ` for "${searchQuery}"`}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" role="alert">
            <p className="text-xl text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Store;
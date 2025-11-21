import React from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { addToCart } from '@/redux/slices/cartSlice'
import { toast } from 'sonner'

interface ProductCardProps { 
    id: string | number
    name:string
    category: string
    price: number
    image: string
    nutrition : { 
        calories: number
        vitamins: string[]
    }
    organic: boolean
}


const ProductCard = ({id, name, category, price, image, nutrition, organic} : ProductCardProps) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, price, image, category }))
    toast.success(`${name} added to cart!`)
  }

  return (
        <Card className="overflow-hidden hover:shadow-[var(--shadow-hover)] transition-all duration-300 group" role="article" aria-label={`${name} product card`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image}
            alt={`Fresh organic ${name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {organic && (
            <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground" aria-label="Certified organic">
              Organic
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2 text-xs">
            {category}
          </Badge>
          <CardTitle className="text-xl mb-2">{name}</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground space-y-1" role="region" aria-label="Nutritional information">
          <p>
            <span className="font-medium">Calories:</span> {nutrition.calories} per 100g
          </p>
          <p>
            <span className="font-medium">Rich in:</span> {nutrition.vitamins.join(', ')}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-2xl font-bold text-primary" aria-label={`Price: ${price} dollars`}>
          ${price.toFixed(2)}
        </span>
        <Button variant="default" size="sm" onClick={handleAddToCart} aria-label={`Add ${name} to cart`}>
          <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard

import React from 'react'

interface ProductCardProps { 
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


const ProductCard = () => {
  return (
    <div>
      ProductCard
    </div>
  )
}

export default ProductCard

import React from 'react'
// @ts-ignore
import  RecipeSearch from "../components/recipes/RecipeSearch"
import Navbar from '@/components/Navbar'
const Recipe = () => {
  return (
<>
  <Navbar />
  <main id="main-content" className="min-h-screen">
    <RecipeSearch />
  </main>
</>

  )
}

export default Recipe

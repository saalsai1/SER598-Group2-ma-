import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NotFound = () => {

const location = useLocation()
useEffect(() => { 
    console.error('404 error : user hoped to non-existing path', location.pathname)
}, [location.pathname])
  return (
    <><Navbar />
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <h1 className="mb-4 text-6xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
        <p className="mb-2 text-2xl font-semibold text-foreground">Oops! Page not found</p>
        <p className="mb-8 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="default" size="lg">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div></>
  )
}

export default NotFound

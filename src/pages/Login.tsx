import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessibility = useSelector((state: RootState) => state.accessibility);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isSignUp && !name)) {
      toast.error('Please fill in all fields');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // For demo purposes, we'll accept any credentials
    const user = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
    };

    dispatch(login(user));
    toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
    navigate('/store');
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 ${
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
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-10 w-10 text-primary" aria-hidden="true" />
            <span className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Orange Sulphur
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your information to create your account'
              : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  aria-label="Full name"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  aria-label="Email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                  aria-label="Password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

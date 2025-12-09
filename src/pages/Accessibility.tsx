import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Navbar from '@/components/Navbar';
import SpeechAccessibility from '@/components/SpeechAccessibility';
import AccessibilityMenu from '@/components/AccessibilityMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Volume2, Eye, Type } from 'lucide-react';

const Accessibility: React.FC = () => {
  const accessibility = useSelector((state: RootState) => state.accessibility);

  const getFontSize = () => {
    switch (accessibility.fontSize) {
      case 'large': return '1.5rem';
      case 'xlarge': return '2rem';
      default: return '1rem';
    }
  };

  return (
    <div 
      className={`min-h-screen bg-background ${accessibility.highContrast ? 'high-contrast' : ''} ${accessibility.reducedMotion ? 'reduce-motion' : ''} ${accessibility.colorBlindMode !== 'none' ? accessibility.colorBlindMode : ''}`}
      style={{ 
        fontSize: getFontSize(),
        fontFamily: accessibility.dyslexiaFont ? 'OpenDyslexic, Arial, sans-serif' : 'inherit'
      }}
    >
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Accessibility Features</h1>
          <p className="text-muted-foreground">
            Customize your experience with our accessibility tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
       
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Speech Tools</h2>
            </div>
            <SpeechAccessibility />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Visual Settings</h2>
            </div>
            <AccessibilityMenu onClose={() => {}} />
          </div>
        </div>

    
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Volume2 className="h-5 w-5" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Type or dictate text, then click "Read Aloud" to hear it spoken. 
              Great for proofreading or users with visual impairments.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5" />
                Visual Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              High contrast mode, color blind filters, and reduced motion 
              help users with various visual needs navigate comfortably.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5" />
                Reading Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Adjust font sizes and enable OpenDyslexic font to improve 
              readability for users with dyslexia or reading difficulties.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Accessibility;

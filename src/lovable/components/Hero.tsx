import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ["Samarbete", "Förberedelser", "Kundkännedom", "Informationsinhämtning", "Gemensamt arbete"];
  const colors = ["text-primary", "text-secondary", "text-accent"];
  
  const getCurrentColor = () => colors[currentWordIndex % colors.length];

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#vision');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const shouldDelete = isDeleting;
    
    const timeout = setTimeout(() => {
      if (shouldDelete) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, shouldDelete ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* House Background Image - Responsive positioning */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-bottom"
        style={{ 
          backgroundImage: `url(/lovable-uploads/a0f37486-2b11-4c63-902e-281d9bb12e2b.png)`,
          backgroundPosition: 'center bottom'
        }}
      />
      
      {/* Gradient overlay for better text readability on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/20 md:from-transparent md:via-transparent md:to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10 pt-32 md:pt-80 pb-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
            Ett mäklarsystem för
          </h1>
          
          <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 ${getCurrentColor()} drop-shadow-lg`}>
            {currentText}
            <span className="animate-pulse">|</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="default" 
              size="lg"
              onClick={scrollToNextSection}
            >
              Läs mer
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
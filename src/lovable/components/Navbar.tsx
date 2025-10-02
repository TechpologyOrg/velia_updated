import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Vår vision", href: "#vision" },
    { name: "Funktioner", href: "#functions" },
    { name: "Framtiden", href: "#future" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-20" : "h-36"
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={isScrolled ? "/lovable-uploads/2faecef0-c708-4ff3-92c0-35f0eb4cea54.png" : "/lovable-uploads/6a20d640-aec8-4cd4-8bd0-780ad3f61696.png"}
              alt="Velia" 
              className={`w-auto transition-all duration-300 ${
                isScrolled ? "h-16" : "h-28"
              }`}
            />
          </div>

          {/* Desktop Navigation - Only show when scrolled */}
          {isScrolled && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}

          {/* Desktop CTA - Always visible */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant={isScrolled ? "accent" : "outline"} 
              size="sm"
              className={!isScrolled ? "bg-white text-accent border-white hover:bg-white/90" : ""}
            >
              Logga in
            </Button>
          </div>

          {/* Mobile Menu Button - Only show when scrolled */}
          {isScrolled && (
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu - Only show when scrolled */}
        {isMobileMenuOpen && isScrolled && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
            <div className="px-2 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button 
                  variant="accent" 
                  size="sm" 
                  className="justify-start"
                >
                  Logga in
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
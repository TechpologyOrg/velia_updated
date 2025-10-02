import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-2xl" />
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Brand Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-8">
          <p className="text-muted-foreground max-w-2xl">
            Den moderna mäklarplattformen som hjälper dig att sälja fastigheter snabbare och mer effektivt än någonsin.
          </p>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t pt-8 flex flex-col items-center space-y-4 text-sm text-muted-foreground">
          <span>© 2024 Velia. Alla rättigheter förbehållna.</span>
          <div className="flex items-center space-x-1">
            <span>Gjord med</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>för svenska mäklare</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
import { Badge } from "./ui/badge.tsx";

export const Development = () => {
  return (
    <section id="future" className="pt-16 pb-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header with Text */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Framtiden
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vi bygger Velia tillsammans med dig
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground mb-6">
              Vi utvecklar tjänsten sida vid sida med mäklare för att säkerställa att den verkligen gör skillnad i vardagen. Därför vill vi gärna höra dina tankar, idéer och önskemål. Din feedback hjälper oss att forma en plattform som gör jobbet enklare och roligare för hela branschen.
            </p>
            <p className="text-lg text-muted-foreground">
              Kontakta oss gärna på <a href="mailto:oskar.olsson@velia.se" className="text-primary hover:underline">oskar.olsson@velia.se</a>
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/42c89047-b68e-4ae8-9b8c-67ba9ba7b3bf.png" 
            alt="Velia illustration med professionella mäklare"
            className="w-full max-w-2xl h-auto"
          />
        </div>
      </div>
    </section>
  );
};
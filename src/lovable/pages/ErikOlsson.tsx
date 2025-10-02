import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import erikOlssonLogo from "@/assets/erik-olsson-logo.png";
import oskarOlssonPhoto from "@/assets/oskar-olsson.png";

const ErikOlsson = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Logo and Header */}
        <div className="space-y-6">
          <img src={erikOlssonLogo} alt="Erik Olsson" className="h-10" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Ärenden</h1>
            <p className="text-muted-foreground">Dina aktiva kundkännedomsärenden</p>
          </div>
        </div>

        {/* List of Cases */}
        <div className="space-y-4">
          {/* Case Card 1 - Kundkännedom */}
          <Card className="overflow-hidden transition-shadow hover:shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">Kundkännedom</h3>
                  <p className="text-sm text-muted-foreground">Erik Olssons fastighetsförmedling</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <img
                    src={oskarOlssonPhoto}
                    alt="Oskar Olsson"
                    className="h-24 w-auto object-contain"
                  />
                  
                  <div className="space-y-0.5">
                    <p className="font-semibold">Oskar Olsson</p>
                    <p className="text-sm text-muted-foreground">070 716 14 25</p>
                    <p className="text-sm text-muted-foreground">oskar@eo.se</p>
                  </div>
                  
                  <Button size="sm">Öppna</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Card 2 - Arbetsmapp */}
          <Card className="overflow-hidden transition-shadow hover:shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">Arbetsmapp</h3>
                  <p className="text-sm text-muted-foreground">Erik Olssons fastighetsförmedling</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <img
                    src={oskarOlssonPhoto}
                    alt="Oskar Olsson"
                    className="h-24 w-auto object-contain"
                  />
                  
                  <div className="space-y-0.5">
                    <p className="font-semibold">Oskar Olsson</p>
                    <p className="text-sm text-muted-foreground">070 716 14 25</p>
                    <p className="text-sm text-muted-foreground">oskar@eo.se</p>
                  </div>
                  
                  <Button size="sm">Öppna</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Card 3 - Mäklarbild */}
          <Card className="overflow-hidden transition-shadow hover:shadow-md rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">Mäklarbild</h3>
                  <p className="text-sm text-muted-foreground">Erik Olssons fastighetsförmedling</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <img
                    src={oskarOlssonPhoto}
                    alt="Oskar Olsson"
                    className="h-24 w-auto object-contain"
                  />
                  
                  <div className="space-y-0.5">
                    <p className="font-semibold">Oskar Olsson</p>
                    <p className="text-sm text-muted-foreground">070 716 14 25</p>
                    <p className="text-sm text-muted-foreground">oskar@eo.se</p>
                  </div>
                  
                  <Button size="sm">Öppna</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ErikOlsson;

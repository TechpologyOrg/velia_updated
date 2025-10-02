import { Badge } from "./ui/badge.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Shield, Search, FileText, Brain, AlertTriangle, MessageCircle, Zap } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Vår vision section with background image */}
        <div id="vision" className="relative mb-16 overflow-hidden py-8 md:py-0">
          {/* Background image positioned to the right - hidden on mobile */}
          <div 
            className="hidden md:block absolute right-0 top-0 md:w-1/2 h-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(/lovable-uploads/790b34b6-19a5-4a99-bb88-449d651391c6.png)` }}
          />
          
          <div className="max-w-full md:max-w-2xl relative z-10">
            <Badge variant="secondary" className="mb-4">
              Vår vision
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Allt för arbetet
              <span className="text-primary"> före annonsering</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Hur många timmar försvinner på administration istället för på kunderna? Vi vet svaret, alldeles för många. Mail, system och dubbeljobb tar energi som borde gå till affärerna.
            </p>
            <p className="text-xl text-muted-foreground">
              Vi är själva mäklare, entreprenörer och ekonomer som har suttit där, sena kvällar för att jobba ifatt. Därför bygger vi Velia. Ett verktyg som tar hand om allt administrationen innan annonsen går live. Mindre administration. Mer tid för att stänga affärer.
            </p>
          </div>
        </div>
        
        {/* Kom igång section - HIDDEN */}
        {/* <div id="get-started" className="mb-16 mt-24 text-center">
          <Badge variant="secondary" className="mb-4">
            Kom igång
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Onboarda ditt
            <span className="text-primary"> kontor idag</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground mb-12">
              Är du redo att förenkla arbetet före annonsering? Vår onboarding är en enkel fyrstegsprocess som får dig igång snabbt.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <h3 className="font-semibold mb-2">Skicka information</h3>
                <p className="text-sm text-muted-foreground">Vi kontrollerar att ert varumärke är aktivt</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <h3 className="font-semibold mb-2">Kontakt & möte</h3>
                <p className="text-sm text-muted-foreground">En kontaktperson hör av sig och bokar onboarding-möte</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="font-semibold mb-2">Startavgift</h3>
                <p className="text-sm text-muted-foreground">En engångsavgift dras för att aktivera tjänsten</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">4</span>
                </div>
                <h3 className="font-semibold mb-2">Ni är igång!</h3>
                <p className="text-sm text-muted-foreground">Hela teamet kan börja använda Velia direkt</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                  Kontakta oss
                </button>
              </a>
              <a href="#contact">
                <button className="px-8 py-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold">
                  Boka demo
                </button>
              </a>
            </div>
          </div>
        </div> */}
        
        {/* Right-aligned section */}
        <div id="functions" className="flex justify-end mb-16 mt-24">
          <div className="max-w-2xl text-right">
            <Badge variant="secondary" className="mb-4">
              Funktioner
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vår resa börjar med
              <span className="text-primary"> Kundkännedom</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Branschen har länge saknat digitala verktyg som gör mäklarens kundkännedom enkel och smidig. Därför lanserar vi nu det första KYC-flödet, speciellt utformat för mäklarens unika krav.
            </p>
          </div>
        </div>
        
        {/* KYC Functions - Block Layout */}
        <div className="mb-16">
          <div className="grid gap-0 overflow-hidden rounded-2xl shadow-lg">
            
            {/* Riskhantering & Compliance - Top Block */}
            <div className="p-8 md:p-12 text-white text-center" style={{background: 'linear-gradient(135deg, #5B693A, #6B7B4A)'}}>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold italic">Riskhantering & Compliance</h2>
                <p className="text-lg text-white/90 mt-2">Intelligent automation och regelefterlevnad</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Brain className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">AI-baserat beslutsstöd</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Ger rekommendationer för riskklassning och åtgärder</p>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">Automatiserade skärpta åtgärder</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Systemet eskalerar när förhöjd risk upptäcks</p>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">Automatiska triggers</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Händelsestyrda processer vid avvikande beteenden</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branschanpassad kundkännedom - Middle Block - Center aligned */}
            <div className="p-8 md:p-12 text-white text-center" style={{background: 'linear-gradient(135deg, #EDA52F, #F2B547)'}}>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold italic">Branschanpassad kundkännedom</h2>
                <p className="text-lg text-white/90 mt-2">Specialiserad för fastighetsmäklare</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">Frågeformulär för mäklare</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Specialanpassade frågor som uppfyller fastighetsmäklarlagens krav</p>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">Dynamiska följdfrågor</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Systemet anpassar uppföljningen efter kundens svar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Identifiering & Screening - Bottom Block */}
            <div className="p-8 md:p-12 text-white text-center" style={{background: 'linear-gradient(135deg, #EC762C, #F28B47)'}}>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold italic">Identifiering & Screening</h2>
                <p className="text-lg text-white/90 mt-2">Säker verifiering och riskbedömning</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">ID-kontroll</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Säker verifiering via BankID och internationella standarder</p>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Search className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
                    <h4 className="font-semibold text-white">PEP- & sanktionsscreening</h4>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-sm text-white/80 pt-2">Automatisk kontroll mot globala och nationella listor</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
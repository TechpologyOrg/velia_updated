import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowLeft, Plus, User, Mail, IdCard, X, Edit2, Calendar as CalendarIcon, ChevronDown, ChevronUp, Archive } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  
  // Main group data state - this will be edited directly
  const [groupData, setGroupData] = useState({
    id: id,
    address: "Östra mårtensgatan 18E",
    postnummer: "223 61",
    ort: "Lund",
    mäklare: "Daniel Stjernkvist",
    koordinator: "Nellie Barv",
    members: [
      {
        name: "victor trågårdh",
        email: "asd@asd.se",
        phone: "200308124213"
      }
    ],
    link: "https://www.velia.se/ErikOlsson/customer/login?oid=1&organisation=ErikOlsson"
  });
  
  // Ärende dialog state
  const [isArendeDialogOpen, setIsArendeDialogOpen] = useState(false);
  const [selectedArende, setSelectedArende] = useState("");
  const [searchArende, setSearchArende] = useState("");
  const [isDelat, setIsDelat] = useState(false);
  const [deadline, setDeadline] = useState<Date>();
  const [arenden, setArenden] = useState<Array<{
    id: string;
    name: string;
    isDelat: boolean;
    deadline?: Date;
    isExpanded?: boolean;
  }>>([]);
  
  // KYC form state
  const [kycChecks, setKycChecks] = useState({
    identitet: false,
    pep: false,
    risk: false,
    ai: false
  });
  
  const [isDecisionMade, setIsDecisionMade] = useState(false);

  const availableArenden = [
    { id: "kyc", name: "KYC - Kundkännedom", description: "Identitetsverifiering och bakgrundskontroll av kunder" }
  ];

  const filteredArenden = availableArenden.filter(arende =>
    arende.name.toLowerCase().includes(searchArende.toLowerCase()) ||
    arende.description.toLowerCase().includes(searchArende.toLowerCase())
  );

  const koordinatorOptions = [
    { value: "nellie-barv", label: "Nellie Barv" },
    { value: "anna-svensson", label: "Anna Svensson" },
    { value: "erik-larsson", label: "Erik Larsson" }
  ];

  const updateGroupField = (field: keyof typeof groupData, value: string) => {
    setGroupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddArende = () => {
    if (selectedArende) {
        const newArende = {
          id: Date.now().toString(),
          name: selectedArende,
          isDelat,
          deadline,
          isExpanded: false
        };
      setArenden([...arenden, newArende]);
      
      // Reset form
      setSelectedArende("");
      setSearchArende("");
      setIsDelat(false);
      setDeadline(undefined);
      setIsArendeDialogOpen(false);
    }
  };

  const toggleArendeExpansion = (arendeId: string) => {
    setArenden(prev => prev.map(arende => 
      arende.id === arendeId 
        ? { ...arende, isExpanded: !arende.isExpanded }
        : arende
    ));
  };

  const handleKycCheckChange = (checkType: keyof typeof kycChecks, checked: boolean) => {
    setKycChecks(prev => ({
      ...prev,
      [checkType]: checked
    }));
  };

  const handleTaBeslut = () => {
    setIsDecisionMade(true);
  };

  return (
    <div className="p-2 md:p-4 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tillbaka
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                {isEditing ? "Avsluta redigering" : "Redigera grupp"}
              </Button>
            </div>
            {!isEditing && (
              <Button
                variant={isArchived ? "default" : "outline"}
                size="sm"
                onClick={() => setIsArchived(!isArchived)}
                className={`flex items-center gap-2 ${
                  isArchived 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "text-orange-600 border-orange-300 hover:bg-orange-50"
                }`}
              >
                <Archive className="h-4 w-4" />
                {isArchived ? "Återställ grupp" : "Arkivera grupp"}
              </Button>
            )}
          </div>
          {!isEditing && (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {groupData.address} {groupData.postnummer}, {groupData.ort}
                </h1>
                {isArchived && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300">
                    Arkiverad
                  </Badge>
                )}
              </div>
              <a 
                href={groupData.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm block"
              >
                {groupData.link}
              </a>
            </>
          )}
        </div>

        <div className="space-y-6">
          {/* Editing Card - shows when editing */}
          {isEditing && (
            <Card className="p-6 md:p-8">
              <CardContent className="p-0 space-y-6 md:space-y-8">
                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left column - Adressuppgifter */}
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Adressuppgifter</h2>
                    <div className="space-y-4">
                      <div className="max-w-none sm:max-w-md">
                        <Input
                          placeholder="Adress"
                          value={groupData.address}
                          onChange={(e) => updateGroupField('address', e.target.value)}
                          className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0 text-lg"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 max-w-none sm:max-w-md">
                        <div className="flex-1 min-w-0">
                          <Input
                            placeholder="Postnummer"
                            value={groupData.postnummer}
                            onChange={(e) => updateGroupField('postnummer', e.target.value)}
                            className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0"
                          />
                        </div>
                        <div className="flex items-center flex-1 min-w-0">
                          <span className="mr-2 text-muted-foreground hidden sm:inline">,</span>
                          <Input
                            placeholder="Ort"
                            value={groupData.ort}
                            onChange={(e) => updateGroupField('ort', e.target.value)}
                            className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0 flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Deltagare */}
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Deltagare</h2>
                    {/* Välj koordinator Section */}
                    <div className="space-y-4">
                      <Select 
                        value={groupData.koordinator} 
                        onValueChange={(value) => updateGroupField('koordinator', value)}
                      >
                        <SelectTrigger className={`w-full max-w-none sm:max-w-md border transition-colors ${
                          groupData.koordinator 
                            ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' 
                            : 'border-input bg-background hover:bg-accent/50'
                        }`}>
                          <SelectValue placeholder="Välj koordinator" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          {koordinatorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.label} className="hover:bg-accent">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Lägg till säljare Section */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Säljare</h2>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Lägg till säljare
                  </Button>
                  
                  {groupData.members.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
                      Ingen säljare tillagd än. Klicka på "Lägg till" för att börja.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupData.members.map((member, index) => (
                        <Card key={index} className="relative">
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{member.name || "Ej angivet"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{member.phone || "Ej angivet"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{member.email || "Ej angivet"}</span>
                              </div>
                              <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 flex items-center gap-2"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  Redigera
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="w-10 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Normal View - shows when not editing */}
          {!isEditing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left column - Mäklare and Koordinator */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Mäklare</h3>
                    <p className="text-sm">{groupData.mäklare}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Koordinator</h3>
                    <p className="text-sm">{groupData.koordinator}</p>
                  </div>
                </div>

                {/* Right columns - Säljare */}
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Säljare</h2>
                    </div>
                    
                    {groupData.members.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
                        Ingen säljare tillagd än.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {groupData.members.map((member, index) => (
                          <Card key={index} className="relative">
                            <CardContent className="p-3">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{member.name || "Ej angivet"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <IdCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{member.phone || "Ej angivet"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{member.email || "Ej angivet"}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-6 border-t border-border">
          <div className={isEditing ? "flex justify-center pt-2" : "flex justify-center gap-4 pt-2"}>
            {isEditing ? (
              <Button 
                size="lg"
                className="px-8 md:px-12"
              >
                Spara ändringar
              </Button>
            ) : (
              <Dialog open={isArendeDialogOpen} onOpenChange={setIsArendeDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="px-8 md:px-12"
                  >
                    Lägg till ärende
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Lägg till ärende</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {!selectedArende ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="search">Sök ärende</Label>
                          <Input
                            id="search"
                            placeholder="Sök bland ärenden..."
                            value={searchArende}
                            onChange={(e) => setSearchArende(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                          {filteredArenden.map((arende) => (
                            <Card 
                              key={arende.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                              onClick={() => setSelectedArende(arende.name)}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">{arende.name}</h4>
                                  <p className="text-xs text-muted-foreground">{arende.description}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {filteredArenden.length === 0 && (
                          <p className="text-muted-foreground text-center py-8">
                            Inga ärenden hittades för din sökning.
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedArende("")}
                              className="p-0 h-auto"
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                              <h3 className="font-medium">{selectedArende}</h3>
                              <p className="text-sm text-muted-foreground">
                                {availableArenden.find(a => a.name === selectedArende)?.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="delat" 
                              checked={isDelat} 
                              onCheckedChange={(checked) => setIsDelat(checked as boolean)}
                            />
                            <Label htmlFor="delat" className="text-sm">Delat ärende</Label>
                          </div>

                          <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !deadline && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {deadline ? format(deadline, "PPP") : <span>Välj datum</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={deadline}
                                  onSelect={setDeadline}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsArendeDialogOpen(false);
                          setSelectedArende("");
                          setSearchArende("");
                          setIsDelat(false);
                          setDeadline(undefined);
                        }}
                        className="flex-1"
                      >
                        Avbryt
                      </Button>
                      <Button 
                        onClick={handleAddArende}
                        disabled={!selectedArende}
                        className="flex-1"
                      >
                        Lägg till
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Ärenden Section */}
        {arenden.length > 0 && (
          <div className={cn("space-y-4", isEditing && "opacity-50 pointer-events-none")}>
            <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Ärenden</h2>
            <div className="space-y-3">
              {arenden.map((arende) => (
                <Collapsible 
                  key={arende.id} 
                  open={arende.isExpanded} 
                  onOpenChange={() => toggleArendeExpansion(arende.id)}
                >
                  <Card className={cn(
                    "w-full transition-colors",
                    arende.isExpanded 
                      ? "bg-background" 
                      : "bg-orange-500 hover:bg-orange-600"
                  )}>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className={cn(
                              "text-base font-medium",
                              arende.isExpanded ? "text-foreground" : "text-white"
                            )}>{arende.name}</CardTitle>
                            {arende.isExpanded ? (
                              <ChevronUp className={cn(
                                "h-4 w-4",
                                arende.isExpanded ? "text-muted-foreground" : "text-white/70"
                              )} />
                            ) : (
                              <ChevronDown className={cn(
                                "h-4 w-4", 
                                arende.isExpanded ? "text-muted-foreground" : "text-white/70"
                              )} />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {arende.isDelat && (
                              <span className={cn(
                                "text-xs px-2 py-1 rounded",
                                arende.isExpanded 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-white/20 text-white"
                              )}>
                                Delat ärende
                              </span>
                            )}
                            <span className={cn(
                              "text-xs px-2 py-1 rounded",
                              arende.isExpanded 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-white/20 text-white"
                            )}>
                              Ej påbörjad
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CardContent className="pt-0">
                      <div className={cn(
                        "flex items-center gap-2 text-sm mb-4",
                        arende.isExpanded ? "text-muted-foreground" : "text-white/80"
                      )}>
                        <CalendarIcon className="h-4 w-4" />
                        <span>Förfallodatum: {arende.deadline ? format(arende.deadline, "PPP") : "Ej satt"}</span>
                      </div>

                      <CollapsibleContent className={cn(
                        "space-y-6 rounded-lg p-4",
                        arende.isExpanded ? "bg-white border" : ""
                      )}>
                        {arende.name === "KYC - Kundkännedom" && (
                          <div className="border-t pt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left column - Form data */}
                              <div className="space-y-6">
                                {/* Formulärdata */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-4">Formulärdata</h3>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Syfte & Art</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Försäljning av fastighet för överföring till familjemedlem. Transaktionen avser 
                                        privatbostad som varit i ägo sedan 2018.
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Ursprung</h4>
                                      <p className="text-sm text-muted-foreground">
                                        Medel härrör från lön och sparande under flera år. Fastigheten förvärvades 
                                        genom banklån 2018.
                                      </p>
                                    </div>
                                    
                                    <Button variant="outline" size="sm" className="mt-4 flex items-center gap-2">
                                      <Edit2 className="h-4 w-4" />
                                      Öppna formulär
                                    </Button>
                                  </div>
                                  
                                  {/* Risk indikationer */}
                                  <div className="mt-6">
                                    <h4 className="font-semibold mb-3">Risk indikationer</h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                          <span className="text-sm text-red-700">Mycket kort innehavstid: 8gt &lt;3 månader</span>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:underline">
                                          Klicka för att komplettera
                                        </button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                          <span className="text-sm text-red-700">Oklar ekonomisk bakgrund</span>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:underline">
                                          Klicka för att komplettera
                                        </button>
                                      </div>
                                      
                                      <div className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                          <span className="text-sm text-red-700">Bristfällig dokumentation</span>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:underline">
                                          Klicka för att komplettera
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    className="mt-6 bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                                    onClick={handleTaBeslut}
                                  >
                                    <span>🎯</span>
                                    Ta beslut
                                  </Button>
                                </div>
                              </div>

                              {/* Right column - Status cards */}
                              <div className="space-y-4">
                                {/* ID-kontroll och PEP & Sanktionslistor */}
                                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-orange-500 rounded-lg">
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <CardTitle className="text-base font-medium text-white">ID-kontroll</CardTitle>
                                      </div>
                                      <span className="text-sm bg-white text-gray-700 px-3 py-1 rounded-full font-medium">
                                        Slutförd
                                      </span>
                                    </div>
                                    <hr className="border-white/20 my-3" />
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base font-medium text-white">PEP & Sanktionslistor</CardTitle>
                                      <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full font-medium">
                                        Flaggad - EU Sanktionslista
                                      </span>
                                    </div>
                                  </CardHeader>
                                </Card>

                                {/* AI - Sammanfattning */}
                                <Card className="bg-orange-600 border-orange-600">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                        <span className="text-white text-sm">⚡</span>
                                      </div>
                                      <CardTitle className="text-base font-medium text-white">AI - Sammanfattning</CardTitle>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0 space-y-4">
                                    <div>
                                      <span className="text-sm font-medium text-white block mb-2">Risknivå</span>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" className="text-xs px-3 py-1 bg-white/20 text-white hover:bg-white/30 border-0">
                                          Låg
                                        </Button>
                                        <Button size="sm" className="text-xs px-3 py-1 bg-orange-400 text-white hover:bg-orange-300 border-0">
                                          Medel
                                        </Button>
                                        <Button size="sm" variant="secondary" className="text-xs px-3 py-1 bg-white/20 text-white hover:bg-white/30 border-0">
                                          Hög
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-xs text-white font-medium">AI-ANALYS</span>
                                      </div>
                                      <p className="text-xs text-white/90 leading-relaxed">
                                        Baserat på den korta innehavstiden (&lt;6 månader) och avsaknaden av tydlig 
                                        affärsrelation klassificeras denna transaktion som medelhög risk. Ytterligare 
                                        verifiering av transaktionens syfte rekommenderas innan slutligt godkännande.
                                      </p>
                                    </div>
                                    
                                    <p className="text-xs text-white/70">Genererad: 2025-09-11 17:01</p>
                                  </CardContent>
                                </Card>

                                {/* Skärpta åtgärder */}
                                <div>
                                  <h4 className="font-semibold mb-3">Skärpta åtgärder</h4>
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-sm">Uppföljningsformulär skickat</span>
                                    </div>
                                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded font-medium">
                                      Slutförd
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Bottom buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Checkbox 
                                    id="genomford" 
                                    checked={isDecisionMade}
                                    onCheckedChange={(checked) => setIsDecisionMade(checked as boolean)}
                                    className={isDecisionMade ? "border-green-500 bg-green-500" : ""}
                                  />
                                  <Label htmlFor="genomford" className={`text-sm ${isDecisionMade ? 'text-green-600' : ''}`}>
                                    Genomförd
                                  </Label>
                                </div>
                                <Button variant="outline" size="sm" className="text-sm text-orange-600 border-orange-600 hover:bg-orange-50 flex items-center gap-2">
                                  <Edit2 className="h-4 w-4" />
                                  Generera rapport
                                </Button>
                              </div>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Avbryt process
                              </Button>
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
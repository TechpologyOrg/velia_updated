import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowLeft, X, Edit2, User, Mail, IdCard, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [adress, setAdress] = useState("");
  const [postnummer, setPostnummer] = useState("");
  const [ort, setOrt] = useState("");
  const [mäklare, setMäklare] = useState("");
  const [koordinator, setKoordinator] = useState("");
  const [säljare, setSäljare] = useState<{namn: string, personnummer: string, email: string, isEditing: boolean}[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the group
    navigate("/dashboard");
  };

  const addSäljare = () => {
    setSäljare([...säljare, { namn: "", personnummer: "", email: "", isEditing: true }]);
  };

  return (
    <div className="p-2 md:p-4 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold">Skapa Grupp</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Skapa en ny grupp för fastigheten
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
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
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                        className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0 text-lg"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-none sm:max-w-md">
                      <div className="flex-1 min-w-0">
                        <Input
                          placeholder="Postnummer"
                          value={postnummer}
                          onChange={(e) => setPostnummer(e.target.value)}
                          className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0"
                        />
                      </div>
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="mr-2 text-muted-foreground hidden sm:inline">,</span>
                        <Input
                          placeholder="Ort"
                          value={ort}
                          onChange={(e) => setOrt(e.target.value)}
                          className="border-0 border-b border-muted-foreground rounded-none bg-transparent px-0 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Deltagare */}
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">Deltagare</h2>
                  
                  {/* Välj mäklare Section */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Mäklare</Label>
                    <Select value={mäklare} onValueChange={setMäklare}>
                      <SelectTrigger className={`w-full max-w-none sm:max-w-md border transition-colors ${
                        mäklare 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                          : 'border-input bg-background hover:bg-accent/50'
                      }`}>
                        <SelectValue placeholder="Välj mäklare" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="daniel-stjernkvist" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Daniel Stjernkvist
                          </div>
                        </SelectItem>
                        <SelectItem value="lisa-andersson" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Lisa Andersson
                          </div>
                        </SelectItem>
                        <SelectItem value="johan-berg" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Johan Berg
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Välj koordinator Section */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Koordinator</Label>
                    <Select value={koordinator} onValueChange={setKoordinator}>
                      <SelectTrigger className={`w-full max-w-none sm:max-w-md border transition-colors ${
                        koordinator 
                          ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' 
                          : 'border-input bg-background hover:bg-accent/50'
                      }`}>
                        <SelectValue placeholder="Välj koordinator" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="nellie-barv" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nellie Barv
                          </div>
                        </SelectItem>
                        <SelectItem value="anna-svensson" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Anna Svensson
                          </div>
                        </SelectItem>
                        <SelectItem value="erik-larsson" className="hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Erik Larsson
                          </div>
                        </SelectItem>
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
                  onClick={addSäljare}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Lägg till säljare
                </Button>
                
                {säljare.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
                    Ingen säljare tillagd än. Klicka på "Lägg till" för att börja.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {säljare.map((seller, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-3">
                        {seller.isEditing ? (
                          // Edit Mode
                          <div className="space-y-2">
                            <Input
                              placeholder="Namn"
                              value={seller.namn}
                              onChange={(e) => {
                                const newSäljare = [...säljare];
                                newSäljare[index].namn = e.target.value;
                                setSäljare(newSäljare);
                              }}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Personnummer"
                              value={seller.personnummer}
                              onChange={(e) => {
                                const newSäljare = [...säljare];
                                newSäljare[index].personnummer = e.target.value;
                                setSäljare(newSäljare);
                              }}
                              className="text-sm"
                            />
                            <Input
                              placeholder="E-mail"
                              type="email"
                              value={seller.email}
                              onChange={(e) => {
                                const newSäljare = [...säljare];
                                newSäljare[index].email = e.target.value;
                                setSäljare(newSäljare);
                              }}
                              className="text-sm"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const newSäljare = [...säljare];
                                  newSäljare[index].isEditing = false;
                                  setSäljare(newSäljare);
                                }}
                              >
                                Spara
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const newSäljare = säljare.filter((_, i) => i !== index);
                                  setSäljare(newSäljare);
                                }}
                                className="w-10 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Display Mode
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{seller.namn || "Ej angivet"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{seller.personnummer || "Ej angivet"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{seller.email || "Ej angivet"}</span>
                            </div>
                            <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex-1 flex items-center gap-2"
                                onClick={() => {
                                  const newSäljare = [...säljare];
                                  newSäljare[index].isEditing = true;
                                  setSäljare(newSäljare);
                                }}
                              >
                                <Edit2 className="h-3 w-3" />
                                Redigera
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const newSäljare = säljare.filter((_, i) => i !== index);
                                  setSäljare(newSäljare);
                                }}
                                className="w-10 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex w-full flex-nowrap items-center justify-between gap-2 pt-6 mt-6 border-t border-border">
                <div className="flex items-center gap-2 flex-nowrap shrink-0">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 min-w-[120px] shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Tillbaka
                  </Button>
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 min-w-[120px] shrink-0"
                  >
                    <X className="h-4 w-4" />
                    Avbryt
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  size="default"
                  className="min-w-[120px] shrink-0 bg-primary hover:bg-primary/90"
                >
                  Skapa grupp
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, User, UserCog, Archive, ArchiveRestore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Groups = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  
  // Mock data based on the screenshot
  const allGroups = [
    {
      id: 1,
      mäklare: "Daniel Stjernkvist",
      säljare: "1",
      koordinator: "Nellie barv",
      adress: "Östra mårtensgatan 18E",
      postnmr: "223 61",
      ort: "Lund",
      archived: false,
    },
    {
      id: 2,
      mäklare: "Anna Svensson",
      säljare: "2",
      koordinator: "Erik Larsson",
      adress: "Storgatan 12",
      postnmr: "211 42",
      ort: "Malmö",
      archived: false,
    },
    {
      id: 3,
      mäklare: "Johan Berg",
      säljare: "3",
      koordinator: "Anna Svensson",
      adress: "Kungsgatan 45",
      postnmr: "411 15",
      ort: "Göteborg",
      archived: false,
    },
    {
      id: 4,
      mäklare: "Lisa Andersson",
      säljare: "2",
      koordinator: "Nellie barv",
      adress: "Vasagatan 22",
      postnmr: "111 20",
      ort: "Stockholm",
      archived: false,
    },
    {
      id: 5,
      mäklare: "Daniel Stjernkvist",
      säljare: "4",
      koordinator: "Erik Larsson",
      adress: "Drottninggatan 8",
      postnmr: "252 21",
      ort: "Helsingborg",
      archived: false,
    },
    {
      id: 6,
      mäklare: "Anna Svensson",
      säljare: "1",
      koordinator: "Anna Svensson",
      adress: "Södergatan 33",
      postnmr: "211 34",
      ort: "Malmö",
      archived: true,
    },
    {
      id: 7,
      mäklare: "Johan Berg",
      säljare: "2",
      koordinator: "Nellie barv",
      adress: "Strandvägen 18",
      postnmr: "114 56",
      ort: "Stockholm",
      archived: true,
    },
  ];

  const groups = allGroups.filter(g => 
    activeTab === "active" ? !g.archived : g.archived
  );

  const handleArchiveToggle = (e: React.MouseEvent, groupId: number) => {
    e.stopPropagation();
    // In a real app, this would update the database
    console.log(`Toggle archive for group ${groupId}`);
  };

  return (
    <div className="p-2 md:p-4 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-bold">Grupper</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Visa och hantera grupper i ett tydligt listformat.
          </p>
        </div>

        {/* Create Group Button */}
        <div className="flex justify-start">
          <Button 
            variant="default"
            size="lg"
            onClick={() => navigate('/dashboard/create-group')}
            className="px-8 md:px-12"
          >
            Skapa grupp
          </Button>
        </div>

        {/* Tabs for Active/Archived */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "archived")} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Aktiva Grupper</TabsTrigger>
            <TabsTrigger value="archived">Arkiverade</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Groups Cards */}
            <div className="grid gap-4">
              {groups.length === 0 ? (
                <Card className="p-8">
                  <p className="text-center text-muted-foreground">
                    {activeTab === "active" ? "Inga aktiva grupper." : "Inga arkiverade grupper."}
                  </p>
                </Card>
              ) : (
                groups.map((group) => (
                  <Card 
                    key={group.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => navigate(`/dashboard/groups/${group.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-8">
                        {/* Address - Left side */}
                        <div className="flex-shrink-0">
                          <h3 className="text-xl md:text-2xl font-semibold">
                            {group.adress}, {group.postnmr} {group.ort}
                          </h3>
                        </div>

                        {/* Right side - All info aligned */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          {/* Mäklare */}
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Mäklare</p>
                              <p className="text-sm font-medium">{group.mäklare}</p>
                            </div>
                          </div>

                          {/* Koordinator */}
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Koordinator</p>
                              <p className="text-sm font-medium">{group.koordinator}</p>
                            </div>
                          </div>

                          {/* Säljare with colored badge */}
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">Säljare</p>
                            <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">{group.säljare}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeTab === "archived") {
                                // Handle delete permanently
                              } else {
                                handleArchiveToggle(e, group.id);
                              }
                            }}
                            title={activeTab === "active" ? "Arkivera grupp" : "Ta bort permanent"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Groups;
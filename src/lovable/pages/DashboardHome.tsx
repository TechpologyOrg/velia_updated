import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Settings, BarChart3 } from "lucide-react";

const DashboardHome = () => {
  const stats = [
    {
      title: "Totalt Grupper",
      value: "12",
      description: "Aktiva grupper",
      icon: Users,
    },
    {
      title: "Mäklare",
      value: "48",
      description: "Registrerade mäklare",
      icon: Building2,
    },
    {
      title: "Koordinatorer",
      value: "8",
      description: "Aktiva koordinatorer",
      icon: Settings,
    },
    {
      title: "Försäljning",
      value: "156",
      description: "Denna månad",
      icon: BarChart3,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Översikt</h1>
        <p className="text-muted-foreground">
          Välkommen till din portal. Här är en översikt över dina grupper och aktiviteter.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Senaste Aktivitet</CardTitle>
            <CardDescription>De senaste uppdateringarna i dina grupper</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ny grupp skapad av Daniel Stjernkvist</p>
                <p className="text-xs text-muted-foreground">2 timmar sedan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Koordinator uppdaterad för Grupp 5</p>
                <p className="text-xs text-muted-foreground">5 timmar sedan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ny mäklare registrerad</p>
                <p className="text-xs text-muted-foreground">1 dag sedan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
            <CardDescription>Vanliga uppgifter och åtgärder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors">
              <div className="font-medium">Skapa ny grupp</div>
              <div className="text-sm text-muted-foreground">Lägg till en ny grupp i systemet</div>
            </button>
            <button className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors">
              <div className="font-medium">Hantera mäklare</div>
              <div className="text-sm text-muted-foreground">Visa och redigera mäklarinformation</div>
            </button>
            <button className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors">
              <div className="font-medium">Exportera data</div>
              <div className="text-sm text-muted-foreground">Ladda ner rapporter och statistik</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera dina kontoinställningar och preferenser.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Uppdatera din profilinformation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Förnamn</Label>
                <Input id="firstName" placeholder="Ditt förnamn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Efternamn</Label>
                <Input id="lastName" placeholder="Ditt efternamn" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="din@email.se" />
            </div>
            <Button>Spara ändringar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifikationer</CardTitle>
            <CardDescription>Välj vilka notifikationer du vill få</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">E-postnotifikationer</Label>
                <p className="text-sm text-muted-foreground">Få uppdateringar via e-post</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="group-updates">Gruppuppdateringar</Label>
                <p className="text-sm text-muted-foreground">Notifikationer när grupper ändras</p>
              </div>
              <Switch id="group-updates" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Veckorapporter</Label>
                <p className="text-sm text-muted-foreground">Få veckosammanfattningar</p>
              </div>
              <Switch id="weekly-reports" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Säkerhet</CardTitle>
            <CardDescription>Hantera dina säkerhetsinställningar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Nuvarande lösenord</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nytt lösenord</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Bekräfta nytt lösenord</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Uppdatera lösenord</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
import { Users, LogOut, Settings, ChevronDown, Home } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock groups data - in a real app, this would come from an API or context
const groups = [
  {
    id: 1,
    adress: "Östra mårtensgatan 18E",
    postnmr: "223 61",
    ort: "Lund",
  },
  {
    id: 2,
    adress: "Storgatan 12",
    postnmr: "211 42",
    ort: "Malmö",
  },
  {
    id: 3,
    adress: "Kungsgatan 45",
    postnmr: "411 15",
    ort: "Göteborg",
  },
  {
    id: 4,
    adress: "Vasagatan 22",
    postnmr: "111 20",
    ort: "Stockholm",
  },
  {
    id: 5,
    adress: "Drottninggatan 8",
    postnmr: "252 21",
    ort: "Helsingborg",
  },
  {
    id: 6,
    adress: "Södergatan 33",
    postnmr: "211 34",
    ort: "Malmö",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
  };

  // Check if we're on a group detail page or groups page
  const isGroupsActive = currentPath === "/dashboard" || currentPath.startsWith("/dashboard/groups/");

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b flex justify-center">
          <img 
            src="/lovable-uploads/2faecef0-c708-4ff3-92c0-35f0eb4cea54.png"
            alt="Velia" 
            className="h-12 w-auto"
          />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Huvudmeny</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collapsible Groups Section */}
              <Collapsible defaultOpen={isGroupsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`flex items-center justify-between w-full ${
                        isGroupsActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Grupper</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Link to all groups/create new - FIRST */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                isActive && currentPath === "/dashboard"
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                              }`
                            }
                          >
                            <Users className="h-3 w-3" />
                            <span className="text-sm">Alla grupper</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      
                      {/* Individual groups */}
                      {groups.map((group) => (
                        <SidebarMenuSubItem key={group.id}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={`/dashboard/groups/${group.id}`}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                  isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                                }`
                              }
                            >
                              <Home className="h-3 w-3" />
                              <span className="text-sm truncate">
                                {group.adress}, {group.ort}
                              </span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSettings}>
                  <Settings className="h-4 w-4" />
                  <span>Inställningar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logga ut</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
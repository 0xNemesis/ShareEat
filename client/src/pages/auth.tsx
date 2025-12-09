import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { UserCircle, Store, ShieldCheck } from "lucide-react";

export default function Auth() {
  const { login } = useStore();
  const [_, setLocation] = useLocation();

  const handleLogin = (role: Role) => {
    login(role);
    if (role === "OWNER") setLocation("/owner-dashboard");
    else if (role === "VOLUNTEER") setLocation("/volunteer-dashboard");
    else setLocation("/explore");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold">Welcome to ShareEat</h1>
          <p className="text-muted-foreground">Select a role to simulate the experience</p>
        </div>

        <div className="grid gap-4">
          <RoleCard 
            title="User (Receiver)" 
            desc="Find and book food nearby" 
            icon={<UserCircle className="h-6 w-6 text-primary" />}
            onClick={() => handleLogin("USER")}
          />
          <RoleCard 
            title="Business Owner" 
            desc="Manage donations and sessions" 
            icon={<Store className="h-6 w-6 text-secondary" />}
            onClick={() => handleLogin("OWNER")}
          />
          <RoleCard 
            title="Volunteer" 
            desc="Distribute food in bulk" 
            icon={<ShieldCheck className="h-6 w-6 text-blue-500" />}
            onClick={() => handleLogin("VOLUNTEER")}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Note: This is a prototype. No real authentication is required.
        </p>
      </div>
    </div>
  );
}

function RoleCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:border-primary hover:shadow-md transition-all group"
      onClick={onClick}
    >
      <div className="flex items-center p-4 gap-4">
        <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-white transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary">
          →
        </Button>
      </div>
    </Card>
  )
}

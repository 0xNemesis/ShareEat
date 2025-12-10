import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionCard } from "@/components/session-card";
import { useStore } from "@/lib/store";
import { Filter, MapPin, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function UserExplore() {
  const { sessions, restaurants, currentUser } = useStore();
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  if (currentUser?.role !== "USER") {
    if (!currentUser) {
        setLocation("/auth");
        return null;
    }
  }

  const activeSessions = sessions.filter(s => s.status === "OPEN" && s.remainingPortions > 0 && s.type !== "VOLUNTEER_ONLY");

  const filteredSessions = activeSessions.filter(session => {
    const restaurant = restaurants.find(r => r.id === session.restaurantId);
    if (!restaurant) return false;
    const matchesSearch = restaurant.name.toLowerCase().includes(search.toLowerCase()) || restaurant.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div>
           <h1 className="font-heading text-3xl font-bold">Explore Food Nearby</h1>
           <p className="text-muted-foreground">Find rescue meals within 5km of your location.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or category..." 
              className="pl-9 bg-white" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-48 md:h-64 bg-slate-100 rounded-xl border flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Standard_map_sample.png')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"></div>
        <div className="relative bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
           <MapPin className="h-4 w-4 text-primary" />
           <span className="text-sm font-medium">You are in Bojongsoang (Radius: 5km)</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Bakery", "Vegetarian", "Meals", "Groceries"].map((cat, i) => (
          <Badge 
            key={cat} 
            variant={i === 0 ? "default" : "outline"} 
            className={`cursor-pointer px-4 py-1.5 text-sm ${i === 0 ? "bg-primary hover:bg-primary/90" : "bg-white hover:bg-slate-50"}`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map(session => {
           const restaurant = restaurants.find(r => r.id === session.restaurantId);
           if (!restaurant) return null;
           return <SessionCard key={session.id} session={session} restaurant={restaurant} />;
        })}
        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No sessions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

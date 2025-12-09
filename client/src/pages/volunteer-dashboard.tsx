import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/session-card";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { HandHeart, MapPin } from "lucide-react";

export default function VolunteerDashboard() {
  const { sessions, restaurants, currentUser } = useStore();
  const [_, setLocation] = useLocation();

  if (currentUser?.role !== "VOLUNTEER") {
    setLocation("/auth");
    return null;
  }

  // Filter for VOLUNTEER_ONLY or MIXED sessions
  const volunteerSessions = sessions.filter(
    s => s.status === "OPEN" && 
    (s.type === "VOLUNTEER_ONLY" || s.type === "MIXED")
  );

  return (
    <div className="space-y-8">
       <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
           <div className="flex items-center gap-2 mb-2">
             <Badge className="bg-blue-500 hover:bg-blue-600">Verified Volunteer</Badge>
           </div>
           <h1 className="font-heading text-3xl font-bold text-blue-950">Volunteer Hub</h1>
           <p className="text-blue-700/80 max-w-xl mt-2">
             Thank you for helping us distribute food to those who need it most. 
             Book large quantities here for distribution.
           </p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 min-w-[200px]">
           <div className="text-sm text-muted-foreground mb-1">Impact Score</div>
           <div className="text-3xl font-heading font-bold text-blue-600">Level 3</div>
           <div className="text-xs text-blue-400 mt-1">Next level: 5 more distributions</div>
         </div>
       </div>

       <div>
         <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
           <MapPin className="h-5 w-5" />
           Available for Bulk Pickup
         </h2>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteerSessions.map(session => {
              const restaurant = restaurants.find(r => r.id === session.restaurantId);
              if (!restaurant) return null;
              return <SessionCard key={session.id} session={session} restaurant={restaurant} />;
            })}
            {volunteerSessions.length === 0 && (
              <p className="text-muted-foreground">No volunteer opportunities available right now.</p>
            )}
         </div>
       </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${className}`}>
      {children}
    </span>
  )
}

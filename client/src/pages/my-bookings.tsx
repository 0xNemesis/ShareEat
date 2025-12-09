import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, QrCode } from "lucide-react";
import { useLocation } from "wouter";

export default function MyBookings() {
  const { currentUser, bookings, sessions, restaurants } = useStore();
  const [_, setLocation] = useLocation();

  if (!currentUser) {
    setLocation("/auth");
    return null;
  }

  const myBookings = bookings
    .filter((b) => b.userId === currentUser.id)
    .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());

  const activeBookings = myBookings.filter((b) => ["PENDING", "APPROVED"].includes(b.status));
  const pastBookings = myBookings.filter((b) => !["PENDING", "APPROVED"].includes(b.status));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming pickups and view history.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeBookings.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
              <p className="text-muted-foreground mb-4">No upcoming bookings.</p>
              <Button onClick={() => setLocation("/explore")}>Explore Food Nearby</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {pastBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No booking history yet.</div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const { sessions, restaurants } = useStore();
  const session = sessions.find((s) => s.id === booking.sessionId);
  const restaurant = restaurants.find((r) => r.id === session?.restaurantId);

  if (!session || !restaurant) return null;

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary">
      <div className="h-32 overflow-hidden relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold font-mono">
                {booking.code}
             </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{restaurant.name}</CardTitle>
          <Badge variant={booking.status === "APPROVED" ? "default" : "secondary"}>
            {booking.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {restaurant.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 text-sm space-y-2">
        <div className="flex items-center justify-between py-2 border-b">
           <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/> Date</span>
           <span className="font-medium">{format(new Date(session.date), "EEE, MMM d")}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
           <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/> Pickup</span>
           <span className="font-medium">{session.startTime} - {session.endTime}</span>
        </div>
        <div className="pt-2">
           <p className="text-muted-foreground">Booking for <span className="text-foreground font-semibold">{booking.quantity} portion(s)</span></p>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 p-4 flex justify-center">
         <Button variant="outline" className="w-full gap-2">
            <QrCode className="h-4 w-4" /> Show QR Code
         </Button>
      </CardFooter>
    </Card>
  );
}

function BookingRow({ booking }: { booking: any }) {
  const { sessions, restaurants } = useStore();
  const session = sessions.find((s) => s.id === booking.sessionId);
  const restaurant = restaurants.find((r) => r.id === session?.restaurantId);

  if (!session || !restaurant) return null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white opacity-80 hover:opacity-100 transition-opacity">
       <div className="flex items-center gap-4">
         <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
         </div>
         <div>
            <h4 className="font-semibold">{restaurant.name}</h4>
            <p className="text-sm text-muted-foreground">{format(new Date(session.date), "MMM d, yyyy")} • {booking.quantity} portion(s)</p>
         </div>
       </div>
       <div className="text-right">
          <Badge variant="outline">{booking.status}</Badge>
       </div>
    </div>
  )
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, QrCode, Upload, Video, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VolunteerBookings() {
  const { currentUser, bookings, sessions, restaurants } = useStore();
  const [_, setLocation] = useLocation();

  if (!currentUser || currentUser.role !== "VOLUNTEER") {
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
        <h1 className="font-heading text-3xl font-bold">My Volunteer Bookings</h1>
        <p className="text-muted-foreground">Manage your bulk pickups and upload documentation.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Upcoming Pickups</TabsTrigger>
          <TabsTrigger value="history">Distribution History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeBookings.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
              <p className="text-muted-foreground mb-4">No upcoming volunteer tasks.</p>
              <Button onClick={() => setLocation("/volunteer-dashboard")}>Find Bulk Food</Button>
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
            <div className="text-center py-12 text-muted-foreground">No history yet.</div>
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
  const { sessions, restaurants, updateBookingStatus } = useStore();
  const [showQR, setShowQR] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const session = sessions.find((s) => s.id === booking.sessionId);
  const restaurant = restaurants.find((r) => r.id === session?.restaurantId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!session || !restaurant) return null;

  const handleCancel = () => {
    updateBookingStatus(booking.id, "CANCELLED");
    toast({
        title: "Booking Cancelled",
        description: "Your volunteer pickup has been cancelled.",
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Uploading Documentation...",
        description: `Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      });
      
      // Simulate upload delay
      setTimeout(() => {
        toast({
          title: "Upload Successful!",
          description: "Your documentation video has been submitted for review.",
        });
        setShowUpload(false);
      }, 2000);
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-blue-500">
      <div className="h-32 overflow-hidden relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
            <Badge className="bg-blue-500 hover:bg-blue-600">Volunteer Task</Badge>
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
           <p className="text-muted-foreground">Pickup Quantity: <span className="text-foreground font-semibold">{booking.quantity} portions</span></p>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 p-4 flex flex-col gap-2">
         <div className="grid grid-cols-2 gap-2 w-full">
            <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                        <QrCode className="h-4 w-4" /> QR Code
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md flex flex-col items-center justify-center text-center p-10">
                    <DialogHeader>
                    <DialogTitle>Volunteer Pickup Code</DialogTitle>
                    <DialogDescription>Show this to claim the bulk order.</DialogDescription>
                    </DialogHeader>
                    <div className="bg-white p-4 rounded-xl border-4 border-blue-100 my-4 shadow-inner">
                        <div className="h-48 w-48 bg-blue-900 flex items-center justify-center text-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ShareEatVolunteer')] bg-contain bg-no-repeat bg-center mix-blend-screen opacity-90"></div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-mono font-bold tracking-widest text-blue-600">{booking.code}</h2>
                </DialogContent>
            </Dialog>
            
            <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300" 
                onClick={handleCancel}
            >
                Cancel
            </Button>
         </div>

         <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Video className="h-4 w-4" /> Upload Documentation
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Distribution Video</DialogTitle>
                    <DialogDescription>
                        Please upload a short video showing the food distribution to verify your impact.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-1">Click to upload video</h3>
                        <p className="text-sm text-muted-foreground">MP4, MOV up to 50MB</p>
                        <Input 
                            ref={fileInputRef} 
                            id="video-upload" 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            onChange={handleUpload}
                        />
                    </div>
                </div>
            </DialogContent>
         </Dialog>
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
       <div className="text-right flex items-center gap-2">
          {booking.status === "COMPLETED" && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
          )}
          <Badge variant="outline">{booking.status}</Badge>
       </div>
    </div>
  )
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { DropoffSession } from "@/lib/mock-data";
import { Plus, Users, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function OwnerDashboard() {
  const { currentUser, sessions, bookings, createSession, updateBookingStatus, users } = useStore();
  const [_, setLocation] = useLocation();

  if (currentUser?.role !== "OWNER") {
    setLocation("/auth");
    return null;
  }

  // Filter sessions for this owner (Mock: owner "o1" owns "r1")
  // In a real app, we'd filter by restaurant ownerId.
  // For this mock, let's assume the current user owns "r1" (Daily Bread Bakery) if they are "o1"
  const mySessions = sessions.filter(s => s.restaurantId === "r1"); 
  
  // Get bookings for my sessions
  const myBookings = bookings.filter(b => mySessions.some(s => s.id === b.sessionId));
  const pendingBookings = myBookings.filter(b => b.status === "PENDING");
  const activeBookings = myBookings.filter(b => ["APPROVED", "COMPLETED"].includes(b.status));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Business Dashboard</h1>
          <p className="text-muted-foreground">Manage your drop-off sessions and bookings.</p>
        </div>
        <CreateSessionDialog />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Sessions" value={mySessions.length.toString()} icon={<Calendar className="h-5 w-5 text-primary" />} />
        <StatCard title="Active Bookings" value={activeBookings.length.toString()} icon={<Users className="h-5 w-5 text-secondary" />} />
        <StatCard title="Meals Rescued" value="142" icon={<CheckCircle className="h-5 w-5 text-green-600" />} />
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">Pending Requests</h3>
            {pendingBookings.length === 0 ? (
              <p className="text-muted-foreground italic">No pending bookings.</p>
            ) : (
              <div className="grid gap-4">
                {pendingBookings.map(booking => {
                  const user = users.find(u => u.id === booking.userId);
                  const session = sessions.find(s => s.id === booking.sessionId);
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={user?.avatar} alt={user?.name} className="h-10 w-10 rounded-full" />
                          <div>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Requested {booking.quantity} portion(s) • {session?.startTime}
                            </p>
                            {user?.role === "VOLUNTEER" && (
                               <Badge variant="secondary" className="mt-1 text-xs">Volunteer</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => updateBookingStatus(booking.id, "REJECTED")}>
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => updateBookingStatus(booking.id, "APPROVED")}>
                            Approve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
             <h3 className="font-heading text-xl font-semibold">Approved / History</h3>
             {activeBookings.map(booking => (
               <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${booking.status === "APPROVED" ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="font-medium">{users.find(u => u.id === booking.userId)?.name}</span>
                    <span className="text-muted-foreground text-sm">({booking.quantity} portions)</span>
                  </div>
                  <Badge variant={booking.status === "APPROVED" ? "default" : "outline"}>{booking.status}</Badge>
               </div>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {mySessions.map(session => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle>{session.date}</CardTitle>
                  <CardDescription>{session.startTime} - {session.endTime}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{session.description}</p>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{session.remainingPortions} / {session.totalPortions} left</span>
                    <Badge variant={session.status === "OPEN" ? "default" : "secondary"}>{session.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CreateSessionDialog() {
  const { createSession } = useStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "21:00",
    endTime: "22:00",
    totalPortions: 10,
    description: "",
    type: "REGULAR" as DropoffSession["type"]
  });

  const handleSubmit = () => {
    createSession({
      ...formData,
      restaurantId: "r1", // Mock
      allergens: [],
      status: "OPEN"
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> New Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Drop-off Session</DialogTitle>
          <DialogDescription>
            Schedule a time for users to pick up surplus food.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Portions</Label>
              <Input type="number" value={formData.totalPortions} onChange={e => setFormData({...formData, totalPortions: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Session Type</Label>
            <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR">Regular (Users Only)</SelectItem>
                <SelectItem value="VOLUNTEER_ONLY">Volunteer Only</SelectItem>
                <SelectItem value="MIXED">Mixed (Users & Volunteers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
             <Label>Description</Label>
             <Textarea placeholder="e.g. Assorted bread and pastries" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
           <p className="text-sm font-medium text-muted-foreground">{title}</p>
           <h4 className="text-2xl font-bold font-heading">{value}</h4>
        </div>
        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

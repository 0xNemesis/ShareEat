import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Info, Package, Users } from "lucide-react";
import { DropoffSession, Restaurant } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SessionCardProps {
  session: DropoffSession;
  restaurant: Restaurant;
}

export function SessionCard({ session, restaurant }: SessionCardProps) {
  const { createBooking, currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const handleBooking = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to book a slot.",
        variant: "destructive",
      });
      return;
    }

    const result = createBooking(session.id, quantity);
    
    if (result.success) {
      toast({
        title: "Booking Successful!",
        description: `You have reserved ${quantity} portion(s) at ${restaurant.name}.`,
      });
      setIsOpen(false);
      setDisclaimerAccepted(false); // Reset state
    } else {
      toast({
        title: "Booking Failed",
        description: result.message || "Could not complete booking.",
        variant: "destructive",
      });
    }
  };

  const isVolunteerOnly = session.type === "VOLUNTEER_ONLY";
  const isUser = currentUser?.role === "USER";
  const isVolunteer = currentUser?.role === "VOLUNTEER";

  const canBook = 
    (isVolunteerOnly && isVolunteer) || 
    (!isVolunteerOnly && (isUser || isVolunteer));

  return (
    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-lg">{restaurant.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
          </div>
          <Badge variant={session.remainingPortions > 0 ? "default" : "secondary"} className={session.remainingPortions > 0 ? "bg-primary hover:bg-primary/90" : ""}>
            {session.remainingPortions} left
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
        <div className="flex flex-wrap gap-2">
          {session.allergens.map((allergen) => (
            <Badge key={allergen} variant="outline" className="text-xs py-0 h-5">
              Contains {allergen}
            </Badge>
          ))}
          {isVolunteerOnly && (
            <Badge variant="secondary" className="text-xs py-0 h-5 bg-orange-100 text-orange-700 hover:bg-orange-100">
              Volunteer Only
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={(open) => {
             setIsOpen(open);
             if (!open) setDisclaimerAccepted(false);
        }}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={session.remainingPortions === 0 || !canBook}>
              {session.remainingPortions === 0 ? "Sold Out" : "Book Slot"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                You are about to book a rescue meal from <strong>{restaurant.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <img src={restaurant.image} alt="Resto" className="h-16 w-16 rounded-md object-cover" />
                <div>
                  <p className="font-medium text-sm">Pickup Time</p>
                  <p className="text-muted-foreground text-sm">{session.startTime} - {session.endTime}</p>
                  <p className="font-medium text-sm mt-1">Location</p>
                  <p className="text-muted-foreground text-sm">{restaurant.address}</p>
                </div>
              </div>
              
              {isVolunteer && (
                <div className="grid gap-2">
                  <Label htmlFor="qty">Quantity (Volunteer)</Label>
                  <Input 
                    id="qty" 
                    type="number" 
                    min={1} 
                    max={session.remainingPortions} 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))} 
                  />
                </div>
              )}

              <div className="flex items-start space-x-3 mt-2 p-4 bg-amber-50 rounded-md border border-amber-100">
                <Checkbox 
                    id="disclaimer" 
                    checked={disclaimerAccepted} 
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                    className="mt-1"
                />
                <Label htmlFor="disclaimer" className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-amber-900 font-medium">
                    Saya memahami bahwa makanan ini adalah donasi dan tidak ada jaminan kualitas. Saya bertanggung jawab atas pengecekan kondisi makanan saat menerima.
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleBooking} disabled={!disclaimerAccepted}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

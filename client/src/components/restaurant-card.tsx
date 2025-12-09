import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Utensils } from "lucide-react";
import { Restaurant } from "@/lib/mock-data";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-soft transition-all duration-300 border-border/50 cursor-pointer" onClick={onClick}>
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {restaurant.rating}
        </div>
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {restaurant.distance} km
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{restaurant.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <Utensils className="h-3 w-3" /> {restaurant.category}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{restaurant.address}</p>
      </CardContent>
    </Card>
  );
}

import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Menu, UserCircle, LogOut, LayoutDashboard, Search, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, login } = useStore();
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  const NavItems = () => (
    <>
      <Link href="/">
        <Button variant="ghost" className="justify-start">Home</Button>
      </Link>
      
      {currentUser?.role === "USER" && (
        <>
          <Link href="/explore">
            <Button variant="ghost" className="justify-start"><Search className="mr-2 h-4 w-4" /> Explore Food</Button>
          </Link>
          <Link href="/my-bookings">
            <Button variant="ghost" className="justify-start"><Leaf className="mr-2 h-4 w-4" /> My Bookings</Button>
          </Link>
        </>
      )}

      {currentUser?.role === "OWNER" && (
        <Link href="/owner-dashboard">
          <Button variant="ghost" className="justify-start"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Button>
        </Link>
      )}

      {currentUser?.role === "VOLUNTEER" && (
        <>
          <Link href="/volunteer-dashboard">
            <Button variant="ghost" className="justify-start"><MapPin className="mr-2 h-4 w-4" /> Volunteer Hub</Button>
          </Link>
          <Link href="/volunteer-bookings">
            <Button variant="ghost" className="justify-start"><Leaf className="mr-2 h-4 w-4" /> My Bookings</Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Leaf size={18} fill="currentColor" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-primary-foreground">ShareEat</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavItems />
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mt-1 w-fit">
                        {currentUser.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/auth">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavItems />
                  {!currentUser && (
                     <Button className="w-full mt-4" onClick={() => setLocation("/auth")}>Login / Sign Up</Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 ShareEat. Rescue Food, Share Joy.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

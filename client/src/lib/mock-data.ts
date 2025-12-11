import { addDays, setHours, setMinutes, format } from "date-fns";
import communityImage from "@assets/images/community_sharing_food_happily.png";
import bakeryImage from "@assets/images/cozy_modern_bakery_interior.png";
import saladImage from "@assets/images/fresh_salad_bar_buffet.png";
import italianImage from "@assets/images/italian_restaurant_pizza_pasta.png";

export type Role = "USER" | "OWNER" | "VOLUNTEER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string;
  category: string;
  rating: number;
  distance: number; // Mock distance in km
  ownerId: string;
}

export interface DropoffSession {
  id: string;
  restaurantId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPortions: number;
  remainingPortions: number;
  description: string;
  allergens: string[];
  status: "OPEN" | "CLOSED";
  type: "REGULAR" | "VOLUNTEER_ONLY" | "MIXED";
}

export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  quantity: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "NO_SHOW" | "CANCELLED";
  bookingTime: string;
  code: string;
}

// Mock Data

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Fadhil Membutuhkan",
    email: "fadhilpoor@mail.com",
    role: "USER",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Adrian",
  },
  {
    id: "o1",
    name: "Rangga Owner",
    email: "ranggaowner@kostpga.com",
    role: "OWNER",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jade",
  },
  {
    id: "v1",
    name: "Filbert Volunteer",
    email: "filbertrelawan@relawan.org",
    role: "VOLUNTEER",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aidan",
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "Kantin Anugerah",
    address: "123 Main St, Downtown",
    image: bakeryImage,
    category: "Bakery",
    rating: 4.8,
    distance: 1.2,
    ownerId: "o1",
  },
  {
    id: "r2",
    name: "Kantin Boga Rasa",
    address: "45 Park Ave, Green Hill",
    image: saladImage,
    category: "Healthy / Salad",
    rating: 4.5,
    distance: 3.5,
    ownerId: "o2",
  },
  {
    id: "r3",
    name: "Warung Nasi Padang",
    address: "88 Italy Lane, Little Italy",
    image: italianImage,
    category: "Italian",
    rating: 4.9,
    distance: 4.8,
    ownerId: "o3",
  },
  {
    id: "r4",
    name: "Warteg Mulya",
    address: "12 Pine St, Westside",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
    category: "Comfort Food",
    rating: 4.7,
    distance: 2.1,
    ownerId: "o4",
  }
];

const today = new Date();
const tomorrow = addDays(today, 1);

export const MOCK_SESSIONS: DropoffSession[] = [
  {
    id: "s1",
    restaurantId: "r1",
    date: format(today, "yyyy-MM-dd"),
    startTime: "20:00",
    endTime: "21:00",
    totalPortions: 20,
    remainingPortions: 15,
    description: "Jual makanan enak dan bergiji lengkap dengan esteh manis",
    allergens: ["Gluten", "Dairy"],
    status: "OPEN",
    type: "MIXED",
  },
  {
    id: "s2",
    restaurantId: "r2",
    date: format(today, "yyyy-MM-dd"),
    startTime: "19:30",
    endTime: "20:30",
    totalPortions: 10,
    remainingPortions: 2,
    description: "Ayam bakar madu fresh dari laut",
    allergens: [],
    status: "OPEN",
    type: "REGULAR",
  },
  {
    id: "s3",
    restaurantId: "r3",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "22:00",
    endTime: "23:00",
    totalPortions: 50,
    remainingPortions: 50,
    description: "Pasta dishes and pizza slices (Volunteer pickup preferred).",
    allergens: ["Gluten", "Dairy", "Garlic"],
    status: "OPEN",
    type: "VOLUNTEER_ONLY",
  },
  {
    id: "s4",
    restaurantId: "r3",
    date: format(today, "yyyy-MM-dd"),
    startTime: "21:00",
    endTime: "22:00",
    totalPortions: 15,
    remainingPortions: 10,
    description: "Caviar sisa tadi siang masih layak makan",
    allergens: ["Gluten", "Dairy"],
    status: "OPEN",
    type: "REGULAR",
  },
  {
    id: "s5",
    restaurantId: "r4",
    date: format(today, "yyyy-MM-dd"),
    startTime: "18:00",
    endTime: "19:00",
    totalPortions: 8,
    remainingPortions: 8,
    description: "Wagyu A5 bagian kikil fresh sisa tadi sore",
    allergens: ["Gluten"],
    status: "OPEN",
    type: "REGULAR",
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    sessionId: "s1",
    userId: "u1",
    quantity: 1,
    status: "APPROVED",
    bookingTime: new Date().toISOString(),
    code: "SE-8821",
  },
];

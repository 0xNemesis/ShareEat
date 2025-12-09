import { create } from "zustand";
import {
  Booking,
  DropoffSession,
  MOCK_BOOKINGS,
  MOCK_RESTAURANTS,
  MOCK_SESSIONS,
  MOCK_USERS,
  Restaurant,
  Role,
  User,
} from "./mock-data";
import { format } from "date-fns";

interface AppState {
  currentUser: User | null;
  users: User[];
  restaurants: Restaurant[];
  sessions: DropoffSession[];
  bookings: Booking[];

  // Actions
  login: (role: Role) => void;
  logout: () => void;
  createSession: (session: Omit<DropoffSession, "id" | "remainingPortions">) => void;
  createBooking: (sessionId: string, quantity: number) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: MOCK_USERS,
  restaurants: MOCK_RESTAURANTS,
  sessions: MOCK_SESSIONS,
  bookings: MOCK_BOOKINGS,

  login: (role) => {
    // Find first user with that role or mock one
    const user = get().users.find((u) => u.role === role) || MOCK_USERS[0];
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  createSession: (sessionData) => {
    const newSession: DropoffSession = {
      ...sessionData,
      id: Math.random().toString(36).substr(2, 9),
      remainingPortions: sessionData.totalPortions,
    };
    set((state) => ({ sessions: [...state.sessions, newSession] }));
  },

  createBooking: (sessionId, quantity) => {
    const state = get();
    if (!state.currentUser) return;

    // Check quota (Mock: Max 2 bookings today)
    const today = format(new Date(), "yyyy-MM-dd");
    const myBookingsToday = state.bookings.filter(
      (b) =>
        b.userId === state.currentUser?.id &&
        b.bookingTime.startsWith(today) &&
        b.status !== "REJECTED" &&
        b.status !== "CANCELLED"
    );

    if (state.currentUser.role === "USER" && myBookingsToday.length >= 2) {
      alert("You have reached your daily limit of 2 bookings.");
      return;
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      sessionId,
      userId: state.currentUser.id,
      quantity,
      status: "PENDING",
      bookingTime: new Date().toISOString(),
      code: `SE-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // Update session remaining portions
    const updatedSessions = state.sessions.map((s) => {
      if (s.id === sessionId) {
        return { ...s, remainingPortions: s.remainingPortions - quantity };
      }
      return s;
    });

    set((state) => ({
      bookings: [...state.bookings, newBooking],
      sessions: updatedSessions,
    }));
  },

  updateBookingStatus: (bookingId, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      ),
    }));
  },
}));

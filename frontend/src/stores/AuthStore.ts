import { create } from "zustand";
import { User } from "firebase/auth";

interface AuthState {
    user: User | null;
    updateUser: (newUser: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    updateUser: (newUser) => set(() => ({ user: newUser })),
}));

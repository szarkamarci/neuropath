import { create } from 'zustand';
import { UserRole } from '@/types';

interface UserState {
    role: UserRole;
    setRole: (role: UserRole) => void;
    toggleRole: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    role: 'doctor', // Default role
    setRole: (role) => set({ role }),
    toggleRole: () => set((state) => {
        if (state.role === 'doctor') return { role: 'pharma' };
        if (state.role === 'pharma') return { role: 'patient' };
        return { role: 'doctor' };
    }),
}));

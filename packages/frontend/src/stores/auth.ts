import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  userId: string | null;
  userName: string | null;
  timeoutAt: number;
  active: boolean;
  queuePosition: number | null;
  numberOfCircuits: number;
  signIn: (
    token: string,
    userId: string,
    userName: string,
    timeoutAt: number,
    active: boolean,
    queuePosition: number,
    numberOfCircuits: number,
  ) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      userName: null,
      timeoutAt: 0,
      active: false,
      queuePosition: null,
      numberOfCircuits: 0,
      signIn: (
        token: string,
        userId: string,
        userName: string,
        timeoutAt: number,
        active: boolean,
        queuePosition: number,
        numberOfCircuits: number,
      ) => set({
        token: token,
        userId: userId,
        userName: userName,
        timeoutAt: timeoutAt,
        active: active,
        queuePosition: queuePosition,
        numberOfCircuits: numberOfCircuits,
      }),
      signOut: () => set({
        token: null,
        userId: null ,
        userName: null,
        timeoutAt: 0,
        active: false,
        queuePosition: null,
        numberOfCircuits: 0,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

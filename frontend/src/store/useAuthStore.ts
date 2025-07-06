import create from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  dob?: string;
  chronic_conditions?: string;
  goals?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  persistToken: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
    window.location.href = '/login';
  },
  persistToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
  restoreSession: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: fetch user profile with token and set user
      set({ token, isAuthenticated: true });
    }
  },
}));

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

interface User {
  id: string;
  email: string;
  name: string;
  accessibility?: {
    colorBlindMode?: string;
    fontSize?: string;
    highContrast?: boolean;
    reducedMotion?: boolean;
    dyslexiaFont?: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

interface LoginHistoryEntry {
  timestamp: string;
  success: boolean;
  device: string;
  browser: string;
}

interface StoredUser extends User {
  passwordHash: string;
  loginHistory: LoginHistoryEntry[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Encryption key (in production, this should be more secure)
const ENCRYPTION_KEY = 'orange-sulphur-secret-key-2024';

// Helper functions
const encryptPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

const getBrowserInfo = (): { device: string; browser: string } => {
  const ua = navigator.userAgent;
  let device = 'Desktop';
  let browser = 'Unknown';

  if (/Mobile|Android|iPhone/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  return { device, browser };
};

const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const loadAllUsers = (): StoredUser[] => {
  try {
    const usersStr = localStorage.getItem('users_db');
    return usersStr ? JSON.parse(usersStr) : [];
  } catch {
    return [];
  }
};

const saveAllUsers = (users: StoredUser[]) => {
  localStorage.setItem('users_db', JSON.stringify(users));
};

const addLoginHistory = (email: string, success: boolean) => {
  const users = loadAllUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex !== -1) {
    const { device, browser } = getBrowserInfo();
    const entry: LoginHistoryEntry = {
      timestamp: new Date().toISOString(),
      success,
      device,
      browser
    };
    
    users[userIndex].loginHistory = [
      entry,
      ...users[userIndex].loginHistory
    ].slice(0, 20); // Keep last 20 entries
    
    saveAllUsers(users);
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupUser: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {
      const { name, email, password } = action.payload;
      
      // Check if user exists
      const users = loadAllUsers();
      if (users.some(u => u.email === email)) {
        state.error = 'Email already registered';
        return;
      }

      // Create new user
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name,
        email,
        passwordHash: encryptPassword(password),
        accessibility: {
          colorBlindMode: 'none',
          fontSize: 'normal',
          highContrast: false,
          reducedMotion: false,
          dyslexiaFont: false
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginHistory: []
      };

      // Save user
      users.push(newUser);
      saveAllUsers(users);

      // Log signup
      addLoginHistory(email, true);

      // Set current user (without password)
      const { passwordHash, loginHistory, ...safeUser } = newUser;
      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(safeUser));
    },

    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      
      // Find user
      const users = loadAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        state.error = 'Invalid email or password';
        addLoginHistory(email, false);
        return;
      }

      // Check password
      const passwordHash = encryptPassword(password);
      if (user.passwordHash !== passwordHash) {
        state.error = 'Invalid email or password';
        addLoginHistory(email, false);
        return;
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      saveAllUsers(users);

      // Log successful login
      addLoginHistory(email, true);

      // Set current user (without password)
      const { passwordHash: _, loginHistory, ...safeUser } = user;
      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(safeUser));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));

        // Update in users_db too
        const users = loadAllUsers();
        const userIndex = users.findIndex(u => u.id === state.user?.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...action.payload };
          saveAllUsers(users);
        }
      }
    },

    updateAccessibility: (state, action: PayloadAction<User['accessibility']>) => {
      if (state.user && action.payload) {
        state.user.accessibility = { ...state.user.accessibility, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));

        // Update in users_db
        const users = loadAllUsers();
        const userIndex = users.findIndex(u => u.id === state.user?.id);
        if (userIndex !== -1) {
          users[userIndex].accessibility = state.user.accessibility;
          saveAllUsers(users);
        }
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    // Legacy login for backward compatibility
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { 
  signupUser, 
  loginUser, 
  logout, 
  updateUser, 
  updateAccessibility,
  clearError,
  login 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectLoginHistory = (email: string): LoginHistoryEntry[] => {
  const users = loadAllUsers();
  const user = users.find(u => u.email === email);
  return user?.loginHistory || [];
};
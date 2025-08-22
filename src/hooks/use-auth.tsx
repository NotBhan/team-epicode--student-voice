
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile, UserRole } from '@/lib/types';
import { getAllUsers, updateUserPriorityPoints as updateUserPriorityPointsAction } from '@/services/user-service';

export type MockUser = Pick<UserProfile, 'uid' | 'email' | 'userId'>;

interface AuthContextType {
  user: MockUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logOut: () => void;
  logIn: (identifier: string, password: string) => Promise<UserProfile | null>;
  signUp: (identifier: string, password: string, role: UserRole) => Promise<UserProfile | null>;
  updatePriorityPoints: (newPoints: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const userData: UserProfile = JSON.parse(storedUser);
            setUser({ uid: userData.uid, email: userData.email, userId: userData.userId });
            setUserProfile(userData);
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        }
    }
    setLoading(false);
  }, []);

  const updatePriorityPoints = async (newPoints: number) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, priorityPoints: newPoints };
      setUserProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      await updateUserPriorityPointsAction(userProfile.uid, newPoints);
    }
  };
  
  const logIn = useCallback(async (identifier: string, password: string): Promise<UserProfile | null> => {
    const userStore = await getAllUsers();
    const foundUser = userStore.find(u => 
        (u.email === identifier || u.userId === identifier) && u.password === password
    );

    if (foundUser) {
        const profile: UserProfile = { ...foundUser };
        delete profile.password;

        setUser({ uid: profile.uid, email: profile.email, userId: profile.userId });
        setUserProfile(profile);
        localStorage.setItem('user', JSON.stringify(profile));
        return profile;
    }
    return null;
  }, []);

  const signUp = useCallback(async (identifier: string, password: string, role: UserRole): Promise<UserProfile | null> => {
    // This function would need to be adapted to write to the users.json file
    // For now, it will only work for the session.
    console.warn("Sign up is not configured to persist data in this prototype.");
    const userStore = await getAllUsers();
    if (role === 'student') {
        if (userStore.some(u => u.userId === identifier)) {
            throw new Error('This User ID is already taken.');
        }
    } else {
        if (userStore.some(u => u.email === identifier)) {
            throw new Error('An account with this email already exists.');
        }
    }
    
    const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email: role === 'admin' ? identifier : null,
        userId: role === 'student' ? identifier : undefined,
        password,
        role,
        priorityPoints: role === 'student' ? 1000 : undefined,
        createdAt: new Date(),
    };
    
    // In a real scenario, you'd call a service to add the user.
    // For this prototype, we'll just log them in without persisting the new account.
    const profile: UserProfile = { ...newUser };
    delete profile.password;

    setUser({ uid: profile.uid, email: profile.email, userId: profile.userId });
    setUserProfile(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    
    return profile;
  }, []);
  
  const logOut = useCallback(() => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('user');
    router.push('/');
  }, [router]);

  const value = { user, userProfile, loading, logOut, logIn, signUp, updatePriorityPoints };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

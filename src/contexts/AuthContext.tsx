import { METHODS } from 'http';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const savedToken = localStorage.getItem('session_token');
      const savedUser = localStorage.getItem('user_data');
      
      if (savedToken && savedUser) {
        try {
          const response = await fetch(`http://localhost/users/getsession?token=${savedToken}`,{
            headers: {
              'accept':'application/json',
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json();
          console.log(savedToken)
          if (data.status === 'successful') {
            setUser(JSON.parse(savedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_data');
          }
        } catch (error) {
          // Handle network error
          localStorage.removeItem('session_token');
          localStorage.removeItem('user_data');
        }
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("test");
      const response = await fetch('http://localhost/users/login', {
        method: 'POST',
        headers: {
          'accept':'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pass: password
        })
      });
     
      console.log(response);
      
      const data = await response.json();

      if (data.status === 'successful' && data.token) {
        const userData = {
          email,
          name: data.name, // No name in response, so fallback
          token: data.token
        };

        setUser(userData);
        localStorage.setItem('session_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost/users/create', {
        method: 'POST',
        headers: {
          'accept':'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          pass: password
        })
      });

      const data = await response.json();
      console.log("here")
      if (data.status === 'successful' && data.user) {
        // After successful registration, log the user in

        const loginSuccess = await login(email, password);
        return loginSuccess;
      } else {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (user && user.token) {
      try {
        const savedToken = localStorage.getItem('session_token');
        const response = await fetch(`http://localhost/users/logout?token=${encodeURIComponent(savedToken)}`,
      {
        headers: {
        'Accept': 'application/json'
        }
      }
      );
        
      } catch (error) {
        // Handle network error silently
      }
    }

    setUser(null);
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
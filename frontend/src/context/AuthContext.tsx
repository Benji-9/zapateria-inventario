import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface User {
    username: string;
    role: 'ADMIN' | 'OPERADOR';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const { showToast } = useToast();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedRole && storedUsername) {
            setUser({ username: storedUsername, role: storedRole as 'ADMIN' | 'OPERADOR' });
            setToken(storedToken);
        }
    }, []);

    const login = (newToken: string, role: string, username: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        setToken(newToken);
        setUser({ username, role: role as 'ADMIN' | 'OPERADOR' });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
        showToast('Sesión cerrada', 'info');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
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

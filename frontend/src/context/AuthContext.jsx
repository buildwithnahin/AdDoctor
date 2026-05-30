import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
    };

    const register = async (name, email, password) => {
        const response = await api.post('/register', { name, email, password });
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch(e) {
            console.error(e);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

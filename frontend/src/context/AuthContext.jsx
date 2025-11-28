import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Kullanıcının token'ını LocalStorage'dan al
const getTokensFromStorage = () => ({
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken'),
});

export function AuthProvider({ children }) {
    const [tokens, setTokens] = useState(getTokensFromStorage);
    const [isLoggedIn, setIsLoggedIn] = useState(!!getTokensFromStorage().access);

    // 1. GİRİŞ YAPMA FONKSİYONU
    const login = (access, refresh) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setTokens({ access, refresh });
        setIsLoggedIn(true);
    };

    // 2. ÇIKIŞ YAPMA FONKSİYONU
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setTokens({});
        setIsLoggedIn(false);
        window.location.href = '/'; // Ana sayfaya yönlendir
    };

    // Tokens değiştiğinde state'i güncelle
    useEffect(() => {
        setIsLoggedIn(!!tokens.access);
    }, [tokens]);

    return (
        <AuthContext.Provider value={{ tokens, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
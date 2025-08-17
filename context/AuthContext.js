'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

// Tạo AuthContext
const AuthContext = createContext({});

// Hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Kiểm tra trạng thái đăng nhập
    const checkAuthStatus = async () => {
        try {
            setLoading(true);

            const isAuth = authService.isAuthenticated();
            const currentUser = authService.getCurrentUser();

            if (isAuth && currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);

                // Tùy chọn: Lấy thông tin user mới nhất từ server
                try {
                    const profileResponse = await authService.getProfile();
                    if (profileResponse.success) {
                        setUser(profileResponse.data.user);
                    }
                } catch (error) {
                    // Nếu không lấy được profile từ server, vẫn dùng thông tin từ cookie
                    console.warn('Không thể lấy profile từ server:', error.message);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Đăng ký
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập
    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    // Cập nhật profile
    const updateProfile = async (profileData) => {
        try {
            const response = await authService.updateProfile(profileData);

            if (response.success) {
                setUser(response.data.user);
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Đổi mật khẩu
    const changePassword = async (passwordData) => {
        try {
            const response = await authService.changePassword(passwordData);

            if (response.success) {
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await authService.getProfile();
            if (response.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Lỗi khi refresh user data:', error);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

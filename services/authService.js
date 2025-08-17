import axios from 'axios';
import Cookies from 'js-cookie';

// Cấu hình base URL cho API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                try {
                    // Gọi API refresh token (nếu có)
                    // Tạm thời logout user nếu token hết hạn
                    authService.logout();
                    window.location.href = '/auth/login';
                } catch (refreshError) {
                    authService.logout();
                    window.location.href = '/auth/login';
                }
            } else {
                authService.logout();
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

class AuthService {
    // Đăng ký
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);

            if (response.data.success) {
                const { token, refreshToken, user } = response.data.data;

                // Lưu tokens vào cookies
                Cookies.set('accessToken', token, { expires: 1 }); // 1 ngày
                Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 ngày
                Cookies.set('user', JSON.stringify(user), { expires: 7 });

                return response.data;
            }

            throw new Error(response.data.message || 'Đăng ký thất bại');
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Có lỗi xảy ra khi đăng ký'
            );
        }
    }

    // Đăng nhập
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            if (response.data.success) {
                const { token, refreshToken, user } = response.data.data;

                // Lưu tokens vào cookies
                Cookies.set('accessToken', token, { expires: 1 }); // 1 ngày
                Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 ngày
                Cookies.set('user', JSON.stringify(user), { expires: 7 });

                return response.data;
            }

            throw new Error(response.data.message || 'Đăng nhập thất bại');
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Có lỗi xảy ra khi đăng nhập'
            );
        }
    }

    // Đăng xuất
    logout() {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
    }

    // Lấy thông tin user hiện tại
    getCurrentUser() {
        const userCookie = Cookies.get('user');
        return userCookie ? JSON.parse(userCookie) : null;
    }

    // Kiểm tra xem user đã đăng nhập chưa
    isAuthenticated() {
        const token = Cookies.get('accessToken');
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    // Lấy token
    getToken() {
        return Cookies.get('accessToken');
    }

    // Lấy thông tin profile
    async getProfile() {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                'Có lỗi xảy ra khi lấy thông tin profile'
            );
        }
    }

    // Cập nhật profile
    async updateProfile(profileData) {
        try {
            const response = await apiClient.put('/auth/profile', profileData);

            if (response.data.success) {
                // Cập nhật thông tin user trong cookie
                const updatedUser = response.data.data.user;
                Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });

                return response.data;
            }

            throw new Error(response.data.message || 'Cập nhật profile thất bại');
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                'Có lỗi xảy ra khi cập nhật profile'
            );
        }
    }

    // Đổi mật khẩu
    async changePassword(passwordData) {
        try {
            const response = await apiClient.put('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                'Có lỗi xảy ra khi đổi mật khẩu'
            );
        }
    }
}

const authService = new AuthService();
export default authService;

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { login, register } = useAuth();

    // Reset form khi modal đóng/mở và quản lý body scroll
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: ''
            });
            setErrors({});
            setMessage('');
            setIsLogin(true);

            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';

            // Add ESC key listener
            const handleEscKey = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscKey);

            return () => {
                document.removeEventListener('keydown', handleEscKey);
            };
        } else {
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Đóng modal khi click outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Xóa lỗi khi user bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            if (!formData.name.trim()) {
                newErrors.name = 'Họ tên là bắt buộc';
            } else if (formData.name.trim().length < 2) {
                newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
            }

            if (!formData.phone.trim()) {
                newErrors.phone = 'Số điện thoại là bắt buộc';
            } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            let result;
            if (isLogin) {
                result = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                const { confirmPassword, ...registerData } = formData;
                result = await register(registerData);
            }

            if (result.success) {
                setMessage(result.message);
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setMessage(result.message || (isLogin ? 'Đăng nhập thất bại' : 'Đăng ký thất bại'));
            }
        } catch (error) {
            setMessage(error.message || 'Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setMessage('');
        setFormData({
            name: '',
            email: formData.email, // Giữ lại email
            password: '',
            confirmPassword: '',
            phone: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>

                <div className={styles.modalContent}>
                    {/* Left side - Image Section */}
                    <div className={styles.imageSection}>
                        <div className={styles.backgroundImage}></div>
                        <div className={styles.imageContent}>
                            <div className={styles.logoSection}>
                                <span className={styles.logoIcon}>🍎</span>
                                <h2 className={styles.logoTitle}>Trái Cây Xanh Tươi</h2>
                            </div>
                            <div className={styles.welcomeText}>
                                {isLogin ? 'Chào mừng bạn trở lại!' : 'Tham gia cùng chúng tôi!'}
                            </div>
                            <div className={styles.description}>
                                {isLogin
                                    ? 'Đăng nhập để tiếp tục mua sắm những sản phẩm trái cây tươi ngon, chất lượng cao nhất.'
                                    : 'Tạo tài khoản để khám phá thế giới trái cây tươi ngon và nhận những ưu đãi đặc biệt.'
                                }
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formHeader}>
                            <h3 className={styles.formTitle}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h3>
                            <p className={styles.formSubtitle}>
                                {isLogin ? 'Nhập thông tin để đăng nhập' : 'Điền thông tin để tạo tài khoản'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formContent}>
                                {!isLogin && (
                                    <div className={styles.inputRow}>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Họ và tên"
                                                className={errors.name ? styles.error : ''}
                                            />
                                            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Số điện thoại"
                                                className={errors.phone ? styles.error : ''}
                                            />
                                            {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.inputGroup}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className={errors.email ? styles.error : ''}
                                    />
                                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                </div>

                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Mật khẩu"
                                            className={errors.password ? styles.error : ''}
                                        />
                                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                    </div>

                                    {!isLogin && (
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Xác nhận mật khẩu"
                                                className={errors.confirmPassword ? styles.error : ''}
                                            />
                                            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                                        </div>
                                    )}
                                </div>

                                {message && (
                                    <div className={`${styles.message} ${message.includes('thành công') ? styles.success : styles.errorMsg}`}>
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ?
                                        (isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...') :
                                        (isLogin ? 'Đăng Nhập' : 'Đăng Ký')
                                    }
                                </button>
                            </div>

                            <div className={styles.formFooter}>
                                <div className={styles.switchMode}>
                                    <p>
                                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                                        <button
                                            type="button"
                                            onClick={switchMode}
                                            className={styles.switchButton}
                                        >
                                            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                                        </button>
                                    </p>
                                </div>

                                {isLogin && (
                                    <div className={styles.forgotPassword}>
                                        <button type="button" className={styles.forgotButton}>
                                            Quên mật khẩu?
                                        </button>
                                    </div>
                                )}

                                <div className={styles.socialLogin}>
                                    <div className={styles.divider}>
                                        <span>hoặc</span>
                                    </div>
                                    <div className={styles.socialButtons}>
                                        <button className={styles.socialButton}>
                                            <span className={styles.googleIcon}>G</span>
                                            Google
                                        </button>
                                        <button className={styles.socialButton}>
                                            <span className={styles.facebookIcon}>f</span>
                                            Facebook
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
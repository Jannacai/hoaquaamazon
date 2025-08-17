'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal/AuthModal';
import styles from './AuthButton.module.css';

export default function AuthButton() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <span>...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.userMenu}>
        <div className={styles.userInfo}>
          {!isMobile ? (
            <span className={styles.userName}>Xin chào, {user.name}</span>
          ) : (
            <span className={styles.userIcon}>👤</span>
          )}
          <div className={styles.dropdown}>
            <button
              onClick={() => router.push('/profile')}
              className={styles.dropdownItem}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => router.push('/orders')}
              className={styles.dropdownItem}
            >
              Đơn hàng của tôi
            </button>
            <button
              onClick={handleLogout}
              className={`${styles.dropdownItem} ${styles.logoutButton}`}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.authButtons}>
        <button onClick={openModal} className={styles.loginButton}>
          {isMobile ? '👤' : 'Đăng nhập'}
        </button>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

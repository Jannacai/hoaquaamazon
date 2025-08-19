'use client'

import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import Navigation from '@/components/Navigation/Navigation'
import AuthButton from '@/components/AuthButton/AuthButton'

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 50)
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', handleResize)

        // Set initial mobile state
        handleResize()

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.container}>
                    {/* Đã chỉnh sửa bởi AI Assistant - Đồng bộ test - ${new Date().toLocaleString('vi-VN')} */}
                    <div className={styles.logo}>
                        <h2>🍎Trái Cây Xanh Tươi - ĐỒNG BỘ THÀNH CÔNG!</h2>
                        <p className={styles.logoDescription}>Test đồng bộ từ remote workspace!</p>
                    </div>

                    {!isMobile && <Navigation />}

                    <div className={styles.actions}>
                        {!isMobile && (
                            <>
                                <button className={styles.searchBtn}>🔍</button>
                                <button className={styles.cartBtn}>
                                    🛒
                                    <span className={styles.cartCount}>0</span>
                                </button>
                            </>
                        )}
                        <AuthButton />
                    </div>
                </div>

                {/* Mobile Search and Cart Bar */}
                {isMobile && (
                    <div className={styles.mobileSearchBar}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className={styles.searchInput}
                            />
                            <button className={styles.searchButton}>🔍</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <nav className={styles.mobileBottomNav}>
                    <button className={styles.navItem}>
                        <span className={styles.navIcon}>🏠</span>
                        <span className={styles.navLabel}>Trang chủ</span>
                    </button>
                    <button className={styles.navItem}>
                        <span className={styles.navIcon}>🛒</span>
                        <span className={styles.navLabel}>Giỏ hàng</span>
                    </button>
                    <button className={styles.navItem}>
                        <span className={styles.navIcon}>💬</span>
                        <span className={styles.navLabel}>Tin nhắn</span>
                    </button>
                </nav>
            )}
        </>
    )
}

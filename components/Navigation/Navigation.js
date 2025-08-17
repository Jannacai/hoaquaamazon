'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Navigation.module.css'

export default function Navigation() {
    const [activeDropdown, setActiveDropdown] = useState(null)

    const navItems = [
        { href: '/', label: 'Trang chủ' },
        {
            href: '/orders',
            label: 'Đặt Tiệc',
            submenu: [
                { href: '/orders/custom-setup', label: 'Tự Setup theo nhu cầu khách hàng' },
                { href: '/orders/company-party', label: 'Tiệc Công Ty' },
                { href: '/orders/family-party', label: 'Tiệc Gia Đình' }
            ]
        },
        {
            href: '/products',
            label: 'Sản phẩm',
            submenu: [
                { href: '/products/fresh-flowers', label: 'Đặt Hoa Tươi' },
                { href: '/products/cakes', label: 'Đặt bánh ngọt' },
                { href: '/products/cut-fruits', label: 'Đặt trái cây cắt sẵn' }
            ]
        },
        { href: '/about', label: 'Giới thiệu' },
        { href: '/contact', label: 'Liên hệ' },
    ]

    const handleMouseEnter = (index) => {
        setActiveDropdown(index)
    }

    const handleMouseLeave = () => {
        setActiveDropdown(null)
    }

    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                {navItems.map((item, index) => (
                    <li
                        key={item.href}
                        className={`${styles.navItem} ${item.submenu ? styles.hasSubmenu : ''}`}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link href={item.href} className={styles.navLink}>
                            {item.label}
                            {item.submenu && <span className={styles.dropdownArrow}>▼</span>}
                        </Link>
                        {item.submenu && (
                            <ul className={`${styles.submenu} ${activeDropdown === index ? styles.submenuActive : ''}`}>
                                {item.submenu.map((subItem) => (
                                    <li key={subItem.href} className={styles.submenuItem}>
                                        <Link href={subItem.href} className={styles.submenuLink}>
                                            {subItem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

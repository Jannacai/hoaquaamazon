'use client'

import { useState } from 'react'
import styles from './TestModal.module.css'

export default function TestModal() {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return (
        <>
            <button onClick={openModal} className={styles.openButton}>
                Test Responsive Header
            </button>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Test Responsive Header</h2>
                        <p>Thay đổi kích thước màn hình để test:</p>
                        <ul>
                            <li>Desktop: Hiển thị navigation, search, cart trong header</li>
                            <li>Mobile: Ẩn navigation, hiển thị search bar dưới header</li>
                            <li>Mobile: Hiển thị bottom navigation với 3 nút</li>
                            <li>Mobile: Thay chữ "Đăng nhập" bằng icon 👤</li>
                        </ul>
                        <button onClick={closeModal} className={styles.closeButton}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

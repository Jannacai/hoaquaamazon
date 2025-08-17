import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Hoa Quả Amazon</h3>
                        <p className={styles.description}>
                            Cung cấp trái cây tươi ngon chất lượng cao,
                            giao hàng nhanh chóng tận nơi.
                        </p>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink}>📘</a>
                            <a href="#" className={styles.socialLink}>📷</a>
                            <a href="#" className={styles.socialLink}>🐦</a>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Liên kết nhanh</h4>
                        <ul className={styles.linkList}>
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/products">Sản phẩm</a></li>
                            <li><a href="/categories">Danh mục</a></li>
                            <li><a href="/about">Giới thiệu</a></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Hỗ trợ</h4>
                        <ul className={styles.linkList}>
                            <li><a href="/contact">Liên hệ</a></li>
                            <li><a href="/shipping">Vận chuyển</a></li>
                            <li><a href="/return">Đổi trả</a></li>
                            <li><a href="/faq">FAQ</a></li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Liên hệ</h4>
                        <div className={styles.contactInfo}>
                            <p>📞 0123 456 789</p>
                            <p>📧 info@traicayxanhtuoi.com</p>
                            <p>📍 123 Đường ABC, Quận XYZ, TP.HCM</p>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; 2025 Hoa Quả Amazon. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}

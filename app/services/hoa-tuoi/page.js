'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function HoaTuoi() {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.breadcrumb}>
                    <Link href="/">Trang chủ</Link>
                    <span> / </span>
                    <span>Hoa Tươi</span>
                </div>

                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Hoa Tươi</h1>
                        <p>Hoa tươi đẹp từ các vườn hoa uy tín, phù hợp trang trí và làm quà tặng</p>
                    </div>
                    <div className={styles.heroImage}>
                        <Image
                            src="/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp"
                            alt="Hoa tươi"
                            width={500}
                            height={400}
                            className={styles.image}
                        />
                    </div>
                </section>

                <section className={styles.features}>
                    <h2>Đặc Điểm Nổi Bật</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureItem}>
                            <h3>🌸 Tươi Đẹp</h3>
                            <p>Hoa được chọn lọc từ các vườn hoa uy tín, đảm bảo độ tươi lâu</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>🎨 Thiết Kế</h3>
                            <p>Thiết kế và cắm hoa chuyên nghiệp theo yêu cầu</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>🚚 Giao Hàng</h3>
                            <p>Giao hàng nhanh chóng, đảm bảo hoa luôn tươi ngon</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>💝 Quà Tặng</h3>
                            <p>Phù hợp làm quà tặng cho mọi dịp đặc biệt</p>
                        </div>
                    </div>
                </section>

                <section className={styles.products}>
                    <h2>Sản Phẩm</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp"
                                    alt="Bó hoa hồng"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Bó Hoa Hồng</h3>
                            <p>Bó hoa hồng đỏ tươi, biểu tượng của tình yêu</p>
                            <span className={styles.price}>250.000đ</span>
                        </div>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp"
                                    alt="Hoa cưới"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Hoa Cưới</h3>
                            <p>Bó hoa cưới thiết kế đặc biệt cho ngày trọng đại</p>
                            <span className={styles.price}>500.000đ</span>
                        </div>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/tiec-canape2.jpg.webp"
                                    alt="Hoa trang trí"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Hoa Trang Trí</h3>
                            <p>Hoa trang trí cho sự kiện và không gian sống</p>
                            <span className={styles.price}>180.000đ</span>
                        </div>
                    </div>
                </section>

                <section className={styles.contact}>
                    <h2>Liên Hệ Đặt Hàng</h2>
                    <div className={styles.contactInfo}>
                        <p>📞 Hotline: 0123 456 789</p>
                        <p>📧 Email: order@traicayxanhtuoi.com</p>
                        <p>🕒 Thời gian phục vụ: 8:00 - 20:00 hàng ngày</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

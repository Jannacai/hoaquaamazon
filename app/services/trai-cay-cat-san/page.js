'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function TraiCayCatSan() {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.breadcrumb}>
                    <Link href="/">Trang chủ</Link>
                    <span> / </span>
                    <span>Trái Cây Cắt Sẵn</span>
                </div>

                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Trái Cây Cắt Sẵn</h1>
                        <p>Trái cây tươi ngon được cắt sẵn, tiện lợi và đảm bảo vệ sinh an toàn thực phẩm</p>
                    </div>
                    <div className={styles.heroImage}>
                        <Image
                            src="/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp"
                            alt="Trái cây cắt sẵn"
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
                            <h3>🍎 Tươi Ngon</h3>
                            <p>Trái cây được chọn lọc kỹ càng, đảm bảo độ tươi ngon tối ưu</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>✂️ Cắt Sẵn</h3>
                            <p>Được cắt sẵn theo từng phần vừa ăn, tiết kiệm thời gian</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>🧼 Vệ Sinh</h3>
                            <p>Quy trình chế biến đảm bảo vệ sinh an toàn thực phẩm</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>📦 Đóng Gói</h3>
                            <p>Đóng gói chuyên nghiệp, giữ nguyên độ tươi ngon</p>
                        </div>
                    </div>
                </section>

                <section className={styles.products}>
                    <h2>Sản Phẩm</h2>
                    <div className={styles.productGrid}>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp"
                                    alt="Hộp trái cây mix"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Hộp Trái Cây Mix</h3>
                            <p>Kết hợp nhiều loại trái cây tươi ngon</p>
                            <span className={styles.price}>150.000đ</span>
                        </div>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/Traicayteabreak1.jpeg.webp"
                                    alt="Khay trái cây cao cấp"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Khay Trái Cây Cao Cấp</h3>
                            <p>Dành cho các buổi tiệc và sự kiện</p>
                            <span className={styles.price}>300.000đ</span>
                        </div>
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                <Image
                                    src="/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp"
                                    alt="Hộp quà trái cây"
                                    width={300}
                                    height={200}
                                />
                            </div>
                            <h3>Hộp Quà Trái Cây</h3>
                            <p>Món quà ý nghĩa cho người thân</p>
                            <span className={styles.price}>200.000đ</span>
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

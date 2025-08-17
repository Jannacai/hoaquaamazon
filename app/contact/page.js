import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function Contact() {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Liên Hệ</h1>
                    <p className={styles.subtitle}>Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                </div>

                <div className={styles.contactContent}>
                    <div className={styles.contactInfo}>
                        <h2>Thông tin liên hệ</h2>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>📍</div>
                            <div>
                                <h3>Địa chỉ</h3>
                                <p>123 Đường ABC, Quận XYZ<br />TP. Hồ Chí Minh, Việt Nam</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>📞</div>
                            <div>
                                <h3>Điện thoại</h3>
                                <p>0123 456 789<br />0987 654 321</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>📧</div>
                            <div>
                                <h3>Email</h3>
                                <p>info@traicayxanhtuoi.com<br />support@traicayxanhtuoi.com</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>🕒</div>
                            <div>
                                <h3>Giờ làm việc</h3>
                                <p>Thứ 2 - Thứ 7: 8:00 - 20:00<br />Chủ nhật: 8:00 - 18:00</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactForm}>
                        <h2>Gửi tin nhắn</h2>
                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Họ và tên *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Chủ đề *</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    className={styles.formInput}
                                >
                                    <option value="">Chọn chủ đề</option>
                                    <option value="product">Thông tin sản phẩm</option>
                                    <option value="order">Đặt hàng</option>
                                    <option value="support">Hỗ trợ kỹ thuật</option>
                                    <option value="complaint">Khiếu nại</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">Nội dung *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    required
                                    className={styles.formTextarea}
                                    placeholder="Nhập nội dung tin nhắn của bạn..."
                                ></textarea>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

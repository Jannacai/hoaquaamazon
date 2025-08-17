import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function About() {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Giới Thiệu</h1>
                    <p className={styles.subtitle}>Câu chuyện về Hoa Quả Amazon</p>
                </div>

                <section className={styles.story}>
                    <div className={styles.storyContent}>
                        <h2>Câu chuyện của chúng tôi</h2>
                        <p>
                            Hoa Quả Amazon được thành lập với sứ mệnh mang đến những loại trái cây
                            tươi ngon nhất từ các vườn cây uy tín trên khắp Việt Nam. Chúng tôi tin rằng
                            mỗi quả trái cây không chỉ là thực phẩm mà còn là nguồn dinh dưỡng quý báu
                            cho sức khỏe của mọi người.
                        </p>
                        <p>
                            Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi đã xây dựng được mạng lưới
                            nhà cung cấp rộng khắp, đảm bảo chất lượng từ khâu thu hoạch đến tay người tiêu dùng.
                        </p>
                    </div>
                    <div className={styles.storyImage}>
                        <div className={styles.imageBox}>🌱</div>
                    </div>
                </section>

                <section className={styles.values}>
                    <h2 className={styles.sectionTitle}>Giá trị cốt lõi</h2>
                    <div className={styles.valueGrid}>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>🌿</div>
                            <h3>Tự nhiên</h3>
                            <p>Cam kết cung cấp trái cây 100% tự nhiên, không chất bảo quản có hại</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>⚡</div>
                            <h3>Tươi mới</h3>
                            <p>Giao hàng nhanh chóng trong 24h, đảm bảo độ tươi ngon tối ưu</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>🤝</div>
                            <h3>Tin cậy</h3>
                            <p>Xây dựng niềm tin với khách hàng qua chất lượng và dịch vụ</p>
                        </div>
                        <div className={styles.valueItem}>
                            <div className={styles.valueIcon}>💚</div>
                            <h3>Bền vững</h3>
                            <p>Hỗ trợ nông dân địa phương và bảo vệ môi trường</p>
                        </div>
                    </div>
                </section>

                <section className={styles.team}>
                    <h2 className={styles.sectionTitle}>Đội ngũ của chúng tôi</h2>
                    <p className={styles.teamDescription}>
                        Đội ngũ chuyên gia giàu kinh nghiệm, tận tâm với sứ mệnh mang đến
                        những sản phẩm trái cây chất lượng nhất cho khách hàng.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}

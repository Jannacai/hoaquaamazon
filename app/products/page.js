import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export default function Products() {
    const products = [
        { id: 1, name: 'Táo Fuji', price: '50.000đ/kg', image: '🍎', description: 'Táo Fuji tươi ngon, giòn ngọt' },
        { id: 2, name: 'Cam Sành', price: '30.000đ/kg', image: '🍊', description: 'Cam sành tươi, nhiều nước' },
        { id: 3, name: 'Chuối Tiêu', price: '25.000đ/nải', image: '🍌', description: 'Chuối tiêu chín vàng thơm ngon' },
        { id: 4, name: 'Xoài Cát', price: '80.000đ/kg', image: '🥭', description: 'Xoài cát Hòa Lộc ngọt thơm' },
        { id: 5, name: 'Dâu Tây', price: '120.000đ/kg', image: '🍓', description: 'Dâu tây Đà Lạt tươi ngon' },
        { id: 6, name: 'Nho Xanh', price: '90.000đ/kg', image: '🍇', description: 'Nho xanh không hạt, ngọt mát' },
    ]

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Sản Phẩm</h1>
                    <p className={styles.subtitle}>Khám phá các loại trái cây tươi ngon nhất</p>
                </div>

                <div className={styles.filters}>
                    <select className={styles.filterSelect}>
                        <option value="">Tất cả danh mục</option>
                        <option value="citrus">Trái cây có múi</option>
                        <option value="tropical">Trái cây nhiệt đới</option>
                        <option value="berry">Quả mọng</option>
                    </select>
                    <select className={styles.filterSelect}>
                        <option value="">Sắp xếp theo</option>
                        <option value="price-low">Giá thấp đến cao</option>
                        <option value="price-high">Giá cao đến thấp</option>
                        <option value="name">Tên A-Z</option>
                    </select>
                </div>

                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.productImage}>
                                <span className={styles.emoji}>{product.image}</span>
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDescription}>{product.description}</p>
                                <div className={styles.productPrice}>{product.price}</div>
                                <button className={styles.addToCartBtn}>Thêm vào giỏ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}

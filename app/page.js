'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import AddressAutocomplete from '@/components/AddressAutocomplete/AddressAutocomplete'
import HereMap from '@/components/HereMap/HereMap'
import TestModal from '@/components/TestModal/TestModal'

// Component để hiển thị hình ảnh với fallback emoji
function ImageWithFallback({ src, alt, fallback, className }) {
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
        setHasError(true)
    }

    if (hasError) {
        return <div className={className}>{fallback}</div>
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={120}
            height={120}
            className={className}
            onError={handleError}
            priority
        />
    )
}

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [currentPopularSlide, setCurrentPopularSlide] = useState(0)
    const [customerAddress, setCustomerAddress] = useState('')
    const [distanceInfo, setDistanceInfo] = useState('Nhập địa chỉ để kiểm tra khoảng cách và phí vận chuyển')
    const [customerCoordinates, setCustomerCoordinates] = useState(null)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    // Monitor customerCoordinates state changes
    useEffect(() => {
        console.log('🔄 customerCoordinates state changed:', {
            newValue: customerCoordinates,
            type: typeof customerCoordinates,
            isNull: customerCoordinates === null,
            isUndefined: customerCoordinates === undefined,
            isObject: typeof customerCoordinates === 'object' && customerCoordinates !== null,
            isArray: Array.isArray(customerCoordinates),
            hasLatLng: customerCoordinates && typeof customerCoordinates === 'object' && 'lat' in customerCoordinates && 'lng' in customerCoordinates,
            keys: customerCoordinates && typeof customerCoordinates === 'object' ? Object.keys(customerCoordinates) : 'N/A',
            stringified: JSON.stringify(customerCoordinates)
        })
    }, [customerCoordinates])

    const slides = [
        {
            image: '/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp',
            alt: 'Trái cây tươi ngon',
            text: 'Trái Cây Tươi Ngon',
            description: 'Trái cây tươi ngon, chất lượng cao từ các vườn cây uy tín',
            fallback: '🍎',
            miniImages: [
                { image: '/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp', emoji: '🍎' },
                { image: '/images/Traicayteabreak1.jpeg.webp', emoji: '🍏' },
                { image: '/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp', emoji: '🍊' }
            ]
        },
        {
            image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp',
            alt: 'Bánh tiệc trà',
            text: 'Bánh Tiệc Trà Cao Cấp',
            description: 'Bánh tiệc trà thơm ngon, phục vụ các buổi tiệc sang trọng',
            fallback: '🧁',
            miniImages: [
                { image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp', emoji: '🧁' },
                { image: '/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp', emoji: '🎂' },
                { image: '/images/banh-halloween-danh-muc-thumpnail.jpg.webp', emoji: '🍰' }
            ]
        },
        {
            image: '/images/nuoc-ep-danh-muc-thumpnail.jpg.webp',
            alt: 'Nước ép trái cây',
            text: 'Nước Ép Trái Cây Tươi',
            description: 'Nước ép trái cây tươi ngon, giàu vitamin và dinh dưỡng',
            fallback: '🥤',
            miniImages: [
                { image: '/images/nuoc-ep-danh-muc-thumpnail.jpg.webp', emoji: '🥤' },
                { image: '/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp', emoji: '🍹' },
                { image: '/images/Traicayteabreak1.jpeg.webp', emoji: '🧃' }
            ]
        },
        {
            image: '/images/tiec-teabreak1.jpg.webp',
            alt: 'Tiệc tea break',
            text: 'Dịch Vụ Tea Break',
            description: 'Dịch vụ tea break chuyên nghiệp cho các sự kiện',
            fallback: '☕',
            miniImages: [
                { image: '/images/tiec-teabreak1.jpg.webp', emoji: '☕' },
                { image: '/images/tiec-canape2.jpg.webp', emoji: '🍪' },
                { image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp', emoji: '🧁' }
            ]
        },
        {
            image: '/images/banh-halloween-danh-muc-thumpnail.jpg.webp',
            alt: 'Bánh Halloween',
            text: 'Bánh Chủ Đề Đặc Biệt',
            description: 'Bánh thiết kế theo chủ đề, phù hợp mọi dịp lễ hội',
            fallback: '🎃',
            miniImages: [
                { image: '/images/banh-halloween-danh-muc-thumpnail.jpg.webp', emoji: '🎃' },
                { image: '/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp', emoji: '🎄' },
                { image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp', emoji: '🧁' }
            ]
        },
        {
            image: '/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp',
            alt: 'Hộp quà rau câu',
            text: 'Hộp Quà Rau Câu Cao Cấp',
            description: 'Hộp quà rau câu sen đá, món quà ý nghĩa cho người thân',
            fallback: '🎁',
            miniImages: [
                { image: '/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp', emoji: '🎁' },
                { image: '/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp', emoji: '🍮' },
                { image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp', emoji: '🧁' }
            ]
        }
    ]

    const popularItems = [
        {
            image: '/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp',
            title: 'Trái Cây Tươi',
            price: '$15',
            description: 'Trái cây tươi ngon được chọn lọc kỹ càng với độ tươi và chất lượng cao nhất.',
            rating: '⭐⭐⭐⭐⭐',
            emoji: '🍎'
        },
        {
            image: '/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp',
            title: 'Bánh Tiệc Trà',
            price: '$25',
            description: 'Bánh tiệc trà thơm ngon, phục vụ các buổi tiệc sang trọng và đẳng cấp.',
            rating: '⭐⭐⭐⭐⭐',
            emoji: '🧁'
        },
        {
            image: '/images/nuoc-ep-danh-muc-thumpnail.jpg.webp',
            title: 'Nước Ép Trái Cây',
            price: '$12',
            description: 'Nước ép trái cây tươi ngon, giàu vitamin và dinh dưỡng tốt cho sức khỏe.',
            rating: '⭐⭐⭐⭐☆',
            emoji: '🥤'
        },
        {
            image: '/images/tiec-teabreak1.jpg.webp',
            title: 'Dịch Vụ Tea Break',
            price: '$30',
            description: 'Dịch vụ tea break chuyên nghiệp cho các sự kiện và hội nghị.',
            rating: '⭐⭐⭐⭐⭐',
            emoji: '☕'
        },
        {
            image: '/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp',
            title: 'Hộp Quà Rau Câu',
            price: '$20',
            description: 'Hộp quà rau câu sen đá, món quà ý nghĩa cho người thân yêu.',
            rating: '⭐⭐⭐⭐☆',
            emoji: '🎁'
        }
    ]

    // Auto slide every 3 seconds (chỉ cho desktop)
    useEffect(() => {
        const isMobile = window.innerWidth <= 768
        if (!isMobile) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length)
            }, 3000)
            return () => clearInterval(timer)
        }
    }, [slides.length])

    // Auto slide for popular items every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPopularSlide((prev) => (prev + 1) % popularItems.length)
        }, 4000)

        return () => clearInterval(timer)
    }, [popularItems.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    // Xử lý touch events cho mobile slider
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
        setIsDragging(true)
    }

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        
        if (isLeftSwipe) {
            nextSlide()
        }
        if (isRightSwipe) {
            prevSlide()
        }
        setIsDragging(false)
    }

    // Xử lý mouse events cho desktop
    const onMouseDown = (e) => {
        setTouchEnd(null)
        setTouchStart(e.clientX)
        setIsDragging(true)
    }

    const onMouseMove = (e) => {
        if (isDragging) {
            setTouchEnd(e.clientX)
        }
    }

    const onMouseUp = () => {
        if (!touchStart || !touchEnd) return
        
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        
        if (isLeftSwipe) {
            nextSlide()
        }
        if (isRightSwipe) {
            prevSlide()
        }
        setIsDragging(false)
    }

    const onMouseLeave = () => {
        setIsDragging(false)
    }

    // Hàm tìm kiếm và so sánh địa chỉ sử dụng HERE API
    const searchAndCompareAddress = async () => {
        if (!customerAddress.trim()) {
            setDistanceInfo('Vui lòng nhập địa chỉ của bạn')
            return
        }

        setDistanceInfo('Đang tìm kiếm với HERE API...')

        try {
            console.log('🔍 Frontend: Bắt đầu gọi HERE API cho địa chỉ:', customerAddress);

            // Sử dụng HERE API thay vì Google Maps API
            // Xử lý encoding tiếng Việt để HERE API hiểu được
            const normalizedAddress = customerAddress
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
                .replace(/[đĐ]/g, 'd') // Thay đ/Đ thành d
                .replace(/[Đ]/g, 'D');

            console.log(`🔍 Original address: ${customerAddress}`);
            console.log(`🔍 Normalized address: ${normalizedAddress}`);

            const response = await fetch('http://localhost:5000/api/here/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerAddress: normalizedAddress
                })
            })

            console.log('🔍 Frontend: Response status:', response.status);
            console.log('🔍 Frontend: Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Frontend: HTTP error ${response.status}: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            console.log('🔍 Frontend received result:', result)

            if (result.success && result.message) {
                const { message } = result
                console.log('🔍 Frontend processing message:', message)

                // Kiểm tra dữ liệu trước khi xử lý
                if (!message || typeof message !== 'object') {
                    console.error('❌ Frontend: Dữ liệu message không hợp lệ:', message)
                    setDistanceInfo('❌ Dữ liệu không hợp lệ từ server. Vui lòng thử lại.')
                    return
                }

                // Log chi tiết dữ liệu nhận được
                console.log('🔍 Frontend: Chi tiết dữ liệu nhận được:', {
                    customerAddress: message.customerAddress,
                    distance: message.distance,
                    shippingFee: message.shippingFee,
                    deliveryTime: message.deliveryTime,
                    duration: message.duration,
                    api_used: message.api_used,
                    note: message.note,
                    canDeliver: message.canDeliver,
                    fallbackInfo: message.fallbackInfo,
                    validation: message.validation,
                    transportMode: message.transportMode
                });

                // Lưu tọa độ khách hàng để hiển thị trên bản đồ
                if (message.customerCoordinates) {
                    console.log('📍 Frontend: Setting customerCoordinates:', message.customerCoordinates)
                    setCustomerCoordinates(message.customerCoordinates);
                } else {
                    console.log('❌ Frontend: No customerCoordinates in message:', message)
                }

                // Tạo thông tin hiển thị đơn giản và dễ hiểu
                let info = `📍 Địa chỉ: ${message.customerAddress || customerAddress}\n`
                info += `📏 Khoảng cách: ${message.distance !== undefined && message.distance !== null ? message.distance + 'km' : 'N/A'}\n`
                info += `💰 Phí vận chuyển: ${message.shippingFee === 0 ? 'Miễn phí' : (message.shippingFee ? message.shippingFee.toLocaleString() + 'đ' : 'N/A')}\n`
                info += `⏰ Thời gian giao hàng: ${message.deliveryTime || 'N/A'}\n`

                // Chỉ hiển thị thông tin khả năng giao hàng
                if (message.canDeliver === false) {
                    info += `\n⚠️ Chúng tôi chưa giao hàng đến khu vực này`
                } else if (message.canDeliver === true) {
                    info += `\n✅ Chúng tôi có thể giao hàng đến địa chỉ này`
                }

                console.log('🔍 Frontend setting info:', info)
                setDistanceInfo(info)
                console.log('🔍 Frontend state updated, current distanceInfo:', info)
            } else {
                console.log('❌ Frontend received error:', result.error || 'Không có thông tin lỗi')
                console.log('❌ Frontend: Chi tiết result:', result)
                setDistanceInfo(`❌ ${result.error || 'Lỗi không xác định từ server'}`)
            }
        } catch (error) {
            console.error('❌ Error calling HERE API:', error)
            setDistanceInfo(`❌ Lỗi kết nối với HERE API: ${error.message}. Vui lòng thử lại sau.`)
        }
    }

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <span>! Hi Bạn</span>
                            <h1 className={`${styles.title} welcome-title`}>
                                Chào mừng đến với <span className={styles.highlight}>Hoa Quả Amazon</span>
                            </h1>
                            <p className={styles.description}>
                                Cung cấp những loại trái cây tươi ngon, chất lượng cao nhất từ các vườn cây uy tín
                            </p>
                            <button className={styles.ctaButton}>
                                Khám phá sản phẩm
                            </button>
                        </div>
                        <div className={styles.heroSlider}>
                            <div 
                                className={styles.sliderContainer}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseLeave}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            >
                                {/* Mobile: Horizontal Scroll Slider */}
                                <div className={styles.mobileSliderWrapper}>
                                    <div 
                                        className={styles.mobileSliderTrack}
                                        style={{
                                            transform: `translateX(-${currentSlide * 100}%)`,
                                            transition: isDragging ? 'none' : 'transform 0.5s ease-in-out'
                                        }}
                                    >
                                        {slides.map((slide, index) => (
                                            <div key={index} className={styles.mobileSlideItem}>
                                                <div 
                                                    className={styles.mobileSlideImage}
                                                    style={{
                                                        backgroundImage: `url(${slide.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                >
                                                    <div className={styles.mobileSlideOverlay}>
                                                        <span className={styles.mobileSlideEmoji}>{slide.fallback}</span>
                                                        <h3>{slide.text}</h3>
                                                        <p>{slide.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop: 3 Parallel Tilted Images */}
                                <div key={currentSlide} className={styles.parallelImagesContainer}>
                                    {slides[currentSlide].miniImages.map((img, index) => (
                                        <div
                                            key={`${currentSlide}-${index}`}
                                            className={`${styles.parallelImage} ${styles[`parallelImage${index + 1}`]}`}
                                            style={{
                                                backgroundImage: `url(${img.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        >
                                            <div className={styles.imageOverlay}>
                                                <div className={styles.imageContent}>
                                                    <span className={styles.imageEmoji}>{img.emoji}</span>
                                                    <div className={styles.imageText}>
                                                        <h3>{slides[currentSlide].text}</h3>
                                                        <p>{slides[currentSlide].description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Navigation Arrows for Mobile */}
                            <button 
                                className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                                onClick={prevSlide}
                                aria-label="Previous slide"
                            >
                                ‹
                            </button>
                            <button 
                                className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                                onClick={nextSlide}
                                aria-label="Next slide"
                            >
                                ›
                            </button>
                            
                            <div className={styles.sliderDots}>
                                {slides.map((_, dotIndex) => (
                                    <span
                                        key={dotIndex}
                                        className={`${styles.dot} ${currentSlide === dotIndex ? styles.active : ''}`}
                                        onClick={() => goToSlide(dotIndex)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.features}>
                    <Link href="/services/trai-cay-cat-san" className={`${styles.feature} ${styles.featureGreen}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp"
                                alt="Trái cây cắt sẵn"
                                fallback="🍎"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Trái Cây Cắt Sẵn</h3>
                            <p>Trái cây tươi ngon được cắt sẵn, tiện lợi và đảm bảo vệ sinh an toàn thực phẩm</p>
                        </div>
                    </Link>
                    <Link href="/services/hoa-tuoi" className={`${styles.feature} ${styles.featurePink}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp"
                                alt="Hoa tươi"
                                fallback="🌸"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Hoa Tươi</h3>
                            <p>Hoa tươi đẹp từ các vườn hoa uy tín, phù hợp trang trí và làm quà tặng</p>
                        </div>
                    </Link>
                    <Link href="/services/banh-ngot" className={`${styles.feature} ${styles.featureOrange}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp"
                                alt="Bánh ngọt"
                                fallback="🧁"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Bánh Ngọt</h3>
                            <p>Bánh ngọt thơm ngon, đa dạng mẫu mã, phù hợp cho mọi dịp lễ hội và tiệc tùng</p>
                        </div>
                    </Link>
                    <Link href="/services/decor-tiec-cong-ty" className={`${styles.feature} ${styles.featureBlue}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/tiec-teabreak1.jpg.webp"
                                alt="Decor setup tiệc công ty"
                                fallback="🏢"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Decor Setup Tiệc Công Ty</h3>
                            <p>Dịch vụ trang trí và setup tiệc công ty chuyên nghiệp, tạo không gian sang trọng</p>
                        </div>
                    </Link>
                    <Link href="/services/decor-tiec-ca-nhan" className={`${styles.feature} ${styles.featurePurple}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/tiec-canape2.jpg.webp"
                                alt="Decor setup tiệc cá nhân"
                                fallback="🏠"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Decor Setup Tiệc Cá Nhân/Gia Đình</h3>
                            <p>Trang trí tiệc sinh nhật, kỷ niệm gia đình ấm cúng, tạo kỷ niệm đáng nhớ</p>
                        </div>
                    </Link>
                    <Link href="/services/tiec-ngot-man" className={`${styles.feature} ${styles.featureRed}`}>
                        <div className={styles.featureImageContainer}>
                            <ImageWithFallback
                                src="/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp"
                                alt="Tiệc ngọt mặn theo yêu cầu"
                                fallback="🍽️"
                                className={styles.featureImage}
                            />
                        </div>
                        <div className={styles.featureContent}>
                            <h3>Tiệc Ngọt/Mặn Theo Yêu Cầu</h3>
                            <p>Phục vụ tiệc buffet ngọt và mặn theo yêu cầu, menu đa dạng phù hợp mọi sở thích</p>
                        </div>
                    </Link>
                </section>

                <section className={styles.shippingPolicy}>
                    <h2 className={styles.shippingTitle}>🚚 Chính Sách Vận Chuyển</h2>
                    <div className={styles.shippingContainer}>
                        {/* Chính sách vận chuyển - Cột trái */}
                        <div className={styles.shippingLeft}>
                            <div className={styles.shippingContent}>

                                {/* Grid 2x2 cho các tính năng */}
                                <div className={styles.shippingGrid}>
                                    <div className={styles.shippingItem}>
                                        <div className={styles.shippingIcon}>🚚</div>
                                        <div className={styles.shippingText}>
                                            <h4>Giao Nhanh 2-4h</h4>
                                            <p>Nội thành TP.HCM</p>
                                        </div>
                                    </div>
                                    <div className={styles.shippingItem}>
                                        <div className={styles.shippingIcon}>❄️</div>
                                        <div className={styles.shippingText}>
                                            <h4>Bảo Quản Lạnh</h4>
                                            <p>Giữ nguyên độ tươi</p>
                                        </div>
                                    </div>
                                    <div className={styles.shippingItem}>
                                        <div className={styles.shippingIcon}>💰</div>
                                        <div className={styles.shippingText}>
                                            <h4>Miễn Phí Ship</h4>
                                            <p>Đơn từ 200k, bán kính 15km</p>
                                        </div>
                                    </div>
                                    <div className={styles.shippingItem}>
                                        <div className={styles.shippingIcon}>📱</div>
                                        <div className={styles.shippingText}>
                                            <h4>Theo Dõi Đơn</h4>
                                            <p>Cập nhật real-time</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin cửa hàng và kết quả */}
                                <div className={styles.bottomSection}>
                                    {/* Thông tin cửa hàng */}
                                    <div className={styles.companyInfo}>
                                        <div className={styles.infoCard}>
                                            <h4>🏪 Cửa Hàng</h4>
                                            <p>📍 11 Phạm Phú Thứ<br />P11, Quận Tân Bình, TP.HCM</p>
                                        </div>
                                        <div className={styles.infoCard}>
                                            <h4>🕒 Giờ Làm Việc</h4>
                                            <p>8:00 - 20:00<br />Hàng ngày</p>
                                        </div>
                                    </div>

                                    {/* Kết quả tìm kiếm */}
                                    {distanceInfo !== 'Nhập địa chỉ để kiểm tra khoảng cách và phí vận chuyển' && (
                                        <div className={styles.distanceInfo}>
                                            <h4>📊 Kết Quả Tìm Kiếm</h4>
                                            <pre style={{ whiteSpace: 'pre-line', margin: 0, fontFamily: 'inherit', fontSize: '14px' }}>
                                                {distanceInfo}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kiểm tra khu vực giao hàng - Cột phải */}
                        <div className={styles.shippingRight}>
                            <div className={styles.mapContainer}>
                                <h3 className={styles.mapTitle}>🗺️ Kiểm Tra Khu Vực Giao Hàng</h3>

                                {/* Thanh tìm kiếm */}
                                <div className={styles.addressSearch}>
                                    <AddressAutocomplete
                                        value={customerAddress}
                                        onChange={setCustomerAddress}
                                        onSelect={(suggestion) => {
                                            setCustomerAddress(suggestion.description)
                                            setTimeout(() => {
                                                searchAndCompareAddress()
                                            }, 100)
                                        }}
                                        placeholder="Nhập địa chỉ của bạn..."
                                        className={styles.addressAutocomplete}
                                    />
                                    <button
                                        className={styles.searchButton}
                                        onClick={searchAndCompareAddress}
                                    >
                                        🔍 Tìm Kiếm
                                    </button>
                                </div>

                                {/* Bản đồ */}
                                <div className={styles.mapFrame}>
                                    <HereMap
                                        origin={{ lat: 10.78869, lng: 106.64963 }}
                                        destination={customerCoordinates}
                                        height={280}
                                        showRoute={!!customerCoordinates}
                                    />
                                </div>


                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.popularFood}>
                    <div className={styles.starIconRight}>✨</div>
                    <div className={styles.popularHeader}>
                        <h2>Sản Phẩm Phổ Biến Nhất</h2>
                        <p>Danh sách những sản phẩm trái cây và bánh ngọt được yêu thích nhất, bao gồm món chính, đồ uống và tráng miệng mà bạn phải thử khi đến với chúng tôi để có trải nghiệm chân thật. Hãy xem ngay!</p>
                    </div>

                    <div className={styles.ListpopularFood}>
                        <div className={styles.ItempopularFood}>
                            <a className={styles.actionImg}>
                                <img className={styles.imgpopilar} src="/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp" alt="Bánh Mini Giáng Sinh" />
                            </a>
                            <div className={styles.costPopular}>
                                <h2 className={styles.titilecpopularFood}>
                                    Schezwan Noodles
                                </h2>
                                <span className={styles.cost}>10.000đ</span>
                            </div>
                            <p className={styles.descpopularFood}>Fresh toasted sourdough bread with olive oil and pomegranate.</p>
                            <div className={styles.groupaction}>
                                <a className={styles.actionBuy}>Mua Ngay</a>
                                <div className={styles.popularRating}>
                                    <span>⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ItempopularFood}>
                            <a className={styles.actionImg}>
                                <img className={styles.imgpopilar} src="/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp" alt="Bánh Mini Giáng Sinh" />
                            </a>
                            <div className={styles.costPopular}>
                                <h2 className={styles.titilecpopularFood}>
                                    Schezwan Noodles
                                </h2>
                                <span className={styles.cost}>10.000đ</span>
                            </div>
                            <p className={styles.descpopularFood}>Fresh toasted sourdough bread with olive oil and pomegranate.</p>
                            <div className={styles.groupaction}>
                                <a className={styles.actionBuy}>Mua Ngay</a>
                                <div className={styles.popularRating}>
                                    <span>⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ItempopularFood}>
                            <a className={styles.actionImg}>
                                <img className={styles.imgpopilar} src="/images/banh-mini-giang-sinh-danh-muc-thumpnail.jpg.webp" alt="Bánh Mini Giáng Sinh" />
                            </a>
                            <div className={styles.costPopular}>
                                <h2 className={styles.titilecpopularFood}>
                                    Schezwan Noodles
                                </h2>
                                <span className={styles.cost}>10.000đ</span>
                            </div>
                            <p className={styles.descpopularFood}>Fresh toasted sourdough bread with olive oil and pomegranate.</p>
                            <div className={styles.groupaction}>
                                <a className={styles.actionBuy}>Mua Ngay</a>
                                <div className={styles.popularRating}>
                                    <span>⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.visitRestaurant}>
                    <div className={styles.visitHeader}>
                        <h2>Ghé Thăm Nhà Hàng Của Chúng Tôi</h2>
                        <p>Thực đơn chất lượng theo phong cách quê hương, dịch vụ thân thiện và hiệu quả, kết hợp với giá trị chính hãng đã giúp Our Best phục vụ các gia đình như gia đình bạn trong hơn 28 năm.</p>
                    </div>

                    <div className={styles.visitGrid}>
                        <div className={styles.visitImageLarge}>
                            <img src="/images/tiec-teabreak1.jpg.webp" alt="Restaurant Interior" />
                        </div>

                        <div className={styles.visitImagesSmall}>
                            <div className={styles.visitImageSmall}>
                                <img src="/images/trai-cay-tuoi-danh-muc-thumpnail.jpg.webp" alt="Dining Area" />
                            </div>
                            <div className={styles.visitImageSmall}>
                                <img src="/images/banh-tiec-tra-danh-muc-thumpnail.jpg.webp" alt="Food Preparation" />
                            </div>
                            <div className={styles.visitImageSmall}>
                                <img src="/images/nuoc-ep-danh-muc-thumpnail.jpg.webp" alt="Kitchen" />
                            </div>
                            <div className={styles.visitImageSmall}>
                                <img src="/images/hop-qua-rau-cau-sen-da2 (3).JPG.webp" alt="Chef Cooking" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.popularFood}>
                    {/* <div className={styles.starIcon}>⭐</div> */}
                    <div className={styles.starIconRight}>✨</div>
                    <div className={styles.popularHeader}>
                        <h2>Sản Phẩm Phổ Biến Nhất</h2>
                        <p>Danh sách những sản phẩm trái cây và bánh ngọt được yêu thích nhất, bao gồm món chính, đồ uống và tráng miệng mà bạn phải thử khi đến với chúng tôi để có trải nghiệm chân thật. Hãy xem ngay!</p>
                    </div>

                    <div className={styles.popularGrid}>
                        <div
                            className={styles.popularSlider}
                            style={{
                                transform: `translateX(-${currentPopularSlide * (350 + 32)}px)` // 350px item width + 32px gap
                            }}
                        >
                            {popularItems.map((item, index) => (
                                <div key={index} className={styles.popularItem}>
                                    <div className={styles.popularImage} style={{
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                        <div className={styles.popularOverlay}>{item.emoji}</div>
                                    </div>
                                    <div className={styles.popularContent}>
                                        <div className={styles.popularTopRow}>
                                            <h3>{item.title}</h3>
                                            <p className={styles.popularPrice}>{item.price}</p>
                                        </div>
                                        <p className={styles.popularDesc}>{item.description}</p>
                                        <div className={styles.popularBottomRow}>
                                            <div className={styles.popularRating}>
                                                <span>{item.rating}</span>
                                            </div>
                                            <button className={styles.orderBtn}>Đặt Ngay</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
            <TestModal />
        </div>
    )
}

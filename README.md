# Trái Cây Xanh Tươi - Frontend

Website bán trái cây tươi ngon được xây dựng với Next.js và CSS Modules.

## Công nghệ sử dụng

- **Next.js 14** - React framework
- **JavaScript** - Ngôn ngữ lập trình
- **CSS Modules** - Styling
- **React 18** - UI Library

## Tính năng

- 🍎 Hiển thị danh sách sản phẩm trái cây
- 🛒 Giỏ hàng (sẽ phát triển)
- 📱 Responsive design
- 🎨 UI hiện đại với CSS Modules
- 🚀 Tối ưu hiệu suất với Next.js

## Cấu trúc dự án

```
FE_TraiCayXanhTuoi/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.js          # Root layout
│   ├── page.js            # Trang chủ
│   ├── page.module.css    # Styles cho trang chủ
│   ├── products/          # Trang sản phẩm
│   ├── about/             # Trang giới thiệu
│   └── contact/           # Trang liên hệ
├── components/            # React components
│   ├── Header/           # Header component
│   ├── Footer/           # Footer component
│   └── Navigation/       # Navigation component
├── styles/               # Global styles
│   └── globals.css       # CSS toàn cục
├── utils/                # Utility functions
├── hooks/                # Custom React hooks
├── context/              # React context
├── services/             # API services
└── public/               # Static files
```

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd FE_TraiCayXanhTuoi

# Cài đặt dependencies
npm install
```

### Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Build production

```bash
npm run build
npm start
```

## Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## Hướng dẫn phát triển

### CSS Modules
Dự án sử dụng CSS Modules để styling. Mỗi component có file CSS riêng với extension `.module.css`.

Ví dụ:
```javascript
import styles from './Component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

### Thêm trang mới
1. Tạo thư mục mới trong `app/`
2. Tạo file `page.js` cho component
3. Tạo file `page.module.css` cho styles
4. Cập nhật navigation nếu cần

### Thêm component mới
1. Tạo thư mục trong `components/`
2. Tạo file component `.js`
3. Tạo file styles `.module.css`
4. Export component

## Liên hệ

- Email: info@traicayxanhtuoi.com
- Điện thoại: 0123 456 789

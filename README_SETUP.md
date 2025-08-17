# Hướng dẫn thiết lập dự án Trái Cây Xanh Tươi

## Cài đặt Dependencies

```bash
npm install
```

## Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root của front-end với nội dung:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Chạy dự án

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Tính năng Authentication

- **Modal đăng nhập/đăng ký**: 
  - Click nút "Đăng nhập" trên header để mở modal
  - Modal hiển thị theo kiểu ngang (90vw x 70vh)
  - Bên trái: Hình ảnh và thông tin branding
  - Bên phải: Form đăng nhập/đăng ký
- **Chuyển đổi form**: Trong modal có thể chuyển đổi giữa đăng nhập và đăng ký
- **Responsive design**: Tự động chuyển thành layout dọc trên mobile
- **Lưu trữ token**: Sử dụng cookies để lưu trữ access token và refresh token
- **Auto logout**: Tự động đăng xuất khi token hết hạn
- **Social login**: Hỗ trợ đăng nhập qua Google và Facebook (UI sẵn sàng)

## Cấu trúc thư mục

```
├── app/                    # Next.js App Router
├── components/            # React Components
│   ├── AuthButton/       # Nút đăng nhập/User menu
│   ├── AuthModal/        # Modal đăng nhập/đăng ký
│   ├── Header/           # Header component
│   └── ...
├── context/              # React Context
│   └── AuthContext.js    # Authentication context
├── services/             # API Services
│   └── authService.js    # Authentication API calls
└── styles/               # Global styles
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

## Troubleshooting

1. **Lỗi CORS**: Đảm bảo back-end đã cấu hình CORS cho front-end URL
2. **API không kết nối được**: Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
3. **Modal không hiển thị**: Kiểm tra import AuthModal trong AuthButton component

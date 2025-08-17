# Hướng Dẫn Cấu Hình Google Maps API

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable các API sau:
   - **Geocoding API** (để chuyển địa chỉ thành tọa độ)
   - **Maps JavaScript API** (để hiển thị bản đồ)
   - **Places API** (tùy chọn, để gợi ý địa chỉ)

## 2. Tạo API Key

1. Vào **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy API key được tạo
4. **Quan trọng**: Restrict API key để bảo mật:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Chọn các API đã enable ở trên

## 3. Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục root của project:

```env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Lưu ý**: File `.env.local` sẽ được git ignore tự động.

## 4. Giá Cả Google Maps API

### Geocoding API
- **Miễn phí**: 40,000 requests/tháng
- **Sau đó**: $5 per 1,000 requests

### Maps JavaScript API
- **Miễn phí**: 28,000 map loads/tháng
- **Sau đó**: $7 per 1,000 map loads

## 5. Test API

Sau khi cấu hình xong, test bằng cách:

1. Restart development server: `npm run dev`
2. Truy cập trang chủ
3. Thử nhập địa chỉ vào ô tìm kiếm
4. Kiểm tra console nếu có lỗi

## 6. Troubleshooting

### Lỗi "API key not configured"
- Kiểm tra file `.env.local` có đúng tên biến không
- Restart server sau khi thêm env variable

### Lỗi "This API project is not authorized"
- Kiểm tra API đã được enable chưa
- Kiểm tra API key restrictions

### Lỗi "REQUEST_DENIED"
- Kiểm tra domain restrictions trong API key
- Đảm bảo API key có quyền truy cập Geocoding API

## 7. Production Setup

Khi deploy lên production:

1. Cập nhật API key restrictions với domain production
2. Set environment variable `GOOGLE_MAPS_API_KEY` trên hosting platform
3. Monitor usage để tránh vượt quota

## 8. Alternative Solution (Nếu không muốn dùng Google Maps)

Có thể sử dụng các service khác:
- **OpenStreetMap + Nominatim** (miễn phí)
- **Mapbox** (có tier miễn phí)
- **Here Maps** (có tier miễn phí)

Hoặc tạm thời sử dụng simulation như hiện tại cho development.

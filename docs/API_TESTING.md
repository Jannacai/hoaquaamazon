# Hướng Dẫn Test API Address Comparison

## 1. Test API Endpoint

### URL
```
POST /api/address/compare
```

### Request Body
```json
{
  "customerAddress": "123 Lê Lợi, Quận 1, TP.HCM"
}
```

### Response Success
```json
{
  "success": true,
  "data": {
    "customerAddress": "123 Lê Lợi, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    "companyAddress": "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    "distance": 12.5,
    "shippingFee": 0,
    "deliveryTime": "2-4 giờ",
    "canDeliver": true,
    "coordinates": {
      "customer": {
        "lat": 10.7769,
        "lng": 106.7009
      },
      "company": {
        "lat": 10.7359,
        "lng": 106.7019
      }
    }
  }
}
```

### Response Error
```json
{
  "success": false,
  "error": "Không tìm thấy địa chỉ này"
}
```

## 2. Test với cURL

```bash
curl -X POST http://localhost:3000/api/address/compare \
  -H "Content-Type: application/json" \
  -d '{"customerAddress": "123 Lê Lợi, Quận 1, TP.HCM"}'
```

## 3. Test với Postman

1. Method: `POST`
2. URL: `http://localhost:3000/api/address/compare`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "customerAddress": "123 Lê Lợi, Quận 1, TP.HCM"
}
```

## 4. Test Cases

### Valid Addresses
- `"123 Lê Lợi, Quận 1, TP.HCM"`
- `"456 Nguyễn Huệ, Quận 1, TP.HCM"`
- `"789 Võ Văn Tần, Quận 3, TP.HCM"`

### Invalid Addresses
- `""` (empty string)
- `"abc"` (too short)
- `"Địa chỉ không tồn tại xyz 123"`

### Edge Cases
- Very long address (>200 characters)
- Address with special characters
- Address in different cities

## 5. Expected Behaviors

### Distance Calculation
- **≤ 15km**: Miễn phí vận chuyển
- **> 15km**: 5,000đ/km thêm
- **> 50km**: Không giao hàng

### Delivery Time
- **≤ 5km**: 1-2 giờ
- **5-10km**: 2-4 giờ
- **10-20km**: 4-6 giờ
- **> 20km**: 6-8 giờ

## 6. Development Mode

Khi chưa có Google Maps API key, API sẽ:
- Sử dụng simulation geocoding
- Tạo tọa độ giả nhưng nhất quán
- Vẫn tính toán khoảng cách và phí chính xác
- Thêm "(địa chỉ mô phỏng)" vào formatted address

## 7. Production Checklist

- [ ] Google Maps API key đã được cấu hình
- [ ] API restrictions đã được set up
- [ ] Environment variables đã được set trên hosting
- [ ] Test với địa chỉ thực tế
- [ ] Monitor API usage và costs

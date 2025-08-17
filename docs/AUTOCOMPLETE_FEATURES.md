# Address Autocomplete Features

## Tính Năng Đã Thêm

### 1. **Real-time Address Suggestions**
- Hiển thị gợi ý địa chỉ khi người dùng gõ (từ 3 ký tự trở lên)
- Debounce 300ms để tránh gọi API quá nhiều
- Loading indicator khi đang fetch data

### 2. **Keyboard Navigation**
- **Arrow Down/Up**: Di chuyển giữa các gợi ý
- **Enter**: Chọn gợi ý hiện tại
- **Escape**: Đóng dropdown gợi ý

### 3. **Mouse Interaction**
- Click để chọn gợi ý
- Hover để highlight gợi ý
- Click outside để đóng dropdown

### 4. **Auto-search on Selection**
- Tự động tìm kiếm khi chọn gợi ý từ dropdown
- Không cần click button "Tìm Kiếm" thêm

## API Endpoints

### Autocomplete API
```
GET /api/address/autocomplete?input=your_input
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "place_id": "ChIJ...",
      "description": "123 Lê Lợi, Quận 1, TP.HCM",
      "structured_formatting": {
        "main_text": "123 Lê Lợi",
        "secondary_text": "Quận 1, TP.HCM"
      }
    }
  ]
}
```

## Component Structure

### AddressAutocomplete Component
- **Props**:
  - `value`: Current input value
  - `onChange`: Callback when input changes
  - `onSelect`: Callback when suggestion is selected
  - `placeholder`: Input placeholder text
  - `className`: Additional CSS classes

### Features:
- Debounced API calls
- Keyboard navigation support
- Loading states
- Error handling
- Click outside to close
- Responsive design

## Fallback Mode

Khi chưa có Google Places API key:
- Sử dụng simulation với địa chỉ giả
- Vẫn hiển thị dropdown với gợi ý
- Functionality hoàn toàn giống như có API thật

## Usage Example

```jsx
<AddressAutocomplete
  value={address}
  onChange={setAddress}
  onSelect={(suggestion) => {
    setAddress(suggestion.description)
    // Auto search
    performSearch()
  }}
  placeholder="Nhập địa chỉ của bạn..."
/>
```

## Performance Optimizations

1. **Debouncing**: 300ms delay trước khi gọi API
2. **Minimum Characters**: Chỉ gọi API khi >= 3 ký tự
3. **Request Cancellation**: Cancel request cũ khi có request mới
4. **Caching**: Browser cache cho các request giống nhau
5. **Limit Results**: Chỉ hiển thị 5 gợi ý đầu tiên

## Mobile Responsive

- Input full width trên mobile
- Touch-friendly suggestion items
- Scrollable dropdown với custom scrollbar
- Larger touch targets

## Accessibility

- Keyboard navigation support
- ARIA labels (có thể thêm trong tương lai)
- Screen reader friendly
- Focus management

## Future Enhancements

- [ ] Thêm ARIA labels cho accessibility
- [ ] Cache suggestions trong localStorage
- [ ] Highlight matching text trong suggestions
- [ ] Geolocation để ưu tiên gợi ý gần
- [ ] Recent searches history

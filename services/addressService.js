/**
 * Service để xử lý các API calls liên quan đến địa chỉ và vận chuyển
 * Sử dụng HERE API v7 + Logic gợi ý thông minh từ backend
 * Tuân thủ 100% tài liệu HERE Maps API v7 (7.141)
 */

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-domain.com'
    : 'http://localhost:5000'

/**
 * Lấy gợi ý địa chỉ từ HERE API v7 + Logic gợi ý thông minh
 * - Sử dụng HERE Maps API v7 + Smart Logic từ backend
 * - Gợi ý địa điểm và địa chỉ chính xác với partial matching
 * - Tuân thủ 100% tài liệu HERE Maps API v7
 * @param {string} input - Input từ người dùng
 * @returns {Promise<Object>} Danh sách gợi ý thông minh
 */
export const getAddressSuggestions = async (input) => {
    try {
        if (!input || input.trim().length < 2) {
            return {
                success: true,
                data: {
                    predictions: [],
                    search_type: 'none'
                }
            }
        }

        console.log(`🔍 Frontend: Tìm gợi ý thông minh cho "${input}" (HERE Maps API v7)`)

        // Sử dụng address autocomplete endpoint (khuyến nghị)
        const url = `${API_BASE_URL}/api/address/autocomplete?input=${encodeURIComponent(input.trim())}`;
        console.log(`🌐 Frontend: Gọi API: ${url}`);

        const response = await fetch(url)

        console.log(`📡 Frontend: Response status: ${response.status}`);
        console.log(`📡 Frontend: Response ok: ${response.ok}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Frontend: HTTP error ${response.status}: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log(`📥 Frontend: Raw response:`, result);

        if (result.success && result.message) {
            console.log(`✅ Frontend: Nhận được ${result.message.predictions.length} gợi ý thông minh (${result.message.search_type})`)
            console.log(`📡 Sources: ${result.message.sources?.join(', ')}`)
            console.log(`🗺️ HERE API v7 Count: ${result.message.here_api_count}`)

            // Kiểm tra dữ liệu trước khi xử lý
            if (!result.message.predictions || !Array.isArray(result.message.predictions)) {
                console.error('❌ Frontend: Dữ liệu predictions không hợp lệ:', result.message.predictions)
                return {
                    success: false,
                    error: 'Dữ liệu không hợp lệ từ server'
                }
            }

            // Thêm metadata để UI biết cách hiển thị
            const enhancedPredictions = result.message.predictions.map((prediction, index) => {
                try {
                    return {
                        ...prediction,
                        // Xác định loại gợi ý để hiển thị icon phù hợp
                        suggestion_type: getSuggestionType(prediction, result.message.search_type),
                        // Format hiển thị đẹp hơn
                        display_text: formatDisplayText(prediction),
                        // Thêm icon tương ứng
                        icon: getSuggestionIcon(prediction, result.message.search_type),
                        // Thêm source info để debug
                        source_info: getSourceInfo(prediction.source),
                        // Đảm bảo có place_id
                        place_id: prediction.place_id || `smart_${Date.now()}_${index}`,
                        // Đảm bảo có structured_formatting
                        structured_formatting: prediction.structured_formatting || {
                            main_text: prediction.description || prediction.main_text || 'Địa chỉ',
                            secondary_text: prediction.secondary_text || ''
                        }
                    };
                } catch (error) {
                    console.error(`❌ Lỗi khi xử lý prediction ${index}:`, error, prediction);
                    // Trả về prediction gốc nếu có lỗi
                    return {
                        ...prediction,
                        place_id: prediction.place_id || `error_${Date.now()}_${index}`,
                        structured_formatting: {
                            main_text: prediction.description || 'Địa chỉ',
                            secondary_text: ''
                        }
                    };
                }
            }).filter(Boolean); // Loại bỏ các prediction null/undefined

            console.log(`🔧 Frontend: Enhanced ${enhancedPredictions.length} predictions`)

            return {
                success: true,
                data: {
                    predictions: enhancedPredictions,
                    search_type: result.message.search_type,
                    sources: result.message.sources || [],
                    total_count: enhancedPredictions.length,
                    here_api_count: result.message.here_api_count || 0,
                    smart_count: result.message.smart_count || 0,
                    performance: result.message.performance || {}
                }
            }
        }

        console.log('❌ Frontend: Response không thành công hoặc không có message');
        return result
    } catch (error) {
        console.error('❌ Error in getAddressSuggestions:', error)
        return {
            success: false,
            error: 'Lỗi khi lấy gợi ý địa chỉ thông minh. Vui lòng thử lại.'
        }
    }
}

/**
 * Xác định loại gợi ý để hiển thị UI phù hợp
 * Cập nhật để xử lý logic gợi ý thông minh mới và HERE Maps API v7
 */
const getSuggestionType = (prediction, searchType) => {
    // Ưu tiên suggestion_type từ backend nếu có
    if (prediction.suggestion_type) {
        return prediction.suggestion_type;
    }

    // Xử lý các source mới từ logic gợi ý thông minh
    if (prediction.source === 'smart_suggestions') {
        return 'address'; // Gợi ý đường phố thông minh
    }

    if (prediction.source === 'smart_places') {
        return 'business'; // Gợi ý địa điểm thông minh
    }

    if (prediction.source === 'smart_numbers') {
        return 'address'; // Gợi ý số nhà thông minh
    }

    // Xử lý HERE API v7 results
    if (prediction.source.startsWith('here_')) {
        if (prediction.types) {
            if (prediction.types.includes('establishment')) return 'business';
            if (prediction.types.includes('route')) return 'street';
            if (prediction.types.includes('street_address')) return 'address';
            if (prediction.types.includes('shopping_mall')) return 'poi';
            if (prediction.types.includes('hospital')) return 'poi';
            if (prediction.types.includes('university')) return 'poi';
        }
    }

    // Fallback dựa trên search type
    if (searchType === 'here_primary' || searchType === 'here_api_v7') {
        if (prediction.types?.includes('establishment')) {
            return 'business';
        }
        return 'address';
    }

    return 'address'; // Địa chỉ chung
}

/**
 * Format text hiển thị đẹp hơn
 */
const formatDisplayText = (prediction) => {
    if (prediction.structured_formatting) {
        return {
            main: prediction.structured_formatting.main_text,
            secondary: prediction.structured_formatting.secondary_text
        }
    }

    return {
        main: prediction.description,
        secondary: ''
    }
}

/**
 * Chọn icon phù hợp cho từng loại gợi ý
 * Cập nhật để xử lý logic gợi ý thông minh mới và HERE Maps API v7
 */
const getSuggestionIcon = (prediction, searchType) => {
    // Ưu tiên icon từ backend nếu có
    if (prediction.icon) {
        return prediction.icon;
    }

    // Logic mới dựa trên source và suggestion_type
    if (prediction.source === 'smart_suggestions') {
        return '🏠'; // Icon cho gợi ý đường phố thông minh
    }

    if (prediction.source === 'smart_places') {
        // Icon dựa trên tên địa điểm
        const name = prediction.structured_formatting?.main_text?.toLowerCase() || '';
        if (name.includes('landmark')) return '🏨';
        if (name.includes('coffee') || name.includes('highland')) return '☕';
        if (name.includes('bún') || name.includes('bun')) return '🍜';
        return '🏢';
    }

    if (prediction.source === 'smart_numbers') {
        return '🏠'; // Icon cho gợi ý số nhà thông minh
    }

    // Logic cho HERE API v7 results
    if (prediction.source.startsWith('here_')) {
        if (prediction.suggestion_type) {
            const typeIconMap = {
                'poi': '🏢',
                'street_address': '🏠',
                'street': '🛣️',
                'business': '🏪',
                'address': '📍',
                'houseNumber': '🏠',
                'locality': '📍',
                'administrativeArea': '🏛️',
                'postalCode': '📮',
                'intersection': '🚦',
                'addressBlock': '🏘️'
            };
            if (typeIconMap[prediction.suggestion_type]) {
                return typeIconMap[prediction.suggestion_type];
            }
        }
    }

    // Fallback dựa trên types
    if (prediction.types) {
        if (prediction.types.includes('establishment')) return '🏢';
        if (prediction.types.includes('route')) return '🛣️';
        if (prediction.types.includes('street_address')) return '🏠';
    }

    return '📍'; // Icon mặc định
}

/**
 * Lấy thông tin source để hiển thị
 * Cập nhật để hiển thị HERE Maps API v7
 */
const getSourceInfo = (source) => {
    const sourceMap = {
        'here_geocoding': 'HERE Maps API v7',
        'here_discover': 'HERE Discover API v7',
        'here_autosuggest': 'HERE Autosuggest API v7',
        'here_browse': 'HERE Browse API v7',
        'smart_suggestions': 'Gợi ý thông minh',
        'smart_places': 'Địa điểm thông minh',
        'smart_numbers': 'Số nhà thông minh'
    };
    return sourceMap[source] || source;
}

/**
 * So sánh địa chỉ khách hàng với cửa hàng
 * Sử dụng HERE API v7 + Logic gợi ý thông minh
 * @param {string} customerAddress - Địa chỉ khách hàng
 * @returns {Promise<Object>} Kết quả so sánh
 */
export const compareAddress = async (customerAddress) => {
    try {
        console.log(`🔍 Frontend: So sánh địa chỉ sử dụng HERE Maps API v7 cho "${customerAddress}"`)

        // Sử dụng address compare endpoint (khuyến nghị)
        const response = await fetch(`${API_BASE_URL}/api/address/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerAddress: customerAddress.trim()
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
            console.log(`✅ Frontend: HERE Maps API v7 tính toán thành công - Khoảng cách: ${result.data.distance}km`)
            console.log(`💰 Phí ship: ${result.data.shippingFee === 0 ? 'Miễn phí' : result.data.shippingFee + 'đ'}`)
        } else {
            console.log(`❌ Frontend: HERE Maps API v7 lỗi - ${result.error}`)
        }

        return result
    } catch (error) {
        console.error('Error in compareAddress:', error)
        return {
            success: false,
            error: 'Lỗi khi so sánh địa chỉ. Vui lòng thử lại.'
        }
    }
}

/**
 * Validate địa chỉ đầu vào
 * @param {string} address - Địa chỉ cần validate
 * @returns {Object} Kết quả validate
 */
export const validateAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return {
            isValid: false,
            error: 'Địa chỉ không được để trống'
        }
    }

    const trimmedAddress = address.trim()

    if (trimmedAddress.length < 10) {
        return {
            isValid: false,
            error: 'Địa chỉ quá ngắn. Vui lòng nhập địa chỉ chi tiết hơn'
        }
    }

    if (trimmedAddress.length > 200) {
        return {
            isValid: false,
            error: 'Địa chỉ quá dài. Vui lòng nhập địa chỉ ngắn gọn hơn'
        }
    }

    return {
        isValid: true,
        address: trimmedAddress
    }
}

/**
 * Format thông tin kết quả so sánh địa chỉ
 * @param {Object} data - Dữ liệu từ API
 * @returns {string} Chuỗi thông tin đã format
 */
export const formatAddressResult = (data) => {
    let info = `📍 Địa chỉ của bạn: ${data.customerAddress}\n`
    info += `📏 Khoảng cách: ${data.distance}km\n`
    info += `💰 Phí vận chuyển: ${data.shippingFee === 0 ? 'Miễn phí' : data.shippingFee.toLocaleString() + 'đ'}\n`
    info += `⏰ Thời gian giao hàng: ${data.deliveryTime}\n`

    if (!data.canDeliver) {
        info += `⚠️ Xin lỗi, chúng tôi chưa giao hàng đến khu vực này`
    } else {
        info += `✅ Chúng tôi có thể giao hàng đến địa chỉ này`
    }

    return info
}

/**
 * Lấy thông tin cửa hàng
 * @returns {Promise<Object>} Thông tin cửa hàng
 */
export const getStoreInfo = async () => {
    try {
        console.log('🔍 Frontend: Lấy thông tin cửa hàng')

        const response = await fetch(`${API_BASE_URL}/api/address/store-info`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
            console.log(`✅ Frontend: Lấy thông tin cửa hàng thành công - ${result.data.name}`)
        } else {
            console.log(`❌ Frontend: Lỗi lấy thông tin cửa hàng - ${result.error}`)
        }

        return result
    } catch (error) {
        console.error('Error in getStoreInfo:', error)
        return {
            success: false,
            error: 'Lỗi khi lấy thông tin cửa hàng. Vui lòng thử lại.'
        }
    }
}

/**
 * Lấy gợi ý địa chỉ từ HERE Maps API v7 trực tiếp (nếu cần)
 * @param {string} input - Input từ người dùng
 * @returns {Promise<Object>} Danh sách gợi ý từ HERE Maps API v7
 */
export const getHereApiSuggestions = async (input) => {
    try {
        if (!input || input.trim().length < 2) {
            return {
                success: true,
                data: {
                    predictions: [],
                    search_type: 'none'
                }
            }
        }

        console.log(`🔍 Frontend: Tìm gợi ý HERE Maps API v7 trực tiếp cho "${input}"`)

        const response = await fetch(`${API_BASE_URL}/api/here/autocomplete?input=${encodeURIComponent(input.trim())}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
            console.log(`✅ Frontend: HERE Maps API v7 trực tiếp - ${result.data.predictions.length} gợi ý`)
        }

        return result
    } catch (error) {
        console.error('Error in getHereApiSuggestions:', error)
        return {
            success: false,
            error: 'Lỗi khi lấy gợi ý HERE Maps API v7 trực tiếp. Vui lòng thử lại.'
        }
    }
}

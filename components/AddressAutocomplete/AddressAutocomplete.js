/**
 * AddressAutocomplete Component
 * Sử dụng HERE API v7 + Logic gợi ý thông minh từ backend
 * Tuân thủ 100% tài liệu HERE Maps API v7 (7.141)
 */

import React, { useState, useEffect, useRef } from 'react';
import { getAddressSuggestions } from '../../services/addressService';
import styles from './AddressAutocomplete.module.css';

export default function AddressAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Nhập địa chỉ của bạn...",
    className = ""
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [sources, setSources] = useState([]);
    const [hereApiCount, setHereApiCount] = useState(0);
    const [smartCount, setSmartCount] = useState(0);
    const [performance, setPerformance] = useState({});
    const wrapperRef = useRef(null);

    // Debounce function để tránh gọi API quá nhiều
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Fetch suggestions from API
    const fetchSuggestions = async (input) => {
        if (!input || input.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        console.log(`🔍 AddressAutocomplete: Bắt đầu tìm kiếm cho "${input}"`);

        try {
            const result = await getAddressSuggestions(input);
            console.log(`📥 AddressAutocomplete: Kết quả từ service:`, result);

            if (result.success && result.data && result.data.predictions) {
                const predictions = Array.isArray(result.data.predictions) ? result.data.predictions : [];

                // Kiểm tra và làm sạch dữ liệu
                const cleanPredictions = predictions.filter(prediction => {
                    try {
                        if (!prediction) {
                            console.log('⚠️ Bỏ qua prediction null/undefined');
                            return false;
                        }
                        if (!prediction.description && !prediction.structured_formatting) {
                            console.log('⚠️ Bỏ qua prediction thiếu description và structured_formatting:', prediction);
                            return false;
                        }
                        // Kiểm tra thêm các trường cần thiết
                        if (!prediction.place_id) {
                            console.log('⚠️ Prediction thiếu place_id, tự tạo:', prediction);
                            prediction.place_id = `auto_${Date.now()}_${Math.random()}`;
                        }
                        return true;
                    } catch (error) {
                        console.error('❌ Lỗi khi kiểm tra prediction:', error, prediction);
                        return false;
                    }
                });

                console.log(`🧹 AddressAutocomplete: Làm sạch dữ liệu: ${predictions.length} → ${cleanPredictions.length}`);

                setSuggestions(cleanPredictions);
                setSearchType(result.data.search_type || '');
                setSources(result.data.sources || []);
                setHereApiCount(result.data.here_api_count || 0);
                setSmartCount(result.data.smart_count || 0);
                setPerformance(result.data.performance || {});
                setShowSuggestions(cleanPredictions.length > 0);

                console.log(`🔍 AddressAutocomplete: ${cleanPredictions.length} gợi ý (${result.data.search_type})`);
                console.log(`📡 Sources: ${result.data.sources?.join(', ')}`);
                console.log(`🗺️ HERE API v7: ${result.data.here_api_count}, 🧠 Smart: ${result.data.smart_count}`);

                if (cleanPredictions.length === 0) {
                    console.log('⚠️ AddressAutocomplete: Không có gợi ý hợp lệ sau khi làm sạch dữ liệu');
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
                console.log('❌ AddressAutocomplete: Không có kết quả hoặc dữ liệu không hợp lệ');
                if (result.error) {
                    console.error('❌ Lỗi từ service:', result.error);
                }
            }
        } catch (error) {
            console.error('❌ Lỗi AddressAutocomplete:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setLoading(false);
        }
    };

    // Debounced version của fetchSuggestions
    const debouncedFetchSuggestions = useRef(
        debounce(fetchSuggestions, 300)
    ).current;

    // Handle input change
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue.trim().length >= 2) {
            debouncedFetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle key down
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && suggestions.length > 0) {
            selectSuggestion(suggestions[0]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Select suggestion
    const selectSuggestion = (suggestion) => {
        console.log(`✅ AddressAutocomplete: Chọn gợi ý "${suggestion.structured_formatting?.main_text || suggestion.description}"`);
        console.log(`📍 Source: ${suggestion.source}, Type: ${suggestion.suggestion_type}, Icon: ${suggestion.icon}`);

        // Format địa chỉ đầy đủ
        let fullAddress = '';
        if (suggestion.structured_formatting) {
            fullAddress = `${suggestion.structured_formatting.main_text}`;
            if (suggestion.structured_formatting.secondary_text) {
                fullAddress += `, ${suggestion.structured_formatting.secondary_text}`;
            }
        } else {
            fullAddress = suggestion.description;
        }

        onChange(fullAddress);
        onSelect(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get CSS class cho loại gợi ý
    const getSuggestionTypeClass = (types) => {
        if (!types || types.length === 0) return styles.suggestionDefault;

        const type = types[0];
        switch (type) {
            case 'business':
            case 'establishment':
            case 'point_of_interest':
                return styles.suggestionBusiness;
            case 'street':
            case 'route':
                return styles.suggestionStreet;
            case 'address':
            case 'street_address':
            case 'houseNumber':
                return styles.suggestionAddress;
            case 'locality':
            case 'administrative_area':
                return styles.suggestionArea;
            default:
                return styles.suggestionDefault;
        }
    };

    // Get label cho loại gợi ý
    const getSuggestionTypeLabel = (types) => {
        if (!types || types.length === 0) return 'Địa chỉ';

        const type = types[0];
        switch (type) {
            case 'business':
            case 'establishment':
            case 'point_of_interest':
                return 'Địa điểm';
            case 'street':
            case 'route':
                return 'Đường phố';
            case 'address':
            case 'street_address':
            case 'houseNumber':
                return 'Địa chỉ';
            case 'locality':
            case 'administrative_area':
                return 'Khu vực';
            default:
                return 'Địa chỉ';
        }
    };

    return (
        <div className={`${styles.autocompleteContainer} ${className}`} ref={wrapperRef}>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={styles.input}
                    autoComplete="off"
                />
                {loading && (
                    <div className={styles.loadingIndicator}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>



            {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown}>
                    {/* Header với thông tin tìm kiếm */}
                    <div className={styles.searchInfoHeader}>
                        <div className={styles.searchStats}>
                            <span className={styles.searchType}>
                                🔍 {searchType === 'here_primary' ? 'HERE API v7 + Smart Logic' :
                                    searchType === 'here_api_v7' ? 'HERE API v7' :
                                        searchType === 'smart_only' ? 'Smart Logic' : 'Tìm kiếm'}
                            </span>
                            <span className={styles.resultCount}>
                                📊 {suggestions.length} kết quả
                            </span>
                        </div>

                        {/* Sources info */}
                        <div className={styles.sourceInfo}>
                            <span className={styles.sourceLabel}>
                                🗺️ HERE API v7: {hereApiCount}
                            </span>
                            {smartCount > 0 && (
                                <span className={styles.sourceLabel}>
                                    🧠 Smart: {smartCount}
                                </span>
                            )}
                            {performance.response_time && (
                                <span className={styles.sourceLabel}>
                                    ⚡ {performance.response_time}ms
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Suggestions list */}
                    <div>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion.place_id || index}
                                className={`${styles.suggestionItem} ${getSuggestionTypeClass(suggestion.types)}`}
                                onClick={() => selectSuggestion(suggestion)}
                            >
                                <div className={styles.suggestionContent}>
                                    <div className={styles.suggestionIcon}>
                                        {suggestion.icon || '📍'}
                                    </div>
                                    <div className={styles.textContainer}>
                                        <div className={styles.mainText}>
                                            {suggestion.structured_formatting?.main_text || suggestion.description}
                                        </div>
                                        <div className={styles.secondaryText}>
                                            {suggestion.structured_formatting?.secondary_text || ''}
                                        </div>
                                    </div>
                                    <div className={styles.typeIndicator}>
                                        <span className={styles.typeLabel}>
                                            {getSuggestionTypeLabel(suggestion.types)}
                                        </span>
                                        <span className={styles.sourceTag}>
                                            {suggestion.source === 'here_geocoding' ? '🗺️ HERE' :
                                                suggestion.source === 'here_discover' ? '🔍 HERE' :
                                                    suggestion.source === 'here_autosuggest' ? '💡 HERE' :
                                                        suggestion.source === 'smart_suggestions' ? '🧠 Smart' :
                                                            suggestion.source === 'smart_places' ? '🏢 Smart' :
                                                                suggestion.source === 'smart_numbers' ? '🏠 Smart' : '📍'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer với thông tin bổ sung */}
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #dee2e6', background: '#f8f9fa', borderRadius: '0 0 8px 8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            💡 Sử dụng HERE Maps API v7 + Logic gợi ý thông minh
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './HereMap.module.css'

const HereMap = ({
    origin = { lat: 10.78869, lng: 106.64963 }, // Tọa độ cửa hàng
    destination = null, // Tọa độ khách hàng (nếu có)
    height = 300,
    showRoute = false // Có hiển thị đường đi không
}) => {
    const mapRef = useRef(null)
    const [map, setMap] = useState(null)
    const [route, setRoute] = useState(null)
    const isInitializedRef = useRef(false) // Sử dụng useRef thay vì useState
    const scriptsLoadedRef = useRef(false) // Kiểm tra scripts đã load chưa

    // Debug props values
    console.log('🗺️ HereMap component props:', {
        origin,
        destination,
        height,
        showRoute,
        destinationType: typeof destination,
        showRouteType: typeof showRoute,
        destinationValue: destination,
        showRouteValue: showRoute,
        destinationNull: destination === null,
        destinationUndefined: destination === undefined,
        showRouteNull: showRoute === null,
        showRouteUndefined: showRoute === undefined,
        showRouteBoolean: Boolean(showRoute)
    })

    useEffect(() => {
        console.log('🗺️ HereMap useEffect triggered:', { origin, destination, showRoute, isInitialized: isInitializedRef.current })

        // Ngăn chặn mount nhiều lần
        if (isInitializedRef.current) {
            console.log('🚫 HereMap đã được khởi tạo, bỏ qua')
            return
        }

        // Kiểm tra xem HERE Maps API đã được load chưa
        if (typeof H === 'undefined') {
            if (scriptsLoadedRef.current) {
                console.log('🚫 Scripts đang được load, bỏ qua')
                return
            }

            console.log('🗺️ Loading HERE Maps API...')
            scriptsLoadedRef.current = true

            const script = document.createElement('script')
            script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js'
            script.async = true
            script.onload = () => {
                console.log('✅ HERE Maps Core loaded')
                const uiScript = document.createElement('script')
                uiScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js'
                uiScript.async = true
                uiScript.onload = () => {
                    console.log('✅ HERE Maps UI loaded')
                    const serviceScript = document.createElement('script')
                    serviceScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js'
                    serviceScript.async = true
                    serviceScript.onload = () => {
                        console.log('✅ HERE Maps Service loaded')
                        const maEventsScript = document.createElement('script')
                        maEventsScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
                        maEventsScript.async = true
                        maEventsScript.onload = () => {
                            console.log('✅ HERE Maps Events loaded')
                            initMap()
                        }
                        maEventsScript.onerror = (error) => {
                            console.error('❌ HERE Maps Events failed to load:', error)
                        }
                        document.head.appendChild(maEventsScript)
                    }
                    serviceScript.onerror = (error) => {
                        console.error('❌ HERE Maps Service failed to load:', error)
                    }
                    document.head.appendChild(serviceScript)
                }
                uiScript.onerror = (error) => {
                    console.error('❌ HERE Maps UI failed to load:', error)
                }
                document.head.appendChild(uiScript)
            }
            script.onerror = (error) => {
                console.error('❌ HERE Maps Core failed to load:', error)
            }
            document.head.appendChild(script)
        } else {
            console.log('✅ HERE Maps API already loaded')
            initMap()
        }
    }, []) // Chỉ chạy 1 lần khi component mount

    // useEffect riêng để xử lý destination changes
    useEffect(() => {
        console.log('🗺️ Destination useEffect triggered:', {
            destination,
            showRoute,
            map: !!map,
            isInitialized: isInitializedRef.current,
            destinationType: typeof destination,
            destinationValue: destination,
            showRouteType: typeof showRoute,
            showRouteValue: showRoute
        })

        if (map && destination && showRoute && isInitializedRef.current) {
            console.log('✅ All conditions met, calling updateMapWithDestination')
            console.log('🗺️ Destination changed, updating map:', { destination, showRoute })
            updateMapWithDestination()
        } else {
            console.log('❌ Conditions not met:', {
                hasMap: !!map,
                hasDestination: !!destination,
                hasShowRoute: !!showRoute,
                isInitialized: isInitializedRef.current
            })
        }
    }, [destination, showRoute, map])

    const initMap = () => {
        console.log('🗺️ initMap called with:', { origin, destination, showRoute })

        if (!mapRef.current) {
            console.error('❌ mapRef.current is null')
            return
        }

        if (typeof H === 'undefined') {
            console.error('❌ HERE Maps API (H) is undefined')
            return
        }

        try {
            console.log('🗺️ Initializing HERE Maps platform...')

            // Khởi tạo platform
            const platform = new H.service.Platform({
                apikey: 'pQX-c_OVXtJ_jiJ4N7EMsiUxWNdjgsJqq1Sh4Pdy9w4'
            })
            console.log('✅ Platform created')

            // Lấy default map types từ platform
            const defaultLayers = platform.createDefaultLayers()
            console.log('✅ Default layers created')

            // Khởi tạo map
            const newMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
                center: origin,
                zoom: 12, // Giảm zoom để hiển thị rộng hơn
                pixelRatio: window.devicePixelRatio || 1
            })
            console.log('✅ Map created')

            // Thêm UI controls - Sử dụng try-catch riêng
            try {
                const ui = H.ui.UI.createDefault(newMap, defaultLayers, 'vi-VN')
                ui.getControl('mapsettings').setAlignment('top-left')
                ui.getControl('zoom').setAlignment('top-left')
                ui.getControl('scalebar').setAlignment('bottom-left')
                console.log('✅ UI controls added')

                // Thêm map events để có thể tương tác
                const mapEvents = new H.mapevents.MapEvents(newMap)
                const behavior = new H.mapevents.Behavior(mapEvents)
                console.log('✅ Map events and behavior added')

            } catch (uiError) {
                console.warn('⚠️ UI controls failed, continuing without UI:', uiError)

                // Fallback: Thêm map events cơ bản
                try {
                    const mapEvents = new H.mapevents.MapEvents(newMap)
                    const behavior = new H.mapevents.Behavior(mapEvents)
                    console.log('✅ Map events and behavior added (fallback)')
                } catch (eventsError) {
                    console.warn('⚠️ Map events also failed:', eventsError)
                }
            }

            // Thêm marker cho cửa hàng - Sử dụng try-catch riêng
            try {
                console.log('📍 Adding store marker at:', origin)
                const storeMarker = new H.map.Marker(origin, {
                    icon: new H.map.Icon('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRjQ0NDQiLz4KPHBhdGggZD0iTTEyIDZDNi40OCAyIDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K')
                })
                newMap.addObject(storeMarker)
                console.log('✅ Store marker added')
            } catch (markerError) {
                console.warn('⚠️ Store marker failed:', markerError)
            }

            // Thêm label cho cửa hàng - Sử dụng try-catch riêng và CSS fallback
            try {
                const storeLabel = new H.map.DomMarker(origin, {
                    label: {
                        text: '🏪 Cửa hàng',
                        className: styles.storeLabel || 'store-label-fallback'
                    }
                })
                newMap.addObject(storeLabel)
                console.log('✅ Store label added')
            } catch (labelError) {
                console.warn('⚠️ Store label failed, trying without CSS class:', labelError)
                try {
                    const storeLabel = new H.map.DomMarker(origin, {
                        label: {
                            text: '🏪 Cửa hàng'
                        }
                    })
                    newMap.addObject(storeLabel)
                    console.log('✅ Store label added (without CSS class)')
                } catch (fallbackError) {
                    console.warn('⚠️ Store label fallback also failed:', fallbackError)
                }
            }

            // Nếu có địa chỉ đích và muốn hiển thị đường đi
            console.log('🔍 Checking destination in initMap:', {
                destination,
                showRoute,
                hasDestination: !!destination,
                hasShowRoute: !!showRoute,
                destinationType: typeof destination,
                showRouteType: typeof showRoute
            })
            if (destination && showRoute) {
                console.log('✅ Destination and showRoute both true, calling addCustomerMarkerAndRoute')
                addCustomerMarkerAndRoute(newMap, platform, origin, destination)
            } else {
                console.log('❌ Destination or showRoute is false:', {
                    destination: !!destination,
                    showRoute: !!showRoute
                })
            }

            // Fit map để hiển thị tất cả markers với padding
            if (destination) {
                try {
                    const bounds = new H.geo.Rect(
                        Math.min(origin.lat, destination.lat) - 0.01,
                        Math.min(origin.lng, destination.lng) - 0.01,
                        Math.max(origin.lat, destination.lat) + 0.01,
                        Math.max(origin.lng, destination.lng) + 0.01
                    )
                    newMap.getViewModel().setLookAtData({ bounds })
                    console.log('✅ Map fitted to markers with padding')
                } catch (fitError) {
                    console.warn('⚠️ Map fit failed:', fitError)
                }
            } else {
                // Nếu không có destination, fit map vào store location với zoom phù hợp
                try {
                    newMap.getViewModel().setLookAtData({
                        center: origin,
                        zoom: 14
                    })
                    console.log('✅ Map centered on store location')
                } catch (centerError) {
                    console.warn('⚠️ Map center failed:', centerError)
                }
            }

            // QUAN TRỌNG: Set map và isInitialized TRƯỚC KHI return
            setMap(newMap)
            isInitializedRef.current = true // Đánh dấu đã khởi tạo
            console.log('✅ HereMap initialization completed')
            console.log('✅ isInitializedRef.current =', isInitializedRef.current)

        } catch (error) {
            console.error('❌ Lỗi khởi tạo HERE Maps:', error)
            console.error('❌ Error stack:', error.stack)
            // Đảm bảo không set isInitialized nếu có lỗi
            isInitializedRef.current = false
        }
    }

    const addCustomerMarkerAndRoute = (mapInstance, platform, start, end) => {
        console.log('📍 addCustomerMarkerAndRoute called with:', {
            mapInstance: !!mapInstance,
            platform: !!platform,
            start,
            end
        })

        try {
            // Thêm marker cho địa chỉ khách hàng
            console.log('📍 Adding customer marker at:', end)
            const customerMarker = new H.map.Marker(end, {
                icon: new H.map.Icon('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRjQ0NDQiLz4KPHBhdGggZD0iTTEyIDZDNi40OCAyIDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K')
            })
            mapInstance.addObject(customerMarker)
            console.log('✅ Customer marker added')

            // Thêm label cho khách hàng - Sử dụng CSS fallback
            try {
                console.log('📍 Adding customer label at:', end)
                const customerLabel = new H.map.DomMarker(end, {
                    label: {
                        text: '📍 Khách hàng',
                        className: styles.customerLabel || 'customer-label-fallback'
                    }
                })
                mapInstance.addObject(customerLabel)
                console.log('✅ Customer label added')
            } catch (labelError) {
                console.warn('⚠️ Customer label failed, trying without CSS class:', labelError)
                try {
                    const customerLabel = new H.map.DomMarker(end, {
                        label: {
                            text: '📍 Khách hàng'
                        }
                    })
                    mapInstance.addObject(customerLabel)
                    console.log('✅ Customer label added (without CSS class)')
                } catch (fallbackError) {
                    console.warn('⚠️ Customer label fallback also failed:', fallbackError)
                }
            }

            // Tính toán và hiển thị đường đi
            console.log('🗺️ Starting route calculation...')
            calculateAndDisplayRoute(mapInstance, platform, start, end)
        } catch (error) {
            console.error('❌ Lỗi thêm customer marker:', error)
        }
    }

    const updateMapWithDestination = () => {
        console.log('🔍 updateMapWithDestination called with:', {
            map: !!map,
            destination: !!destination,
            showRoute,
            isInitialized: isInitializedRef.current,
            destinationDetails: destination,
            showRouteDetails: showRoute
        })

        if (!map || !destination || !showRoute) {
            console.log('❌ updateMapWithDestination: Missing required data:', {
                map: !!map,
                destination: !!destination,
                showRoute,
                isInitialized: isInitializedRef.current
            })
            return
        }

        if (!isInitializedRef.current) {
            console.log('❌ updateMapWithDestination: Map not initialized yet')
            return
        }

        console.log('🗺️ Updating map with destination:', { destination, showRoute })

        try {
            // Xóa route cũ nếu có
            if (route) {
                map.removeObject(route)
                setRoute(null)
            }

            // QUAN TRỌNG: Tạo platform mới để truyền vào addCustomerMarkerAndRoute
            const platform = new H.service.Platform({
                apikey: 'pQX-c_OVXtJ_jiJ4N7EMsiUxWNdjgsJqq1Sh4Pdy9w4'
            })
            console.log('✅ Platform created for route calculation')

            // Thêm customer marker và route
            addCustomerMarkerAndRoute(map, platform, origin, destination)

            // Fit map để hiển thị tất cả markers
            map.getViewModel().setLookAtData({
                bounds: new H.geo.Rect(
                    Math.min(origin.lat, destination.lat) - 0.01,
                    Math.min(origin.lng, destination.lng) - 0.01,
                    Math.max(origin.lat, destination.lat) + 0.01,
                    Math.max(origin.lng, destination.lng) + 0.01
                )
            })
            console.log('✅ Map updated with destination bounds')
        } catch (error) {
            console.error('❌ Lỗi cập nhật map:', error)
        }
    }

    const calculateAndDisplayRoute = async (mapInstance, platform, start, end) => {
        console.log('🗺️ calculateAndDisplayRoute called with:', {
            mapInstance: !!mapInstance,
            platform: !!platform,
            start,
            end
        })

        try {
            // Sử dụng HERE Routing API v8
            const routingUrl = `https://router.hereapi.com/v8/routes?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&transportMode=car&return=summary,polyline&units=metric&alternatives=0&lang=vi-VN&avoid=tollRoad,ferry&routingMode=fast&apiKey=pQX-c_OVXtJ_jiJ4N7EMsiUxWNdjgsJqq1Sh4Pdy9w4`
            console.log('🌐 Routing URL:', routingUrl)
            console.log('📡 Starting HERE Routing API call...')

            const response = await fetch(routingUrl)
            console.log('📡 Routing API response status:', response.status)
            if (!response.ok) {
                throw new Error(`Routing API error: ${response.status}`)
            }

            const data = await response.json()
            console.log('📊 Routing API response data:', data)
            console.log('🔍 Response structure:', Object.keys(data))

            if (data.routes && data.routes.length > 0) {
                console.log('✅ Routes found:', data.routes.length)
                const route = data.routes[0]
                const section = route.sections[0]
                console.log('📊 Route section:', section)
                console.log('🔍 Section keys:', Object.keys(section))
                console.log('🔍 Section polyline type:', typeof section.polyline)
                console.log('🔍 Section polyline length:', section.polyline ? section.polyline.length : 'undefined')
                console.log('🔍 Section polyline preview:', section.polyline ? section.polyline.substring(0, 100) + '...' : 'undefined')

                // Tạo polyline từ route
                console.log('🔍 Checking polyline:', section.polyline ? 'exists' : 'missing')
                if (section.polyline) {
                    try {
                        // Sử dụng thuật toán polyline decode chính xác từ HERE API
                        console.log('🔍 Starting polyline decode, length:', section.polyline.length)
                        console.log('🔍 Raw polyline string:', section.polyline)

                        const coordinates = []
                        const points = section.polyline
                        let lat = 0, lng = 0
                        let i = 0

                        // HERE API sử dụng Google Polyline format
                        while (i < points.length) {
                            // Decode latitude
                            let shift = 0, result = 0
                            let byte

                            do {
                                if (i >= points.length) break
                                byte = points.charCodeAt(i++) - 63
                                result |= (byte & 0x1f) << shift
                                shift += 5
                            } while (byte >= 0x20 && i < points.length)

                            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
                            lat += dlat

                            // Decode longitude
                            shift = 0
                            result = 0

                            do {
                                if (i >= points.length) break
                                byte = points.charCodeAt(i++) - 63
                                result |= (byte & 0x1f) << shift
                                shift += 5
                            } while (byte >= 0x20 && i < points.length)

                            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
                            lng += dlng

                            // Convert to decimal degrees
                            const finalLat = lat / 1e5
                            const finalLng = lng / 1e5

                            // Kiểm tra coordinates hợp lệ
                            if (Math.abs(finalLat) <= 90 && Math.abs(finalLng) <= 180) {
                                coordinates.push({ lat: finalLat, lng: finalLng })
                                console.log(`🔍 Decoded point ${coordinates.length}: lat=${finalLat}, lng=${finalLng}`)
                            } else {
                                console.warn(`⚠️ Skipping invalid coordinate: lat=${finalLat}, lng=${finalLng}`)
                            }
                        }

                        console.log('🔍 Decoded coordinates:', coordinates.length, 'points')
                        console.log('🔍 First coordinate:', coordinates[0])
                        console.log('🔍 Last coordinate:', coordinates[coordinates.length - 1])
                        console.log('🔍 Sample coordinates:', coordinates.slice(0, 5))
                        console.log('🔍 All coordinates:', coordinates)

                        // Kiểm tra số lượng coordinates hợp lệ
                        if (coordinates.length < 2) {
                            console.warn(`⚠️ Polyline decode failed: only ${coordinates.length} valid coordinates`)
                            console.warn('⚠️ Raw polyline string:', section.polyline)
                            console.warn('⚠️ Polyline length:', section.polyline.length)
                            throw new Error(`Polyline decode failed: only ${coordinates.length} valid coordinates`)
                        }

                        // Kiểm tra coordinates có nằm trong vùng hợp lệ không
                        const validCoordinates = coordinates.filter(coord =>
                            coord.lat >= 10.5 && coord.lat <= 11.0 &&
                            coord.lng >= 106.5 && coord.lng <= 107.0
                        )

                        if (validCoordinates.length < 2) {
                            console.warn(`⚠️ Too many coordinates outside valid area: ${validCoordinates.length}/${coordinates.length}`)
                            throw new Error(`Too many coordinates outside valid area: ${validCoordinates.length}/${coordinates.length}`)
                        }

                        console.log(`✅ Found ${validCoordinates.length} valid coordinates in area`)

                        // Tạo polyline trên map
                        console.log('🎨 Creating polyline with coordinates:', validCoordinates.length)
                        const polyline = new H.map.Polyline(validCoordinates, {
                            style: {
                                strokeColor: '#4CAF50',
                                lineWidth: 4,
                                lineDash: [10, 5]
                            }
                        })

                        mapInstance.addObject(polyline)
                        console.log('✅ Polyline added to map')
                        setRoute(route)

                        // Fit map để hiển thị toàn bộ route
                        try {
                            const bounds = new H.geo.Rect(
                                Math.min(...validCoordinates.map(c => c.lat)),
                                Math.min(...validCoordinates.map(c => c.lng)),
                                Math.max(...validCoordinates.map(c => c.lat)),
                                Math.max(...validCoordinates.map(c => c.lng))
                            )
                            mapInstance.getViewModel().setLookAtData({ bounds })
                            console.log('✅ Map fitted to route bounds')
                        } catch (fitError) {
                            console.warn('⚠️ Route fit failed:', fitError)
                        }

                    } catch (polylineError) {
                        console.warn('⚠️ Không thể decode polyline, thử algorithm khác...')
                        console.error('❌ Polyline error:', polylineError)

                        // Fallback: Thử algorithm khác
                        let alternativeSuccess = false
                        try {
                            console.log('🔄 Trying alternative polyline decode...')
                            const altCoordinates = []
                            const points = section.polyline
                            let lat = 0, lng = 0
                            let i = 0

                            while (i < points.length) {
                                // Decode latitude
                                let shift = 0, result = 0
                                let byte

                                do {
                                    if (i >= points.length) break
                                    byte = points.charCodeAt(i++) - 63
                                    result |= (byte & 0x1f) << shift
                                    shift += 5
                                } while (byte >= 0x20 && i < points.length)

                                const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
                                lat += dlat

                                // Decode longitude
                                shift = 0
                                result = 0

                                do {
                                    if (i >= points.length) break
                                    byte = points.charCodeAt(i++) - 63
                                    result |= (byte & 0x1f) << shift
                                    shift += 5
                                } while (byte >= 0x20 && i < points.length)

                                const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
                                lng += dlng

                                // Convert to decimal degrees
                                const finalLat = lat / 1e5
                                const finalLng = lng / 1e5

                                // Kiểm tra coordinates hợp lệ
                                if (Math.abs(finalLat) <= 90 && Math.abs(finalLng) <= 180) {
                                    altCoordinates.push({ lat: finalLat, lng: finalLng })
                                    console.log(`🔍 Alternative decode point ${altCoordinates.length}: lat=${finalLat}, lng=${finalLng}`)
                                } else {
                                    console.warn(`⚠️ Alternative decode: Skipping invalid coordinate: lat=${finalLat}, lng=${finalLng}`)
                                }
                            }

                            console.log('🔍 Alternative decode result:', altCoordinates.length, 'coordinates')
                            console.log('🔍 Alternative coordinates:', altCoordinates)

                            if (altCoordinates.length >= 2) {
                                // Kiểm tra coordinates có nằm trong vùng TPHCM không
                                const validAltCoordinates = altCoordinates.filter(coord =>
                                    coord.lat >= 10.5 && coord.lat <= 11.0 &&
                                    coord.lng >= 106.5 && coord.lng <= 107.0
                                )

                                if (validAltCoordinates.length >= 2) {
                                    console.log('✅ Alternative decode successful, creating polyline')
                                    console.log(`✅ Found ${validAltCoordinates.length} valid coordinates in TPHCM area`)

                                    const polyline = new H.map.Polyline(validAltCoordinates, {
                                        style: {
                                            strokeColor: '#4CAF50',
                                            lineWidth: 4,
                                            lineDash: [10, 5]
                                        }
                                    })

                                    mapInstance.addObject(polyline)
                                    console.log('✅ Alternative polyline added to map')
                                    setRoute(route)

                                    // Fit map để hiển thị toàn bộ route
                                    try {
                                        const bounds = new H.geo.Rect(
                                            Math.min(...validAltCoordinates.map(c => c.lat)),
                                            Math.min(...validAltCoordinates.map(c => c.lng)),
                                            Math.max(...validAltCoordinates.map(c => c.lat)),
                                            Math.max(...validAltCoordinates.map(c => c.lng))
                                        )
                                        mapInstance.getViewModel().setLookAtData({ bounds })
                                        console.log('✅ Map fitted to alternative route bounds')
                                    } catch (fitError) {
                                        console.warn('⚠️ Alternative route fit failed:', fitError)
                                    }

                                    alternativeSuccess = true
                                    return // QUAN TRỌNG: Return để không fallback
                                } else {
                                    console.warn(`⚠️ Alternative decode: Too many coordinates outside TPHCM area: ${validAltCoordinates.length}/${altCoordinates.length}`)
                                    console.warn('⚠️ Alternative coordinates outside area:', altCoordinates.filter(coord =>
                                        coord.lat < 10.5 || coord.lat > 11.0 ||
                                        coord.lng < 106.5 || coord.lng > 107.0
                                    ))
                                }
                            }
                        } catch (altError) {
                            console.warn('⚠️ Alternative decode also failed:', altError)
                        }

                        // Final fallback: chỉ khi cả main và alternative đều thất bại
                        if (!alternativeSuccess) {
                            console.log('🔄 Creating fallback simple route')
                            console.log('🔄 Fallback reason: Both main and alternative polyline decode failed')
                            console.log('🔄 Fallback coordinates:', [start, end])

                            const simpleRoute = new H.map.Polyline([start, end], {
                                style: {
                                    strokeColor: '#4CAF50',
                                    lineWidth: 4,
                                    lineDash: [10, 5]
                                }
                            })

                            mapInstance.addObject(simpleRoute)
                            console.log('✅ Fallback route added to map')
                            setRoute(route)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ Lỗi tính toán đường đi:', error)
            console.error('❌ Error details:', error.message, error.stack)
        }
    }

    return (
        <div className={styles.hereMapContainer}>
            <div
                ref={mapRef}
                className={styles.hereMap}
                style={{ height: `${height}px` }}
            />
            {route && (
                <div className={styles.routeInfo}>
                    <div className={styles.routeSummary}>
                        <span>📏 {(route.sections[0].travelSummary.length / 1000).toFixed(2)}km</span>
                        <span>⏱️ {Math.round(route.sections[0].travelSummary.duration / 60)} phút</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HereMap

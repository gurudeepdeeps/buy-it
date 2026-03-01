// Clear all items from the cart
function clearCart() {
    cart = [];
    saveState();
    window.dispatchEvent(new Event('cartUpdated'));
}
// shop.js - E-commerce State Management

// Initialize State
let cart = JSON.parse(localStorage.getItem('buyit_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('buyit_wishlist')) || [];
const BUYIT_REGULAR_PRICE_MULTIPLIER = 2.1451612903;

const BUYIT_PRODUCT_CATALOG = {
    'iphone-17-pro-max': { id: 'iphone-17-pro-max', title: 'iPhone 17 Pro Max', price: 130000, regularPrice: 149999, localImage: 'product-images/smartphones/iphone1.jpg', category: 'smartphones'},
    'titan-sport-v2': { id: 'titan-sport-v2', title: 'Titan Sport Active V2', price: 28967, regularPrice: 34999, localImage: 'product-images/wearables/iwatch1.jpg', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLvDKoi4zzOxtthUuIkDWpoamW-x_fQcJEenQ8eWiqnyVLfQMdcrpsuLly_lrUhZs3d6rDOKciRa-9KLqKzuX7i2IuZMZ6po08oAKXGIWAEC1EzyElHQfYru--gHp5ZLiiq1T_pRDM4SNohZIXPpNWeHc1mide9BXN9wMGZbaU4c0BvKMku1QVkBCjgcwUdEIKFVgaxKK0CWMNQQ4OSbAqJLDRxVKLsmPNS6YBxgln_7oDra8AlLxzSR0vXVxi9wpnu2AKpifrHwku', category: 'Wearables', brand: 'Titan' },
    'nextgen-console-x': { id: 'nextgen-console-x', title: 'NextGen Console X Pro', price: 41417, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNvTmbpDl3xYLyHDXOgNocUClVgCDIg56BmIx1mLXhb9QR-kwh6EY3KcLuRxP_Zt9FFeC6q17_i-sttTTy7-IxK8eW5vh711_0Fu0xdaxPJGpZmPNBwiGQ_NtTo0J7pYOJR8MtCnR_rz9ZgNNJvDs1nMRYK5jqXO8juxZY398lCEvAjH8oa7PRG_vSTTiFVN2-aEbWrp-HEXG_T9GmM6l1e-Fy41eS2eOC9DonSgqY_7CKdPlhScZzRfcp4lfUOoAlTsYfMOKrBKB', category: 'Gaming', brand: 'NextGen' },
    'apex-rtx-4080': { id: 'apex-rtx-4080', title: 'Apex RTX 4080 Founders', price: 99517, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Components', brand: 'Apex' },
    'studio-pro-anc': { id: 'studio-pro-anc', title: 'Studio Pro ANC Wireless', price: 24817, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'Studio Pro' },
    'alpha-vii-mirrorless': { id: 'alpha-vii-mirrorless', title: 'Alpha VII Mirrorless 4K', price: 207417, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs6rJpoRVW9Vfr2O34zg1KW0WSRF0Tw-GxbYYuRxuyey8KFTSm6SobKH5bZUxfQjVRyuir6ZrCmZyZ_D4sMO-GVw-EKNGqbJPnFqpQP5Y9ud1JMfObBDvToIyD0PdsqybkGCl89kJxI_YH5kWdwAsEN-KeHFZ1MLwpAAvsoQB9ByWbPU110ONhZN5pueX_FP1WDJqG6LgZ0cYEaD1tWigrfxJcAgdxRNdvpcqIpA-zuheG_oLEh6y266eRTZMA7k8GttJvh7hI3POu', category: 'Cameras', brand: 'Alpha' },
    'snapx-5g': { id: 'snapx-5g', title: 'SnapX 5G Pro', price: 54999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNvTmbpDl3xYLyHDXOgNocUClVgCDIg56BmIx1mLXhb9QR-kwh6EY3KcLuRxP_Zt9FFeC6q17_i-sttTTy7-IxK8eW5vh711_0Fu0xdaxPJGpZmPNBwiGQ_NtTo0J7pYOJR8MtCnR_rz9ZgNNJvDs1nMRYK5jqXO8juxZY398lCEvAjH8oa7PRG_vSTTiFVN2-aEbWrp-HEXG_T9GmM6l1e-Fy41eS2eOC9DonSgqY_7CKdPlhScZzRfcp4lfUOoAlTsYfMOKrBKB', category: 'Mobile', brand: 'SnapX' },
    'aero-book-x1': { id: 'aero-book-x1', title: 'AeroBook X1 Ultra', price: 149999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HkLH_OsrpLvu-bp8uPttjK3ozesEMQn8dEIpL5YukgAp4wU1bEcmw0Fv_xZY2R8cDLwTxUfjA0gPlCtxs8DCuKXLXtwruzxc4evYKI0YoDCmuiAWBMsk7Jclx0jc9qaq1beCCOnVFp0OJqUKteG7LJiNTyGu2Qw5CsOM6sdyReEVPItX-Idb3_izI6hcIS1_w-t7JuoyQKUKlviCzFwU8End3Rufk3MrRxD5ilZ4LSgWR8NrGXRfHY_1vA6wXqbpim0xnC_3vhx_', category: 'Laptops', brand: 'AeroBook' },
    'desk-drone-v3': { id: 'desk-drone-v3', title: 'SkyView Drone V3', price: 37499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Drones', brand: 'SkyView' },
    'hyper-earbuds': { id: 'hyper-earbuds', title: 'HyperBuds X Pro', price: 12999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'Hyper' },
    'odyssey-ultrawide': { id: 'odyssey-ultrawide', title: 'Odyssey UltraWide', price: 104999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYugVACfRanIulRggXALKX2RvjDqsGzgS4u5zoW6jlw--VXFgMggb5TZPegxIpVx9suOdfu1diIZS_zeJr6Jce9eEnzLQJhttR5ThNBKUeecFFbLJ990XQYQHLO3IKfBtEbw0cU-GBIlF7PFHzGIUVMXQn4YqcsAX2b2Gu4z0WSi5LWKUHNg7hmD4UquEO94HDte6wLTR4YiYjmv8ILoC6MP01D6SmoUdiv3gPkeD-ON-Tl3wKcvIViCG896ijlFZj5iJwKfnY1CdN', category: 'Monitors', brand: 'Odyssey' },
    'stealth-mouse': { id: 'stealth-mouse', title: 'Stealth Gaming Mouse', price: 8499, image: 'https://lh3.googleusercontent.com/aida-public/AEdXbcoTpHs82-J0yW0U7Lw0e_t9i6-xL3WdYvC_q0P3gZ-W0Tz3Z1P5V0_k6L7NnQw5Jq_r_1Cj6oMw3G_tX6F1-2B8T2P_qT3N5g8Hw2jZwO9rQw2M8J6s7t6T8R9L1N9Kj1G0W9b8-z7V0L7wY2J3Q6N0E3_p6YpQw6eE2K3-h5P4K0-u0B4-mJ8', category: 'Accessories', brand: 'Stealth' },
    'hologram-display': { id: 'hologram-display', title: 'HoloView 3D Monitor', price: 84999, image: 'https://lh3.googleusercontent.com/aida-public/AEdXbcoTpHs82-J0yW0U7Lw0e_t9i6-xL3WdYvC_q0P3gZ-W0Tz3Z1P5V0_k6L7NnQw5Jq_r_1Cj6oMw3G_tX6F1-2B8T2P_qT3N5g8Hw2jZwO9rQw2M8J6s7t6T8R9L1N9Kj1G0W9b8-z7V0L7wY2J3Q6N0E3_p6YpQw6eE2K3-h5P4K0-u0B4-mJ8', category: 'Monitors', brand: 'HoloView' },
    'smart-ring-g2': { id: 'smart-ring-g2', title: 'Aura Smart Ring Gen 2', price: 18499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYugVACfRanIulRggXALKX2RvjDqsGzgS4u5zoW6jlw--VXFgMggb5TZPegxIpVx9suOdfu1diIZS_zeJr6Jce9eEnzLQJhttR5ThNBKUeecFFbLJ990XQYQHLO3IKfBtEbw0cU-GBIlF7PFHzGIUVMXQn4YqcsAX2b2Gu4z0WSi5LWKUHNg7hmD4UquEO94HDte6wLTR4YiYjmv8ILoC6MP01D6SmoUdiv3gPkeD-ON-Tl3wKcvIViCG896ijlFZj5iJwKfnY1CdN', category: 'Wearables', brand: 'Aura' },
    'mech-keyboard': { id: 'mech-keyboard', title: 'Pro Keys Wireless Mech', price: 15999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Accessories', brand: 'Pro Keys' },
    'streaming-mic': { id: 'streaming-mic', title: 'StudioCast Condenser', price: 11499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'StudioCast' },
    'g1': { id: 'g1', title: 'SonicPro Elite Headphones', price: 28967, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLOreNU_-zNsgMsN9SxCNbLx3JnqXlubtpdRcndwgXaMrag_1O5OIJa1CbKh11Hjk8iqR2l11FhmKft5w_ieB_d2uJRKw4irky6ZeW6A6z4nCCmW6rMyMnxo0Q1GmV6-MUGBEEBCGLVpfEzu5E35SdcMwdWP82OXMMS2qmUKBFjjeb0X0kqfFGyS4MhC511YdkYRaemy6t2c33bw1bwrY8-3aEidBMK-qXiZQsigQvTzXynzse29eG8ScZV4a49n9A2mZp1FTdbVr7', category: 'Audio', brand: 'SonicPro' },
    'g2': { id: 'g2', title: 'Acoustic Home Mini', price: 10707, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFhXpw5I4-414dj0gx9UH451YrFL2BW2H7DhXJZMb3IKw8p9gkhZ9ALpEWSSMtgVzhkIP0OP3_wucqbKLa1dOIeytaOfy9FxLUbdrfxnuDYYhIPlWxU7Bcq1p7Ts0d98GNlGr5Doy2jtQgORYzDf8-r0sNRBb03ulZAmH5nUSTN_YgWEc4GnTpa8lF9s6u8ox3OBc8bnz0PNf9dn21YeElqqPseHURQYJcqFYZoMBlfICYIp6h0sDp1dLUR9yD0fJoHDskmDF9wVRE', category: 'Smart Home', brand: 'Acoustic' },
    'g3': { id: 'g3', title: 'Nexus Flagship 24 Pro', price: 99517, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxvt6ZpU7eFk5poBgKqR2MHHWe3lMO66m7jN-lV58-NaSfrmayN5nNHuyPjVYUz_5eP7nGLo_cj1zxHd765Gh4VTX54BOFyd1200GtIfjW_snnIjf9y0vp0N5f0Hsnb2RC2xDfsptuxy8Fy8xkji8pCl1ThY8x_fMGfijeDxsCJgwFa4oVNK1YmH2kqdUcqxtGPiwMPDr2ALbSnFTK4NQzCr-cH1AuKZYkIiOoeNDsHDd4YUeAymr2m5fpeYhuH9zgtuG-s1BCFACw', category: 'Mobile', brand: 'Nexus' },
    'g4': { id: 'g4', title: 'VisionPad Pro 12"', price: 74617, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1hDN7LBWzrSqLJNv9CrCDdlkORLWXEJA15EY7oCW6ulQJ_5Sc11Islan8k-t9Qkc6XerQpQR1wc0ZLjkkoClP3jShAgRHGD2WNQsBlehUL22oIjHVjQqGTLfM9562nvzyTsPe18JZ7oSoOWxYwXaOYxeC3GQfazyfM5D9v_H206YJhSs2wdvVILCw4-sVNNZJIUFMsoSbB-eIum1P_jer42-yG9npAz3MepL5hn9-GUDgM6G-ZymYOcz3I9ohL0-lUqH3-TK630vm', category: 'Computing', brand: 'VisionPad' }
};

const BUYIT_SPECS_BY_PRODUCT_ID = {
    'zenith-x1-ultra': [
        '16-inch Mini-LED display with pro-grade color accuracy.',
        'M4 Ultra performance architecture for intensive creative workloads.',
        'High-capacity battery optimized for full-day productivity.',
        'Premium aluminum chassis with advanced thermal management.',
        'High-speed ports and wireless connectivity for modern workflows.'
    ],
    'elite-tab-pro': [
        '13-inch 120Hz AMOLED panel with vivid color depth.',
        'Flagship-grade processor for multitasking and media creation.',
        '16GB RAM class performance for smooth app switching.',
        'All-day battery with fast charge support.',
        'Slim premium body with stylus-ready productivity support.'
    ],
    'titan-sport-v2': [
        'Advanced health sensors with ECG and heart-rate tracking.',
        '5ATM water resistance for swimming and outdoor activities.',
        'Long battery endurance for multi-day usage.',
        'Bright always-on display for easy readability outdoors.',
        'Comprehensive workout and recovery analytics.'
    ],
    'nextgen-console-x': [
        '4K gaming output with high-frame-rate support.',
        'Fast NVMe storage for reduced load times.',
        'Ray-tracing capable graphics pipeline.',
        'Optimized cooling for sustained gaming sessions.',
        'Low-latency wireless controller connectivity.'
    ],
    'apex-rtx-4080': [
        '16GB GDDR6X memory for high-resolution rendering.',
        'Hardware ray tracing and AI-accelerated workloads.',
        'High-performance cooling design for stable clocks.',
        'Optimized drivers for modern content creation suites.',
        'PCIe high-bandwidth interface for gaming and compute.'
    ],
    'studio-pro-anc': [
        'Active noise cancellation with adaptive environment control.',
        '40-hour battery class playback on a single charge.',
        'High-resolution codec support for premium audio quality.',
        'Dual-device pairing with seamless switching.',
        'Comfort-tuned over-ear design for extended sessions.'
    ],
    'alpha-vii-mirrorless': [
        'High-resolution full-frame sensor for professional imaging.',
        'Advanced autofocus with real-time subject tracking.',
        '4K and high-bitrate video capture pipeline.',
        'In-body stabilization for sharper handheld shots.',
        'Fast burst shooting for action and sports scenarios.'
    ],
    'snapx-5g': [
        '5G-ready modem with broad network compatibility.',
        '108MP camera system with AI scene optimization.',
        'High refresh AMOLED display for fluid interaction.',
        'Fast charging with efficient thermal control.',
        'Powerful chipset for gaming and multitasking.'
    ],
    'aero-book-x1': [
        'High-resolution OLED display with deep contrast.',
        '32GB memory class for demanding productivity workflows.',
        'Fast NVMe SSD storage for quick boot and launch.',
        'Lightweight premium body with long battery life.',
        'Comprehensive modern ports and high-speed wireless.'
    ],
    'desk-drone-v3': [
        '4K stabilized camera for cinematic aerial footage.',
        'Up to 40 minutes class flight endurance.',
        'Intelligent tracking and waypoint navigation modes.',
        'Obstacle awareness for safer autonomous flight.',
        'Portable foldable frame for travel convenience.'
    ],
    'hyper-earbuds': [
        'Hybrid ANC with transparency mode support.',
        'Low-latency audio tuning for gaming and video.',
        'Hi-Res playback profile with balanced sound signature.',
        'Pocket charging case with fast top-up capability.',
        'Ergonomic in-ear fit for long daily use.'
    ],
    'odyssey-ultrawide': [
        'Ultrawide QHD panel with 240Hz refresh rate.',
        'Curved immersive design for productivity and gaming.',
        'High contrast display with low motion blur.',
        'Adaptive sync support for smoother visuals.',
        'Ergonomic stand with tilt and height adjustments.'
    ],
    'stealth-mouse': [
        'Up to 26K DPI precision optical sensor.',
        'Low-latency wireless connectivity for competitive play.',
        'Ergonomic shell with textured grip support.',
        'Programmable buttons with onboard memory profiles.',
        'Long battery runtime with fast recharge support.'
    ],
    'hologram-display': [
        'Immersive 3D depth visualization technology.',
        'High-resolution panel for creative and design workflows.',
        'Wide viewing angles with accurate color reproduction.',
        'Low-latency input path for interactive experiences.',
        'Modern connectivity options for workstation setups.'
    ],
    'smart-ring-g2': [
        'Continuous heart-rate and HRV wellness tracking.',
        'Advanced sleep stage analysis and readiness scoring.',
        'Ultra-compact lightweight form with all-day comfort.',
        'Extended standby battery with quick magnetic charging.',
        'Companion app insights for long-term health trends.'
    ],
    'mech-keyboard': [
        'Hot-swappable mechanical switches for custom feel.',
        'Wireless multi-device support with low input lag.',
        'Per-key RGB lighting customization profiles.',
        'Durable keycaps and reinforced frame construction.',
        'Programmable macros for productivity and gaming.'
    ],
    'streaming-mic': [
        'Condenser capsule tuned for broadcast-grade vocal clarity.',
        'USB-C plug-and-play with low-noise preamp chain.',
        'Selectable pickup modes for solo and group recording.',
        'Integrated gain controls and real-time monitoring.',
        'Shock-resistant mount compatibility for clean capture.'
    ],
    'g1': [
        'Premium ANC with immersive wide-range sound profile.',
        'Comfort-focused over-ear build for long sessions.',
        'Extended battery backup with rapid charging support.',
        'Dual-mode wired and wireless operation.',
        'Voice assistant integration with quick controls.'
    ],
    'g2': [
        'Compact smart speaker with room-filling output.',
        'Hands-free voice command and app-based control.',
        'Wi-Fi and Bluetooth dual connectivity options.',
        '360-degree audio projection for balanced listening.',
        'Energy-efficient standby with instant wake response.'
    ],
    'g3': [
        'Flagship-class chipset with advanced AI acceleration.',
        'Pro camera stack with enhanced low-light performance.',
        'High refresh AMOLED display for ultra-smooth operation.',
        'Fast charging and battery health optimization.',
        'Robust 5G, Wi-Fi, and Bluetooth connectivity suite.'
    ],
    'g4': [
        '12-inch high-resolution display with accurate touch response.',
        'Power-efficient processor for creative multitasking.',
        'Lightweight premium chassis for portable productivity.',
        'Long battery endurance with quick recharge capability.',
        'Accessory-ready ecosystem for keyboard and stylus use.'
    ]
};

const BUYIT_OUT_OF_STOCK_IDS = new Set([
    'nextgen-console-x',
    'alpha-vii-mirrorless',
    'hologram-display'
]);

function normalizeCatalogCategory(category) {
    const value = String(category || '').trim().toLowerCase();
    if (['smartphones', 'smartphone', 'phone', 'phones', 'mobile', 'mobiles'].includes(value)) {
        return 'smartphones';
    }
    if (['laptops', 'laptop', 'computer', 'computers', 'monitor', 'monitors'].includes(value)) {
        return 'laptops';
    }
    if (['tablets', 'tablet', 'computing'].includes(value)) {
        return 'tablets';
    }
    if (['audio', 'smarthome', 'smart home'].includes(value)) {
        return 'audio';
    }
    if (['wearable', 'wearables'].includes(value)) {
        return 'wearables';
    }
    if (['accessory', 'accessories', 'component', 'components'].includes(value)) {
        return 'accessories';
    }
    return 'accessories';
}

Object.values(BUYIT_PRODUCT_CATALOG).forEach((product) => {
    const normalizedPrice = parsePrice(product.price);
    const normalizedRegularPrice = parsePrice(product.regularPrice);
    product.price = normalizedPrice;
    product.regularPrice = normalizedRegularPrice > 0
        ? normalizedRegularPrice
        : Math.round(normalizedPrice * BUYIT_REGULAR_PRICE_MULTIPLIER);
    product.image = String(product.localImage || product.image || 'buyit-logo.png');

    if (!Array.isArray(product.specifications) || product.specifications.length === 0) {
        product.specifications = BUYIT_SPECS_BY_PRODUCT_ID[product.id] || [
            'Premium build quality and reliable daily performance.',
            'Balanced hardware optimized for stable operation.',
            'Modern connectivity support for current devices.',
            'Efficient power usage for practical everyday use.',
            'Built for durability and long-term consistency.'
        ];
    }
    if (typeof product.inStock !== 'boolean') {
        product.inStock = !BUYIT_OUT_OF_STOCK_IDS.has(product.id);
    }
});

function getProductById(productId) {
    if (!productId) {
        return null;
    }
    return BUYIT_PRODUCT_CATALOG[productId] || null;
}

function getProductLink(productId) {
    const safeProductId = productId || 'zenith-x1-ultra';
    return `product-details.html?id=${encodeURIComponent(safeProductId)}`;
}

window.BUYIT_PRODUCT_CATALOG = BUYIT_PRODUCT_CATALOG;
window.getProductById = getProductById;
window.getProductLink = getProductLink;

function parsePrice(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const cleaned = value.replace(/[^\d.-]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}

function formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(parsePrice(value));
}

function findCatalogProduct(product) {
    if (!product) {
        return null;
    }
    if (product.id && BUYIT_PRODUCT_CATALOG[product.id]) {
        return BUYIT_PRODUCT_CATALOG[product.id];
    }
    const title = String(product.title || '').trim().toLowerCase();
    if (!title) {
        return null;
    }
    return Object.values(BUYIT_PRODUCT_CATALOG).find((catalogItem) =>
        String(catalogItem.title || '').trim().toLowerCase() === title
    ) || null;
}

function normalizeProductInput(product) {
    const catalogMatch = findCatalogProduct(product);
    const fallbackTitle = String(product?.title || '').trim();
    const fallbackId = fallbackTitle
        ? fallbackTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : `item-${Date.now()}`;

    const normalizedId = catalogMatch?.id || product?.id || fallbackId;
    const normalizedTitle = catalogMatch?.title || fallbackTitle || 'Product';
    const normalizedImage = product?.localImage || product?.image || catalogMatch?.localImage || catalogMatch?.image || 'buyit-logo.png';
    const normalizedPrice = parsePrice(catalogMatch?.price ?? product?.price);
    const normalizedRegularPrice = parsePrice(catalogMatch?.regularPrice ?? product?.regularPrice) || Math.round(normalizedPrice * BUYIT_REGULAR_PRICE_MULTIPLIER);
    const normalizedQuantity = Math.max(1, parseInt(product?.quantity, 10) || 1);

    return {
        id: normalizedId,
        title: normalizedTitle,
        image: normalizedImage,
        price: normalizedPrice,
        regularPrice: normalizedRegularPrice,
        quantity: normalizedQuantity
    };
}

function sanitizeCollection(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map((item) => normalizeProductInput(item));
}

function migrateStoredOrders() {
    const rawOrders = JSON.parse(localStorage.getItem('buyit_orders') || '[]');
    if (!Array.isArray(rawOrders) || rawOrders.length === 0) {
        return;
    }

    const migratedOrders = rawOrders.map((order) => {
        const safeItems = Array.isArray(order.items) ? order.items.map((item) => {
            const normalizedItem = normalizeProductInput(item);
            return {
                ...item,
                id: normalizedItem.id,
                title: normalizedItem.title,
                image: normalizedItem.image,
                price: normalizedItem.price,
                regularPrice: normalizedItem.regularPrice,
                quantity: normalizedItem.quantity
            };
        }) : [];

        const computedAmount = safeItems.reduce((sum, item) => sum + (parsePrice(item.price) * (Number(item.quantity) || 1)), 0);

        return {
            ...order,
            items: safeItems,
            amount: parsePrice(order.amount || computedAmount)
        };
    });

    localStorage.setItem('buyit_orders', JSON.stringify(migratedOrders));
}

cart = sanitizeCollection(cart);
wishlist = sanitizeCollection(wishlist);
migrateStoredOrders();
localStorage.setItem('buyit_cart', JSON.stringify(cart));
localStorage.setItem('buyit_wishlist', JSON.stringify(wishlist));
window.formatINR = formatINR;

// Core Functions
function saveState() {
    localStorage.setItem('buyit_cart', JSON.stringify(cart));
    localStorage.setItem('buyit_wishlist', JSON.stringify(wishlist));
    updateHeaderCounts();
    updateWishlistButtons();
}

// Update all wishlist heart buttons on the page based on current wishlist state
function updateWishlistButtons() {
    const buttons = document.querySelectorAll('[data-wishlist-id]');
    buttons.forEach(btn => {
        const id = btn.getAttribute('data-wishlist-id');
        const inWishlist = wishlist.some(item => item.id === id);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (inWishlist) {
            btn.classList.add('text-red-500');
            btn.classList.remove('text-text-secondary-light', 'dark:text-white', 'text-slate-400');
            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        } else {
            btn.classList.remove('text-red-500');
            btn.classList.add('text-text-secondary-light', 'dark:text-white');
            if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        }
    });
}

function updateHeaderCounts() {
    const cartCountEl = document.getElementById('cart-count');
    const wishlistCountEl = document.getElementById('wishlist-count');

    // Only update if elements exist on the page
    if (cartCountEl) {
        // Calculate total quantity in cart
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        if (totalItems > 0) {
            cartCountEl.classList.remove('hidden');
            cartCountEl.classList.add('flex');
        } else {
            cartCountEl.classList.add('hidden');
            cartCountEl.classList.remove('flex');
        }
    }

    if (wishlistCountEl) {
        const totalWishlist = wishlist.length;
        wishlistCountEl.textContent = totalWishlist;
        if (totalWishlist > 0) {
            wishlistCountEl.classList.remove('hidden');
            wishlistCountEl.classList.add('flex');
        } else {
            wishlistCountEl.classList.add('hidden');
            wishlistCountEl.classList.remove('flex');
        }
    }
}

function getStoredCustomerName() {
    const directNameKeys = ['buyit_user_name', 'buyit_user_full_name', 'buyit_profile_name', 'userName', 'fullName', 'name'];
    for (const key of directNameKeys) {
        const raw = localStorage.getItem(key);
        if (raw && typeof raw === 'string' && raw.trim()) {
            return raw.trim();
        }
    }

    const addresses = JSON.parse(localStorage.getItem('buyit_addresses') || '[]');
    if (Array.isArray(addresses) && addresses.length > 0) {
        const selectedAddressIndex = parseInt(localStorage.getItem('buyit_selected_address') || '0', 10);
        const selectedAddress = addresses[selectedAddressIndex] || addresses[0];
        if (selectedAddress) {
            const firstName = String(selectedAddress['first-name'] || '').trim();
            const lastName = String(selectedAddress['last-name'] || '').trim();
            const fullName = `${firstName} ${lastName}`.trim();
            if (fullName) {
                return fullName;
            }
        }
    }

    return 'User';
}

function getNameInitials(fullName) {
    const safeName = String(fullName || '').trim();
    if (!safeName) {
        return 'U';
    }

    const parts = safeName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
}

function updateAccountAvatarPlaceholders() {
    const fullName = getStoredCustomerName();
    const initials = getNameInitials(fullName);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0f172a&color=ffffff&bold=true`;
    const avatars = document.querySelectorAll('img[alt="User Avatar"], img[src*="ui-avatars.com/api/"]');
    avatars.forEach((avatar) => {
        avatar.src = avatarUrl;
    });
}

// Action Functions
function addToCart(product) {
    const normalizedProduct = normalizeProductInput(product);
    // Check if item already exists in cart based on an id or title
    const existingIndex = cart.findIndex(item => item.id === normalizedProduct.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += normalizedProduct.quantity;
    } else {
        cart.push(normalizedProduct);
    }
    saveState();

    // Optional UI Feedback
    showToast(`Added ${normalizedProduct.title} to Cart`);
}

function buyNow(product) {
    const normalizedProduct = normalizeProductInput(product);
    // Store as single-item buy now session (doesn't affect cart)
    sessionStorage.setItem('buyit_buynow', JSON.stringify({ ...normalizedProduct, quantity: 1 }));
    window.location.href = 'checkout.html';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveState();
    // Dispatch event so cart page can re-render
    window.dispatchEvent(new Event('cartUpdated'));
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveState();
        window.dispatchEvent(new Event('cartUpdated'));
    }
}

function addToWishlist(product) {
    const normalizedProduct = normalizeProductInput(product);
    const existingIndex = wishlist.findIndex(item => item.id === normalizedProduct.id);
    if (existingIndex === -1) {
        wishlist.push(normalizedProduct);
        saveState();
        showToast(`Added ${normalizedProduct.title} to Wishlist`);
    } else {
        // Toggle off — remove from wishlist
        wishlist.splice(existingIndex, 1);
        saveState();
        showToast(`Removed ${normalizedProduct.title} from Wishlist`);
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveState();
    window.dispatchEvent(new Event('wishlistUpdated'));
}

// Simple Toast Notification System
function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-3 border border-slate-700 font-medium text-sm';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
        ${message}
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Animate out and remove after 3s
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderCounts();
    updateWishlistButtons();
    updateAccountAvatarPlaceholders();
});

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

const BUYIT_PRODUCT_CATALOG = {
    'zenith-x1-ultra': {
        id: 'zenith-x1-ultra',
        title: 'Zenith X1 Carbon Ultra',
        price: 207417,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvcZLPrU-hLvrkRaN840CcHQZef_ijXdIDgCsmgDd6jI3DgGbcW6yIZp2pTw0Aw14vC4kLRaZHSWLMXG3wXrelh5thka19QRl4irHSwAGOC34vnlzUG0FobitA8DUUhCHSP07LYxCu96feqcW05uOtSlio_fH9rYk7InFlDIvKnr6Cey7uaURMKLGFYLUVuKtVj3Y8ohLLJYIrXJqQ5MHiA7DEQEK1LgS3gI3geUy_SVdu_hl9uKQWJiV1EnMbDYxkHkIUMlXdrknW',
        category: 'Computers',
        brand: 'Zenith Computing',
        description: "The ultimate creator's machine. Unibody aluminum chassis housing the powerful M4 Ultra chip, featuring a stunning 16-inch Mini-LED display and all-day battery life for uncompromising performance."
    },
    'elite-tab-pro': { id: 'elite-tab-pro', title: 'Elite Tab Pro 13.0', price: 91217, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HkLH_OsrpLvu-bp8uPttjK3ozesEMQn8dEIpL5YukgAp4wU1bEcmw0Fv_xZY2R8cDLwTxUfjA0gPlCtxs8DCuKXLXtwruzxc4evYKI0YoDCmuiAWBMsk7Jclx0jc9qaq1beCCOnVFp0OJqUKteG7LJiNTyGu2Qw5CsOM6sdyReEVPItX-Idb3_izI6hcIS1_w-t7JuoyQKUKlviCzFwU8End3Rufk3MrRxD5ilZ4LSgWR8NrGXRfHY_1vA6wXqbpim0xnC_3vhx_', category: 'Tablets', brand: 'Elite', description: 'A premium high-performance tablet built for work, creativity, and entertainment with a fluid display and flagship-grade internals.' },
    'titan-sport-v2': { id: 'titan-sport-v2', title: 'Titan Sport Active V2', price: 28967, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLvDKoi4zzOxtthUuIkDWpoamW-x_fQcJEenQ8eWiqnyVLfQMdcrpsuLly_lrUhZs3d6rDOKciRa-9KLqKzuX7i2IuZMZ6po08oAKXGIWAEC1EzyElHQfYru--gHp5ZLiiq1T_pRDM4SNohZIXPpNWeHc1mide9BXN9wMGZbaU4c0BvKMku1QVkBCjgcwUdEIKFVgaxKK0CWMNQQ4OSbAqJLDRxVKLsmPNS6YBxgln_7oDra8AlLxzSR0vXVxi9wpnu2AKpifrHwku', category: 'Wearables', brand: 'Titan', description: 'A durable smart fitness watch with advanced health tracking, long battery life, and premium sports-focused design.' },
    'nextgen-console-x': { id: 'nextgen-console-x', title: 'NextGen Console X Pro', price: 41417, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNvTmbpDl3xYLyHDXOgNocUClVgCDIg56BmIx1mLXhb9QR-kwh6EY3KcLuRxP_Zt9FFeC6q17_i-sttTTy7-IxK8eW5vh711_0Fu0xdaxPJGpZmPNBwiGQ_NtTo0J7pYOJR8MtCnR_rz9ZgNNJvDs1nMRYK5jqXO8juxZY398lCEvAjH8oa7PRG_vSTTiFVN2-aEbWrp-HEXG_T9GmM6l1e-Fy41eS2eOC9DonSgqY_7CKdPlhScZzRfcp4lfUOoAlTsYfMOKrBKB', category: 'Gaming', brand: 'NextGen', description: 'A powerful gaming console delivering high-fidelity visuals, fast load times, and immersive next-generation gameplay.' },
    'apex-rtx-4080': { id: 'apex-rtx-4080', title: 'Apex RTX 4080 Founders', price: 99517, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Components', brand: 'Apex', description: 'A high-end graphics card engineered for ultra settings, AI acceleration, and smooth 4K gaming performance.' },
    'studio-pro-anc': { id: 'studio-pro-anc', title: 'Studio Pro ANC Wireless', price: 24817, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'Studio Pro', description: 'Premium wireless over-ear headphones with active noise cancellation and studio-quality sound tuning.' },
    'alpha-vii-mirrorless': { id: 'alpha-vii-mirrorless', title: 'Alpha VII Mirrorless 4K', price: 207417, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs6rJpoRVW9Vfr2O34zg1KW0WSRF0Tw-GxbYYuRxuyey8KFTSm6SobKH5bZUxfQjVRyuir6ZrCmZyZ_D4sMO-GVw-EKNGqbJPnFqpQP5Y9ud1JMfObBDvToIyD0PdsqybkGCl89kJxI_YH5kWdwAsEN-KeHFZ1MLwpAAvsoQB9ByWbPU110ONhZN5pueX_FP1WDJqG6LgZ0cYEaD1tWigrfxJcAgdxRNdvpcqIpA-zuheG_oLEh6y266eRTZMA7k8GttJvh7hI3POu', category: 'Cameras', brand: 'Alpha', description: 'A flagship mirrorless camera designed for creators with powerful autofocus, 4K capture, and pro-grade image quality.' },
    'snapx-5g': { id: 'snapx-5g', title: 'SnapX 5G Pro', price: 54999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNvTmbpDl3xYLyHDXOgNocUClVgCDIg56BmIx1mLXhb9QR-kwh6EY3KcLuRxP_Zt9FFeC6q17_i-sttTTy7-IxK8eW5vh711_0Fu0xdaxPJGpZmPNBwiGQ_NtTo0J7pYOJR8MtCnR_rz9ZgNNJvDs1nMRYK5jqXO8juxZY398lCEvAjH8oa7PRG_vSTTiFVN2-aEbWrp-HEXG_T9GmM6l1e-Fy41eS2eOC9DonSgqY_7CKdPlhScZzRfcp4lfUOoAlTsYfMOKrBKB', category: 'Mobile', brand: 'SnapX', description: 'A 5G flagship smartphone with a bright AMOLED panel, high-speed performance, and advanced camera capabilities.' },
    'aero-book-x1': { id: 'aero-book-x1', title: 'AeroBook X1 Ultra', price: 149999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8HkLH_OsrpLvu-bp8uPttjK3ozesEMQn8dEIpL5YukgAp4wU1bEcmw0Fv_xZY2R8cDLwTxUfjA0gPlCtxs8DCuKXLXtwruzxc4evYKI0YoDCmuiAWBMsk7Jclx0jc9qaq1beCCOnVFp0OJqUKteG7LJiNTyGu2Qw5CsOM6sdyReEVPItX-Idb3_izI6hcIS1_w-t7JuoyQKUKlviCzFwU8End3Rufk3MrRxD5ilZ4LSgWR8NrGXRfHY_1vA6wXqbpim0xnC_3vhx_', category: 'Laptops', brand: 'AeroBook', description: 'A lightweight, high-power laptop crafted for productivity and creative workflows with long battery life and premium build.' },
    'desk-drone-v3': { id: 'desk-drone-v3', title: 'SkyView Drone V3', price: 37499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Drones', brand: 'SkyView', description: 'A compact camera drone with stabilized flight controls, 4K capture, and intelligent tracking modes.' },
    'hyper-earbuds': { id: 'hyper-earbuds', title: 'HyperBuds X Pro', price: 12999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'Hyper', description: 'True wireless earbuds with rich sound, low-latency playback, and all-day comfort for work and travel.' },
    'odyssey-ultrawide': { id: 'odyssey-ultrawide', title: 'Odyssey UltraWide', price: 104999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYugVACfRanIulRggXALKX2RvjDqsGzgS4u5zoW6jlw--VXFgMggb5TZPegxIpVx9suOdfu1diIZS_zeJr6Jce9eEnzLQJhttR5ThNBKUeecFFbLJ990XQYQHLO3IKfBtEbw0cU-GBIlF7PFHzGIUVMXQn4YqcsAX2b2Gu4z0WSi5LWKUHNg7hmD4UquEO94HDte6wLTR4YiYjmv8ILoC6MP01D6SmoUdiv3gPkeD-ON-Tl3wKcvIViCG896ijlFZj5iJwKfnY1CdN', category: 'Monitors', brand: 'Odyssey', description: 'An immersive ultrawide display with high refresh rate, deep contrast, and professional-grade color performance.' },
    'stealth-mouse': { id: 'stealth-mouse', title: 'Stealth Gaming Mouse', price: 8499, image: 'https://lh3.googleusercontent.com/aida-public/AEdXbcoTpHs82-J0yW0U7Lw0e_t9i6-xL3WdYvC_q0P3gZ-W0Tz3Z1P5V0_k6L7NnQw5Jq_r_1Cj6oMw3G_tX6F1-2B8T2P_qT3N5g8Hw2jZwO9rQw2M8J6s7t6T8R9L1N9Kj1G0W9b8-z7V0L7wY2J3Q6N0E3_p6YpQw6eE2K3-h5P4K0-u0B4-mJ8', category: 'Accessories', brand: 'Stealth', description: 'A precision gaming mouse with customizable DPI, ergonomic grip, and responsive low-latency input.' },
    'hologram-display': { id: 'hologram-display', title: 'HoloView 3D Monitor', price: 84999, image: 'https://lh3.googleusercontent.com/aida-public/AEdXbcoTpHs82-J0yW0U7Lw0e_t9i6-xL3WdYvC_q0P3gZ-W0Tz3Z1P5V0_k6L7NnQw5Jq_r_1Cj6oMw3G_tX6F1-2B8T2P_qT3N5g8Hw2jZwO9rQw2M8J6s7t6T8R9L1N9Kj1G0W9b8-z7V0L7wY2J3Q6N0E3_p6YpQw6eE2K3-h5P4K0-u0B4-mJ8', category: 'Monitors', brand: 'HoloView', description: 'A futuristic 3D monitor for immersive visual experiences, advanced workflows, and next-level productivity.' },
    'smart-ring-g2': { id: 'smart-ring-g2', title: 'Aura Smart Ring Gen 2', price: 18499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYugVACfRanIulRggXALKX2RvjDqsGzgS4u5zoW6jlw--VXFgMggb5TZPegxIpVx9suOdfu1diIZS_zeJr6Jce9eEnzLQJhttR5ThNBKUeecFFbLJ990XQYQHLO3IKfBtEbw0cU-GBIlF7PFHzGIUVMXQn4YqcsAX2b2Gu4z0WSi5LWKUHNg7hmD4UquEO94HDte6wLTR4YiYjmv8ILoC6MP01D6SmoUdiv3gPkeD-ON-Tl3wKcvIViCG896ijlFZj5iJwKfnY1CdN', category: 'Wearables', brand: 'Aura', description: 'A compact smart ring with sleep analytics, heart-rate insights, and seamless all-day wellness tracking.' },
    'mech-keyboard': { id: 'mech-keyboard', title: 'Pro Keys Wireless Mech', price: 15999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwRMO7z2je82ZTm3hpu2eG6T1HmQgVQYrspH9xxeZpE-usWlmZQIka4hWuRh3VnZSS64UH8uyIYcmLUna5VsVWfGKyHbf8H2DMFDcT01_8BG5MfEnUNdXXj7gNaEyZmhwTGIAvi2z5hQLLc7M8C1DqmeVFGiWchCEClYpgHrkZDfvjsS9cXKwsHiZx4i6tQd3q2oSn8xHhJHkRd5dFOU7TTbXP2X09hs55cWz5ccMNGk7K4yx0mRsL9th9xZtJiJYNT0-5zpxf9r4t', category: 'Accessories', brand: 'Pro Keys', description: 'A wireless mechanical keyboard with tactile switches, customizable layout options, and reliable multi-device support.' },
    'streaming-mic': { id: 'streaming-mic', title: 'StudioCast Condenser', price: 11499, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72_IR4svNMhKtT5sm8RaaDmpEGOpauk1kXFPvop4eVxZv73hFLRewhGgPXryPM_dLLa-HT5HBt63f8sP8o5IZA_s1iwEoel5BoVzziGzkM9ukhzIyp2DvLneMqxqAEdDdle3CoM_rNEwmSg5KKDqokrTt49Fbf1wqARuvFNim7Z45TA3qSqubIb15Y4hi5pKQlsjLqPXObsL2OdUso0LR18BkVj6Ryn_6PfiEQdJWrzW8mjRT77sipTGyaT7wTwNVaiVZDAfYYR1v', category: 'Audio', brand: 'StudioCast', description: 'A condenser USB microphone tuned for streamers and podcasters with clear voice capture and low-noise performance.' },
    'g1': { id: 'g1', title: 'SonicPro Elite Headphones', price: 28967, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLOreNU_-zNsgMsN9SxCNbLx3JnqXlubtpdRcndwgXaMrag_1O5OIJa1CbKh11Hjk8iqR2l11FhmKft5w_ieB_d2uJRKw4irky6ZeW6A6z4nCCmW6rMyMnxo0Q1GmV6-MUGBEEBCGLVpfEzu5E35SdcMwdWP82OXMMS2qmUKBFjjeb0X0kqfFGyS4MhC511YdkYRaemy6t2c33bw1bwrY8-3aEidBMK-qXiZQsigQvTzXynzse29eG8ScZV4a49n9A2mZp1FTdbVr7', category: 'Audio', brand: 'SonicPro', description: 'Top-rated premium wireless headphones with ANC, immersive audio, and long battery backup for all-day listening.' },
    'g2': { id: 'g2', title: 'Acoustic Home Mini', price: 10707, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFhXpw5I4-414dj0gx9UH451YrFL2BW2H7DhXJZMb3IKw8p9gkhZ9ALpEWSSMtgVzhkIP0OP3_wucqbKLa1dOIeytaOfy9FxLUbdrfxnuDYYhIPlWxU7Bcq1p7Ts0d98GNlGr5Doy2jtQgORYzDf8-r0sNRBb03ulZAmH5nUSTN_YgWEc4GnTpa8lF9s6u8ox3OBc8bnz0PNf9dn21YeElqqPseHURQYJcqFYZoMBlfICYIp6h0sDp1dLUR9yD0fJoHDskmDF9wVRE', category: 'Smart Home', brand: 'Acoustic', description: 'A compact smart home speaker with Wi-Fi connectivity and responsive voice controls for your everyday routines.' },
    'g3': { id: 'g3', title: 'Nexus Flagship 24 Pro', price: 99517, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxvt6ZpU7eFk5poBgKqR2MHHWe3lMO66m7jN-lV58-NaSfrmayN5nNHuyPjVYUz_5eP7nGLo_cj1zxHd765Gh4VTX54BOFyd1200GtIfjW_snnIjf9y0vp0N5f0Hsnb2RC2xDfsptuxy8Fy8xkji8pCl1ThY8x_fMGfijeDxsCJgwFa4oVNK1YmH2kqdUcqxtGPiwMPDr2ALbSnFTK4NQzCr-cH1AuKZYkIiOoeNDsHDd4YUeAymr2m5fpeYhuH9zgtuG-s1BCFACw', category: 'Mobile', brand: 'Nexus', description: 'A flagship smartphone delivering excellent speed, camera quality, and a fluid premium display experience.' },
    'g4': { id: 'g4', title: 'VisionPad Pro 12"', price: 74617, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1hDN7LBWzrSqLJNv9CrCDdlkORLWXEJA15EY7oCW6ulQJ_5Sc11Islan8k-t9Qkc6XerQpQR1wc0ZLjkkoClP3jShAgRHGD2WNQsBlehUL22oIjHVjQqGTLfM9562nvzyTsPe18JZ7oSoOWxYwXaOYxeC3GQfazyfM5D9v_H206YJhSs2wdvVILCw4-sVNNZJIUFMsoSbB-eIum1P_jer42-yG9npAz3MepL5hn9-GUDgM6G-ZymYOcz3I9ohL0-lUqH3-TK630vm', category: 'Computing', brand: 'VisionPad', description: 'A pro-grade tablet with smooth refresh rate, strong multitasking performance, and a vivid large-format display.' }
};

function getProductById(productId) {
    if (!productId) {
        return null;
    }
    return BUYIT_PRODUCT_CATALOG[productId] || null;
}

function getProductLink(productId) {
    if (!productId) {
        return 'product.html';
    }
    return `product.html?id=${encodeURIComponent(productId)}`;
}

window.BUYIT_PRODUCT_CATALOG = BUYIT_PRODUCT_CATALOG;
window.getProductById = getProductById;
window.getProductLink = getProductLink;

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

// Action Functions
function addToCart(product) {
    // Check if item already exists in cart based on an id or title
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += (product.quantity || 1);
    } else {
        cart.push({ ...product, quantity: product.quantity || 1 });
    }
    saveState();

    // Optional UI Feedback
    showToast(`Added ${product.title} to Cart`);
}

function buyNow(product) {
    // Store as single-item buy now session (doesn't affect cart)
    sessionStorage.setItem('buyit_buynow', JSON.stringify({ ...product, quantity: 1 }));
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
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    if (existingIndex === -1) {
        wishlist.push(product);
        saveState();
        showToast(`Added ${product.title} to Wishlist`);
    } else {
        // Toggle off — remove from wishlist
        wishlist.splice(existingIndex, 1);
        saveState();
        showToast(`Removed ${product.title} from Wishlist`);
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
});

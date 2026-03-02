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
    'iphone-17-pro-max': {
        id: 'iphone-17-pro-max',
        title: 'iPhone 17 Pro Max',
        price: 130000,
        regularPrice: 149999,
        featured: true,
        sortOrder: 1,
        localImage: 'product-images/smartphones/iphone1.jpg',
        galleryImages: [
            'product-images/smartphones/iphone1.jpg',
            'product-images/smartphones/iphone2.jpg',
            'product-images/smartphones/iphone3.jpg',
            'product-images/smartphones/iphone4.jpg',
            'product-images/smartphones/iphone5.jpg',
            'product-images/smartphones/iphone6.jpg',
            'product-images/smartphones/iphone7.jpg'
        ],
        specifications: [
            '6.9-inch Super Retina XDR display with ProMotion 120Hz refresh rate.',
            'A19 Pro chipset engineered for flagship gaming and AI performance.',
            'Triple-camera pro system with advanced low-light and cinematic video.',
            'Fast charging with all-day battery optimization for heavy usage.',
            '5G, Wi-Fi 7, and premium titanium build for long-term durability.'
        ],
        category: 'smartphones'
    },
    
    'apple-macbook-pro-m5': {
        id: 'apple-macbook-pro-m5',
        title: 'Apple MacBook Pro M5',
        price: 170000,
        regularPrice: 199999,
        featured: true,
        sortOrder: 2,
        localImage: 'product-images/laptops/mac1.jpg',
        galleryImages: [
            'product-images/laptops/mac1.jpg',
            'product-images/laptops/mac2.jpg',
            'product-images/laptops/mac3.jpg',
            'product-images/laptops/mac4.jpg',
            'product-images/laptops/mac5.jpg',
            'product-images/laptops/mac6.jpg',
            'product-images/laptops/mac7.jpg',
            'product-images/laptops/mac8.jpg'
        ],
        specifications: [
            'Apple M5 architecture tuned for pro-grade editing and development workloads.',
            'Liquid Retina XDR display with high brightness and accurate color rendering.',
            'Unified memory design for smooth multitasking across demanding applications.',
            'High-speed SSD storage with rapid boot and file transfer performance.',
            'Long battery life with premium thermal efficiency and silent operation.'
        ],
        category: 'laptops'
    },

    'apple-ipad-pro-m5': {
        id: 'apple-ipad-pro-m5',
        title: 'Apple iPad Pro M5',
        price: 115000,
        regularPrice: 149999,
        featured: true,
        sortOrder: 3,
        localImage: 'product-images/tablets/ipad1.jpg',
        galleryImages: [
            'product-images/tablets/ipad1.jpg',
            'product-images/tablets/ipad2.jpg',
            'product-images/tablets/ipad3.jpg',
            'product-images/tablets/ipad4.jpg',
            'product-images/tablets/ipad5.jpg',
            'product-images/tablets/ipad6.jpg',
            'product-images/tablets/ipad7.jpg'
        ],
        specifications: [
            'Ultra-smooth high-refresh display with pencil-ready precision touch response.',
            'M5-class tablet performance for creators, students, and professionals.',
            'Large battery designed for all-day productivity and entertainment.',
            'Advanced camera and scanner support for content capture and calls.',
            'Fast wireless connectivity and ecosystem integration with Apple accessories.'
        ],
        category: 'tablets'
    },

    'apple-airpods-max-headset': {
        id: 'apple-airpods-max-headset',
        title: 'Apple AirPods Max Headset',
        price: 60000,
        regularPrice: 85000,
        featured: false,
        sortOrder: 4,
        localImage: 'product-images/audio/apple-headphone1.jpg',
        galleryImages: [
            'product-images/audio/apple-headphone1.jpg',
            'product-images/audio/apple-headphone2.jpg',
            'product-images/audio/apple-headphone3.jpg',
            'product-images/audio/apple-headphone4.jpg',
            'product-images/audio/apple-headphone5.jpg',
            'product-images/audio/apple-headphone6.jpg'
        ],
        specifications: [
            'High-fidelity drivers with spatial audio and dynamic head tracking.',
            'Adaptive active noise cancellation with transparency listening mode.',
            'Premium over-ear comfort with breathable cushions for long sessions.',
            'Low-latency wireless performance for music, calls, and media.',
            'Extended playback time with smart power management and fast charging.'
        ],
        category: 'audio'
    },

    'apple-watch-se-2': {
        id: 'apple-watch-se-2',
        title: 'Apple Watch SE 2',
        price: 15000,
        regularPrice: 20000,
        featured: false,
        sortOrder: 5,
        localImage: 'product-images/wearables/iwatch1.jpg',
        galleryImages: [
            'product-images/wearables/iwatch1.jpg',
            'product-images/wearables/iwatch2.jpg',
            'product-images/wearables/iwatch3.jpg',
            'product-images/wearables/iwatch4.jpg',
            'product-images/wearables/iwatch5.jpg',
            'product-images/wearables/iwatch6.jpg',
            'product-images/wearables/iwatch7.jpg'
        ],
        specifications: [
            'Retina display with bright outdoor readability and smooth interactions.',
            'Heart rate, activity, and sleep tracking for daily fitness insights.',
            'Water-resistant design suitable for workouts and light swimming.',
            'Smart notifications, call handling, and app sync with iPhone.',
            'Efficient battery profile for full-day smart wearable use.'
        ],
        category: 'wearables'
    },

    'blue-evil-eye-pendant-chain': {
        id: 'blue-evil-eye-pendant-chain',
        title: 'Blue Evil Eye Pendant Chain',
        price: 19,
        regularPrice: 99,
        featured: false,
        sortOrder: 6,
        localImage: 'product-images/accessories/evileye1.jpg',
        galleryImages: [
            'product-images/accessories/evileye1.jpg',
            'product-images/accessories/evileye2.jpg',
            'product-images/accessories/evileye3.jpg',
            'product-images/accessories/evileye4.jpg',
            'product-images/accessories/evileye5.jpg',
            'product-images/accessories/evileye6.jpg'
        ],
        specifications: [
            'Minimal pendant design with blue evil-eye centerpiece styling.',
            'Lightweight chain for comfortable all-day wear.',
            'Polished finish with durable everyday accessory build quality.',
            'Suitable for casual outfits and layered fashion combinations.',
            'Compact form factor with easy clasp handling and fit adjustment.'
        ],
        category: 'accessories'
    },
};

const BUYIT_SORT_OPTIONS = {
    featured: 'Featured',
    newest: 'Newly Added',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low'
};

const BUYIT_CATEGORY_MAP = {
    smartphones: 'smartphones',
    'smart-phones': 'smartphones',
    'smart_phones': 'smartphones',
    smartphone: 'smartphones',
    phones: 'smartphones',
    phone: 'smartphones',
    mobile: 'smartphones',
    mobiles: 'smartphones',
    laptops: 'laptops',
    'lap-tops': 'laptops',
    'lap_tops': 'laptops',
    laptop: 'laptops',
    computers: 'laptops',
    computer: 'laptops',
    tablets: 'tablets',
    'tab-lets': 'tablets',
    'tab_lets': 'tablets',
    tablet: 'tablets',
    computing: 'tablets',
    audio: 'audio',
    'smart-home': 'audio',
    'smart_home': 'audio',
    'smart home': 'audio',
    smarthome: 'audio',
    wearables: 'wearables',
    'wear-ables': 'wearables',
    'wear_ables': 'wearables',
    wearable: 'wearables',
    accessories: 'accessories',
    'access-ories': 'accessories',
    'access_ories': 'accessories',
    accessory: 'accessories',
    components: 'accessories',
    component: 'accessories',
    monitors: 'laptops',
    monitor: 'laptops'
};

const BUYIT_CATEGORY_DISPLAY_MAP = {
    smartphones: 'Smartphones',
    laptops: 'Laptops',
    tablets: 'Tablets',
    audio: 'Audio',
    wearables: 'Wearables',
    accessories: 'Accessories'
};

const BUYIT_CATEGORY_ICON_MAP = {
    smartphones: 'smartphone',
    laptops: 'laptop',
    tablets: 'tablet_mac',
    audio: 'headphones',
    wearables: 'watch',
    accessories: 'cable'
};

function slugifyCategory(value) {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function toCategoryLabel(slug) {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

try {
    const adminCategories = JSON.parse(localStorage.getItem('buyit_admin_categories') || '[]');
    if (Array.isArray(adminCategories)) {
        adminCategories.forEach((entry) => {
            const slug = slugifyCategory(entry?.slug || entry?.id || entry?.label || entry);
            if (!slug) {
                return;
            }

            BUYIT_CATEGORY_MAP[slug] = slug;
            BUYIT_CATEGORY_DISPLAY_MAP[slug] = String(entry?.label || toCategoryLabel(slug));
            if (!BUYIT_CATEGORY_ICON_MAP[slug]) {
                BUYIT_CATEGORY_ICON_MAP[slug] = String(entry?.icon || 'category');
            }
        });
    }
} catch (_error) {
    // Ignore malformed category payloads and keep defaults.
}

try {
    const adminProductsRaw = localStorage.getItem('buyit_admin_products') || '[]';
    const adminProducts = JSON.parse(adminProductsRaw);
    if (Array.isArray(adminProducts)) {
        adminProducts.forEach((entry) => {
            const id = String(entry?.id || '').trim();
            if (!id) {
                return;
            }

            const title = String(entry?.title || entry?.name || '').trim() || 'Product';
            const category = slugifyCategory(entry?.category || 'general') || 'general';
            const image = String(entry?.image || 'buyit-logo.png').trim() || 'buyit-logo.png';
            const price = parsePrice(entry?.price);
            const regularPrice = parsePrice(entry?.regularPrice);
            const status = String(entry?.status || '').trim().toLowerCase();
            const inStock = typeof entry?.inStock === 'boolean'
                ? entry.inStock
                : status
                    ? status === 'active'
                    : true;

            BUYIT_PRODUCT_CATALOG[id] = {
                ...(BUYIT_PRODUCT_CATALOG[id] || {}),
                id,
                title,
                category,
                price,
                regularPrice: regularPrice > 0 ? regularPrice : Math.round(price * BUYIT_REGULAR_PRICE_MULTIPLIER),
                image,
                localImage: image,
                galleryImages: Array.isArray(entry?.galleryImages) && entry.galleryImages.length
                    ? entry.galleryImages
                    : [image],
                specifications: Array.isArray(entry?.specifications) ? entry.specifications : [],
                featured: Boolean(entry?.featured),
                sortOrder: Number.isFinite(Number(entry?.sortOrder)) ? Number(entry.sortOrder) : Number.MAX_SAFE_INTEGER,
                inStock
            };

            BUYIT_CATEGORY_MAP[category] = category;
            if (!BUYIT_CATEGORY_DISPLAY_MAP[category]) {
                BUYIT_CATEGORY_DISPLAY_MAP[category] = toCategoryLabel(category);
            }
            if (!BUYIT_CATEGORY_ICON_MAP[category]) {
                BUYIT_CATEGORY_ICON_MAP[category] = 'category';
            }
        });
    }
} catch (_error) {
    // Ignore malformed admin products and keep static catalog.
}

function normalizeCategory(value) {
    const cleaned = (value || '').toString().trim().toLowerCase();
    const compact = cleaned.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    return BUYIT_CATEGORY_MAP[cleaned] || BUYIT_CATEGORY_MAP[compact] || cleaned;
}

function getCategoryDisplayName(value) {
    const normalized = normalizeCategory(value);
    return BUYIT_CATEGORY_DISPLAY_MAP[normalized] || normalized;
}

function getCategoryCardItems() {
    return Object.entries(BUYIT_CATEGORY_DISPLAY_MAP).map(([category, label]) => ({
        category,
        label,
        icon: BUYIT_CATEGORY_ICON_MAP[category] || 'category'
    }));
}

const BUYIT_OUT_OF_STOCK_IDS = new Set([
    'apple-macbook-pro-m5',
    'apple-watch-se-2'
]);

Object.values(BUYIT_PRODUCT_CATALOG).forEach((product) => {
    const normalizedPrice = parsePrice(product.price);
    const normalizedRegularPrice = parsePrice(product.regularPrice);
    product.price = normalizedPrice;
    product.regularPrice = normalizedRegularPrice > 0
        ? normalizedRegularPrice
        : Math.round(normalizedPrice * BUYIT_REGULAR_PRICE_MULTIPLIER);
    product.image = String(product.localImage || product.image || 'buyit-logo.png');

    if (!Array.isArray(product.specifications)) {
        product.specifications = [];
    }
    product.featured = Boolean(product.featured);
    const normalizedSortOrder = Number(product.sortOrder);
    product.sortOrder = Number.isFinite(normalizedSortOrder) ? normalizedSortOrder : Number.MAX_SAFE_INTEGER;
    if (typeof product.inStock !== 'boolean') {
        product.inStock = !BUYIT_OUT_OF_STOCK_IDS.has(product.id);
    }
});

try {
    const adminStatusMapRaw = localStorage.getItem('buyit_admin_product_status_map') || '{}';
    const adminStatusMap = JSON.parse(adminStatusMapRaw);
    if (adminStatusMap && typeof adminStatusMap === 'object') {
        Object.keys(adminStatusMap).forEach((productId) => {
            const catalogProduct = BUYIT_PRODUCT_CATALOG[productId];
            if (!catalogProduct) {
                return;
            }

            const override = adminStatusMap[productId] || {};
            if (typeof override.inStock === 'boolean') {
                catalogProduct.inStock = override.inStock;
                return;
            }

            const normalizedStatus = String(override.status || '').trim().toLowerCase();
            if (normalizedStatus) {
                catalogProduct.inStock = normalizedStatus === 'active';
            }
        });
    }
} catch (_error) {
    // Ignore invalid admin status payloads and keep default catalog availability.
}

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
window.BUYIT_CATEGORY_MAP = BUYIT_CATEGORY_MAP;
window.BUYIT_CATEGORY_DISPLAY_MAP = BUYIT_CATEGORY_DISPLAY_MAP;
window.BUYIT_CATEGORY_ICON_MAP = BUYIT_CATEGORY_ICON_MAP;
window.BUYIT_SORT_OPTIONS = BUYIT_SORT_OPTIONS;
window.BUYIT_NORMALIZE_CATEGORY = normalizeCategory;
window.BUYIT_GET_CATEGORY_DISPLAY_NAME = getCategoryDisplayName;
window.BUYIT_GET_CATEGORY_CARD_ITEMS = getCategoryCardItems;

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

function getPasswordStrengthLevel(password, options = {}) {
    const value = String(password || '');
    const {
        emptyLabel = '—',
        easyLabel = 'Easy',
        strongLabel = 'Strong',
        veryStrongLabel = 'VeryStrong',
        emptyClass = '',
        easyClass = 'easy',
        strongClass = 'strong',
        veryStrongClass = 'verystrong'
    } = options;

    if (!value) {
        return {
            label: emptyLabel,
            className: emptyClass,
            score: 0
        };
    }

    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score <= 1) {
        return {
            label: easyLabel,
            className: easyClass,
            score
        };
    }
    if (score <= 3) {
        return {
            label: strongLabel,
            className: strongClass,
            score
        };
    }
    return {
        label: veryStrongLabel,
        className: veryStrongClass,
        score
    };
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
window.BUYIT_GET_PASSWORD_STRENGTH = getPasswordStrengthLevel;

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
    sessionStorage.setItem('buyit_checkout_source', 'buyNow');
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

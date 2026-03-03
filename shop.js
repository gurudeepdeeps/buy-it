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

const BUYIT_PRODUCT_CATALOG = {};
const BUYIT_PRODUCTS_CACHE_KEY = 'buyit_products_cache_v1';
const BUYIT_PRODUCTS_CACHE_TTL_MS = 10 * 60 * 1000;

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

function parseFirestoreValue(value) {
    if (!value || typeof value !== 'object') {
        return null;
    }

    if ('nullValue' in value) return null;
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('booleanValue' in value) return Boolean(value.booleanValue);
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) {
        const values = Array.isArray(value.arrayValue?.values) ? value.arrayValue.values : [];
        return values.map((entry) => parseFirestoreValue(entry));
    }
    if ('mapValue' in value) {
        const fields = value.mapValue?.fields || {};
        const result = {};
        Object.keys(fields).forEach((key) => {
            result[key] = parseFirestoreValue(fields[key]);
        });
        return result;
    }
    return null;
}

function normalizeFirestoreProduct(documentItem, index) {
    const docPath = String(documentItem?.name || '');
    const docId = docPath ? docPath.split('/').pop() : `product-${index + 1}`;
    const fields = documentItem?.fields || {};

    const raw = {};
    Object.keys(fields).forEach((fieldName) => {
        raw[fieldName] = parseFirestoreValue(fields[fieldName]);
    });

    const id = String(raw.id || docId || '').trim();
    if (!id) {
        return null;
    }

    const title = String(raw.title || raw.name || '').trim() || 'Product';
    const category = normalizeCategory(raw.category || 'general') || 'general';
    const price = parsePrice(raw.price);
    const regularPrice = parsePrice(raw.regularPrice) || Math.round(price * BUYIT_REGULAR_PRICE_MULTIPLIER);

    const imageUrl = String(raw.imageUrl || raw.image || '').trim();
    const image = imageUrl || 'buyit-logo.png';
    const galleryImages = Array.isArray(raw.galleryImages)
        ? raw.galleryImages.map((entry) => String(entry || '').trim()).filter(Boolean)
        : [];

    const specifications = Array.isArray(raw.specifications)
        ? raw.specifications.map((entry) => String(entry || '').trim()).filter(Boolean)
        : [];

    const inStock = typeof raw.inStock === 'boolean'
        ? raw.inStock
        : Number(raw.stock || 0) > 0 || raw.isActive !== false;

    return {
        id,
        title,
        category,
        price,
        regularPrice,
        image,
        imageUrl,
        imagePath: String(raw.imagePath || '').trim(),
        galleryImages: galleryImages.length > 0 ? galleryImages : [image],
        specifications,
        featured: Boolean(raw.featured),
        sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : (index + 1),
        inStock,
        tags: Array.isArray(raw.tags) ? raw.tags : [],
        createdAt: raw.createdAt || null,
        updatedAt: raw.updatedAt || null
    };
}

function upsertCategoryDisplay(category) {
    if (!category) {
        return;
    }

    BUYIT_CATEGORY_MAP[category] = category;
    if (!BUYIT_CATEGORY_DISPLAY_MAP[category]) {
        BUYIT_CATEGORY_DISPLAY_MAP[category] = toCategoryLabel(category);
    }
    if (!BUYIT_CATEGORY_ICON_MAP[category]) {
        BUYIT_CATEGORY_ICON_MAP[category] = 'category';
    }
}

async function fetchProductsFromFirestore() {
    const runtimeProjectId = String(window.BUYIT_FIREBASE_CONFIG?.projectId || '').trim();
    const projectId = runtimeProjectId || 'buy-it-2514';
    const endpointBase = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/products`;

    let pageToken = '';
    const allDocuments = [];

    do {
        const url = new URL(endpointBase);
        url.searchParams.set('pageSize', '200');
        if (pageToken) {
            url.searchParams.set('pageToken', pageToken);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Failed to fetch products from Firestore: ${response.status}`);
        }

        const payload = await response.json();
        const documents = Array.isArray(payload?.documents) ? payload.documents : [];
        allDocuments.push(...documents);
        pageToken = String(payload?.nextPageToken || '');
    } while (pageToken);

    return allDocuments
        .map((documentItem, index) => normalizeFirestoreProduct(documentItem, index))
        .filter(Boolean);
}

function replaceCatalogProducts(products) {
    Object.keys(BUYIT_PRODUCT_CATALOG).forEach((key) => {
        delete BUYIT_PRODUCT_CATALOG[key];
    });

    products.forEach((product) => {
        BUYIT_PRODUCT_CATALOG[product.id] = product;
        upsertCategoryDisplay(product.category);
    });
}

function loadCachedCatalogProducts() {
    try {
        const raw = localStorage.getItem(BUYIT_PRODUCTS_CACHE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        const savedAt = Number(parsed?.savedAt || 0);
        const products = Array.isArray(parsed?.products) ? parsed.products : [];

        if (!savedAt || Date.now() - savedAt > BUYIT_PRODUCTS_CACHE_TTL_MS) {
            return [];
        }

        return products
            .filter((product) => product && product.id && product.title)
            .map((product, index) => ({
                ...product,
                id: String(product.id),
                title: String(product.title),
                category: normalizeCategory(product.category || 'general') || 'general',
                price: parsePrice(product.price),
                regularPrice: parsePrice(product.regularPrice) || Math.round(parsePrice(product.price) * BUYIT_REGULAR_PRICE_MULTIPLIER),
                sortOrder: Number.isFinite(Number(product.sortOrder)) ? Number(product.sortOrder) : (index + 1),
                image: String(product.image || product.imageUrl || 'buyit-logo.png').trim() || 'buyit-logo.png',
                galleryImages: Array.isArray(product.galleryImages)
                    ? product.galleryImages.map((entry) => String(entry || '').trim()).filter(Boolean)
                    : [String(product.image || product.imageUrl || 'buyit-logo.png').trim() || 'buyit-logo.png'],
                tags: Array.isArray(product.tags) ? product.tags : [],
                featured: Boolean(product.featured)
            }));
    } catch (_error) {
        return [];
    }
}

function saveCachedCatalogProducts(products) {
    try {
        localStorage.setItem(BUYIT_PRODUCTS_CACHE_KEY, JSON.stringify({
            savedAt: Date.now(),
            products: Array.isArray(products) ? products : []
        }));
    } catch (_error) {
    }
}

const BUYIT_PRODUCTS_READY = (async () => {
    let dispatchedInitialLoadedEvent = false;
    try {
        const cachedProducts = loadCachedCatalogProducts();
        if (cachedProducts.length > 0) {
            replaceCatalogProducts(cachedProducts);
            window.dispatchEvent(new CustomEvent('buyitProductsLoaded', {
                detail: { count: Object.keys(BUYIT_PRODUCT_CATALOG).length, source: 'cache' }
            }));
            dispatchedInitialLoadedEvent = true;
        }

        const products = await fetchProductsFromFirestore();
        replaceCatalogProducts(products);
        saveCachedCatalogProducts(products);
    } catch (error) {
        console.error('Could not load products from Firestore.', error);
        if (!dispatchedInitialLoadedEvent) {
            replaceCatalogProducts([]);
        }
    } finally {
        window.dispatchEvent(new CustomEvent('buyitProductsLoaded', {
            detail: { count: Object.keys(BUYIT_PRODUCT_CATALOG).length, source: 'network' }
        }));
    }
})();

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
window.BUYIT_PRODUCTS_READY = BUYIT_PRODUCTS_READY;

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

function setAccountLinkState(isLoggedIn) {
    const accountLinks = [];
    const seen = new Set();

    const addAccountLink = (link) => {
        if (!link || seen.has(link)) {
            return;
        }
        seen.add(link);
        accountLinks.push(link);
    };

    document.querySelectorAll('a[title="Account / Login"], a[title="Login"], a[title="Account"]').forEach(addAccountLink);
    document.querySelectorAll('img[alt="User Avatar"]').forEach((avatar) => addAccountLink(avatar.closest('a')));
    document.querySelectorAll('.buyit-login-label').forEach((label) => addAccountLink(label.closest('a')));

    const defaultHoverClasses = ['hover:bg-slate-50', 'hover:text-primary'];
    const loginHighlightClasses = [
        'bg-primary',
        'text-white',
        'border-primary',
        'shadow-md',
        'ring-4',
        'ring-primary/30',
        'transition-all',
        'duration-200',
        'hover:bg-primary',
        'hover:text-white',
        'hover:shadow-lg',
        'hover:-translate-y-0.5'
    ];
    accountLinks.forEach((link) => {
        const avatarContainer = link.querySelector('div');
        let loginLabel = link.querySelector('.buyit-login-label');

        if (isLoggedIn) {
            link.href = 'account.html';
            link.title = 'Account';
            link.classList.remove(...loginHighlightClasses);
            link.classList.add(...defaultHoverClasses);
            if (avatarContainer) {
                avatarContainer.classList.remove('hidden');
            }
            if (loginLabel) {
                loginLabel.remove();
            }
            return;
        }

        link.href = 'login.html';
        link.title = 'Login';
        link.classList.remove(...defaultHoverClasses);
        link.classList.add(...loginHighlightClasses);
        if (avatarContainer) {
            avatarContainer.classList.add('hidden');
        }

        if (!loginLabel) {
            loginLabel = document.createElement('span');
            loginLabel.className = 'buyit-login-label text-sm font-semibold text-white px-2';
            loginLabel.textContent = 'Login';
            link.appendChild(loginLabel);
        }
    });
}

async function initAccountHeaderAuthState() {
    setAccountLinkState(false);
    try {
        const [{ auth }, { onAuthStateChanged }] = await Promise.all([
            import('./firebase-config.js'),
            import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js')
        ]);

        onAuthStateChanged(auth, (user) => {
            const isLoggedIn = !!user;
            setAccountLinkState(isLoggedIn);
            if (isLoggedIn) {
                updateAccountAvatarPlaceholders();
            }
        });
    } catch (error) {
        setAccountLinkState(false);
    }
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
    initAccountHeaderAuthState();
});

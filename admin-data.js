(function () {
  const PRODUCTS_KEY = 'buyit_admin_products';
  const ORDERS_KEY = 'buyit_admin_orders';
  const SETTINGS_KEY = 'buyit_admin_settings';
  const PRODUCT_STATUS_MAP_KEY = 'buyit_admin_product_status_map';
  const CATEGORIES_KEY = 'buyit_admin_categories';

  function parseJSON(raw, fallback) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(fallback)
        ? (Array.isArray(parsed) ? parsed : fallback)
        : (parsed && typeof parsed === 'object' ? parsed : fallback);
    } catch (_error) {
      return fallback;
    }
  }

  function slugify(value) {
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

  function normalizeCategoryEntry(entry) {
    const raw = typeof entry === 'string' ? entry : (entry?.slug || entry?.id || entry?.label || '');
    const slug = slugify(raw);
    if (!slug) {
      return null;
    }

    const label = String(entry?.label || toCategoryLabel(slug)).trim() || toCategoryLabel(slug);
    const icon = String(entry?.icon || 'category').trim() || 'category';
    return { slug, label, icon };
  }

  function normalizeProductStatus(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'active' || normalized === 'in stock' || normalized === 'instock') {
      return 'Active';
    }
    if (normalized === 'out of stock' || normalized === 'out_of_stock' || normalized === 'outofstock') {
      return 'Out of Stock';
    }
    return normalized === 'out' ? 'Out of Stock' : 'Active';
  }

  function statusToInStock(status) {
    return normalizeProductStatus(status) === 'Active';
  }

  function ensureProductSeed() {
    const existing = parseJSON(localStorage.getItem(PRODUCTS_KEY), []);
    if (existing.length > 0) {
      return existing;
    }

    const seeded = [
      { id: 'iphone-17-pro-max', title: 'iPhone 17 Pro Max', category: 'smartphones', price: 130000, status: 'Active', image: 'product-images/smartphones/iphone1.jpg' },
      { id: 'apple-macbook-pro-m5', title: 'Apple MacBook Pro M5', category: 'laptops', price: 170000, status: 'Out of Stock', image: 'product-images/laptops/mac1.jpg' },
      { id: 'apple-ipad-pro-m5', title: 'Apple iPad Pro M5', category: 'tablets', price: 115000, status: 'Active', image: 'product-images/tablets/ipad1.jpg' },
      { id: 'apple-airpods-max-headset', title: 'Apple AirPods Max Headset', category: 'audio', price: 60000, status: 'Active', image: 'product-images/audio/apple-headphone1.jpg' },
      { id: 'apple-watch-se-2', title: 'Apple Watch SE 2', category: 'wearables', price: 15000, status: 'Out of Stock', image: 'product-images/wearables/iwatch1.jpg' },
      { id: 'blue-evil-eye-pendant-chain', title: 'Blue Evil Eye Pendant Chain', category: 'accessories', price: 19, status: 'Active', image: 'product-images/accessories/evileye1.jpg' }
    ];

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function normalizeProduct(product) {
    const title = String(product?.title || product?.name || '').trim() || 'Untitled Product';
    const id = String(product?.id || slugify(title) || ('product-' + Date.now())).trim();
    const statusFromLegacyStock = Number(product?.stock || 0) > 0 ? 'Active' : 'Out of Stock';
    const status = normalizeProductStatus(product?.status || statusFromLegacyStock);
    return {
      id,
      title,
      category: String(product?.category || 'general').trim().toLowerCase(),
      price: Number(product?.price || 0),
      status,
      inStock: statusToInStock(status),
      image: String(product?.image || 'buyit-logo.png').trim() || 'buyit-logo.png'
    };
  }

  function normalizeOrder(order, index) {
    const items = Array.isArray(order?.items) ? order.items : [];
    const computedAmount = items.reduce((sum, item) => sum + (Number(item?.price || 0) * Math.max(1, Number(item?.quantity || 1))), 0);
    const customerName = order?.customer
      || order?.customerName
      || `${order?.address?.['first-name'] || ''} ${order?.address?.['last-name'] || ''}`.trim()
      || 'Guest Customer';

    return {
      ...order,
      id: order?.id || order?.orderId || ('ORD-' + String(index + 1).padStart(4, '0')),
      customer: customerName,
      date: order?.date || order?.createdAt || order?.placedAt || new Date().toISOString(),
      amount: Number(order?.amount || computedAmount || 0),
      status: String(order?.status || 'Processing')
    };
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

    const statusMap = products.reduce((accumulator, product) => {
      if (!product?.id) {
        return accumulator;
      }

      accumulator[product.id] = {
        status: normalizeProductStatus(product.status),
        inStock: statusToInStock(product.status)
      };
      return accumulator;
    }, {});

    localStorage.setItem(PRODUCT_STATUS_MAP_KEY, JSON.stringify(statusMap));
  }

  function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    localStorage.setItem('buyit_orders', JSON.stringify(orders));
  }

  function getProducts() {
    const products = ensureProductSeed();
    const normalizedProducts = products.map(normalizeProduct);
    saveProducts(normalizedProducts);
    return normalizedProducts;
  }

  function getCategories() {
    const stored = parseJSON(localStorage.getItem(CATEGORIES_KEY), []);
    const normalized = stored
      .map(normalizeCategoryEntry)
      .filter(Boolean);

    const productDerived = getProducts()
      .map((product) => normalizeCategoryEntry(product.category))
      .filter(Boolean);

    const mergedMap = new Map();
    [...normalized, ...productDerived].forEach((entry) => {
      mergedMap.set(entry.slug, entry);
    });

    const merged = Array.from(mergedMap.values());
    saveCategories(merged);
    return merged;
  }

  function addCategory(categoryInput) {
    const next = normalizeCategoryEntry(categoryInput);
    if (!next) {
      return null;
    }

    const existing = getCategories();
    if (existing.some((category) => category.slug === next.slug)) {
      return existing.find((category) => category.slug === next.slug) || next;
    }

    const updated = [...existing, next];
    saveCategories(updated);
    return next;
  }

  function renameCategory(fromSlugInput, toInput) {
    const fromSlug = slugify(fromSlugInput);
    const toEntry = normalizeCategoryEntry(toInput);
    if (!fromSlug || !toEntry) {
      return { ok: false, reason: 'invalid' };
    }

    const categories = getCategories();
    if (!categories.some((category) => category.slug === fromSlug)) {
      return { ok: false, reason: 'missing' };
    }
    if (fromSlug !== toEntry.slug && categories.some((category) => category.slug === toEntry.slug)) {
      return { ok: false, reason: 'exists' };
    }

    const updatedCategories = categories.map((category) => {
      if (category.slug !== fromSlug) {
        return category;
      }
      return { ...category, ...toEntry };
    });
    saveCategories(updatedCategories);

    const updatedProducts = getProducts().map((product) => {
      if (slugify(product.category) !== fromSlug) {
        return product;
      }
      return { ...product, category: toEntry.slug };
    });
    saveProducts(updatedProducts);

    return { ok: true, category: toEntry };
  }

  function deleteCategory(slugInput, replacementSlugInput) {
    const slug = slugify(slugInput);
    const replacementSlug = slugify(replacementSlugInput);
    if (!slug) {
      return { ok: false, reason: 'invalid' };
    }

    const categories = getCategories();
    const products = getProducts();
    const usageCount = products.filter((product) => slugify(product.category) === slug).length;

    if (usageCount > 0 && !replacementSlug) {
      return { ok: false, reason: 'in-use', usageCount };
    }

    if (replacementSlug && replacementSlug !== slug && !categories.some((category) => category.slug === replacementSlug)) {
      return { ok: false, reason: 'replacement-missing' };
    }

    if (replacementSlug && replacementSlug !== slug) {
      const reassigned = products.map((product) => {
        if (slugify(product.category) !== slug) {
          return product;
        }
        return { ...product, category: replacementSlug };
      });
      saveProducts(reassigned);
    }

    const updatedCategories = categories.filter((category) => category.slug !== slug);
    saveCategories(updatedCategories);
    return { ok: true };
  }

  function addProduct(product) {
    const products = getProducts();
    const normalized = normalizeProduct(product);

    let uniqueId = normalized.id;
    let counter = 2;
    while (products.some((item) => item.id === uniqueId)) {
      uniqueId = `${normalized.id}-${counter}`;
      counter += 1;
    }

    const payload = { ...normalized, id: uniqueId };
    const nextProducts = [...products, payload];
    saveProducts(nextProducts);
    return payload;
  }

  function updateProduct(productId, updates) {
    const products = getProducts();
    const index = products.findIndex((product) => product.id === productId);
    if (index === -1) {
      return null;
    }

    const merged = normalizeProduct({ ...products[index], ...updates, id: productId });
    const nextProducts = [...products];
    nextProducts[index] = merged;
    saveProducts(nextProducts);
    return merged;
  }

  function deleteProduct(productId) {
    const products = getProducts();
    const nextProducts = products.filter((product) => product.id !== productId);
    saveProducts(nextProducts);
    return nextProducts.length !== products.length;
  }

  function getOrders() {
    const adminOrders = parseJSON(localStorage.getItem(ORDERS_KEY), []);
    if (adminOrders.length > 0) {
      return adminOrders.map(normalizeOrder);
    }

    const storefrontOrders = parseJSON(localStorage.getItem('buyit_orders'), []).map(normalizeOrder);
    if (storefrontOrders.length > 0) {
      saveOrders(storefrontOrders);
    }
    return storefrontOrders;
  }

  function updateOrderStatus(orderId, nextStatus) {
    const orders = getOrders();
    const nextOrders = orders.map((order) => {
      if (String(order.id) !== String(orderId)) {
        return order;
      }
      return {
        ...order,
        status: String(nextStatus || 'Processing')
      };
    });
    saveOrders(nextOrders);
    return nextOrders;
  }

  function getSettings() {
    return parseJSON(localStorage.getItem(SETTINGS_KEY), {});
  }

  function saveSettings(payload) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  }

  function formatCurrency(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(value) {
    if (!value) {
      return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function statusBadgeClass(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'delivered') return 'bg-green-100 text-green-700';
    if (normalized === 'shipped') return 'bg-blue-100 text-blue-700';
    if (normalized === 'processing') return 'bg-amber-100 text-amber-700';
    if (normalized === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  }

  window.AdminData = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    addCategory,
    renameCategory,
    deleteCategory,
    getOrders,
    updateOrderStatus,
    getSettings,
    saveSettings,
    formatCurrency,
    formatDate,
    statusBadgeClass
  };
})();

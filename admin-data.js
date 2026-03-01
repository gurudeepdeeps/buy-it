(function () {
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

  function getProducts() {
    return parseJSON(localStorage.getItem('buyit_admin_products'), []);
  }

  function getOrders() {
    const adminOrders = parseJSON(localStorage.getItem('buyit_admin_orders'), []);
    if (adminOrders.length > 0) {
      return adminOrders;
    }
    return parseJSON(localStorage.getItem('buyit_orders'), []);
  }

  function getSettings() {
    return parseJSON(localStorage.getItem('buyit_admin_settings'), {});
  }

  function saveSettings(payload) {
    localStorage.setItem('buyit_admin_settings', JSON.stringify(payload));
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
    getOrders,
    getSettings,
    saveSettings,
    formatCurrency,
    formatDate,
    statusBadgeClass
  };
})();

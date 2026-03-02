# 🛍️ Buy It — Responsive E-Commerce Frontend

A modern, multi-page e-commerce website built with HTML, CSS, and JavaScript. **Buy It** includes customer-facing shopping flows and admin-facing management pages, designed to be clean, responsive, and easy to extend.

---

## ✨ Highlights

- Responsive layout for desktop and mobile-friendly browsing
- Complete storefront flow: home → product listing → product details → cart → checkout
- User account pages: login (Phone OTP / Google), profile, addresses, orders, wishlist
- Policy and support pages for production-style UX
- Dedicated admin pages for products, orders, and settings
- Lightweight stack with no heavy framework dependencies

---

## 🧩 Tech Stack

- **HTML5** for page structure
- **CSS3** (`main.css`, `products.css`, `admin.css`) for styling and responsive behavior
- **Vanilla JavaScript** (`shop.js`) for interactive storefront logic
- **Firebase** for Authentication, Firestore, Functions, and Storage integration

---

## 🔐 Authentication

- Login is **signup-free** and supports only:
   - **Phone Number + OTP**
   - **Continue with Google**
- Account pages are protected using Firebase auth state checks.
- Sign-out is handled with Firebase `signOut`.

---

## ✅ Firebase Console Checklist

- **Authentication → Sign-in method**
   - Enable **Phone** provider
   - Enable **Google** provider
- **Authentication → Settings → Authorized domains**
   - Add `localhost`
   - Add your production domain (for example, `buy-it-shop.netlify.app`)
- **Firestore Database**
   - Create database in production mode
   - Select nearest region for your users
   - Deploy rules/indexes from project (`firestore.rules`, `firestore.indexes.json`)
- **Storage**
   - Enable Firebase Storage in the same regional family
   - Upload product images under `products/...` paths
   - Deploy storage rules to allow controlled access

---

## 📁 Project Structure

```text
Buy it/
├─ index.html
├─ products.html
├─ product.html
├─ cart.html
├─ checkout.html
├─ account.html
├─ profile.html
├─ admin.html
├─ admin-orders.html
├─ admin-products.html
├─ admin-settings.html
├─ main.css
├─ products.css
├─ admin.css
├─ shop.js
└─ screenshots/
   ├─ home.png
   ├─ products.png
   ├─ product.png
   ├─ cart.png
   ├─ checkout.png
   ├─ profile.png
   └─ admin.png
```

---

## 🚀 Run Locally

1. Open terminal in the project folder.
2. Start a static server:

```bash
npx --yes serve . -l 5500
```

3. Visit:

```text
http://localhost:5500
```

---

## 🖼️ Website Screenshots

### Home + Products

| Home Page | Products Page |
|---|---|
| ![Home](screenshots/home.png) | ![Products](screenshots/products.png) |

### Product + Cart

| Product Details | Shopping Cart |
|---|---|
| ![Product](screenshots/product.png) | ![Cart](screenshots/cart.png) |

### Checkout + Profile

| Checkout | User Profile |
|---|---|
| ![Checkout](screenshots/checkout.png) | ![Profile](screenshots/profile.png) |

### Admin Panel

| Admin Dashboard |
|---|
| ![Admin](screenshots/admin.png) |

---

## 📄 Pages Included

### Storefront
- `index.html`
- `products.html`
- `product.html`
- `devices.html`
- `cart.html`
- `checkout.html`
- `payment.html`

### User & Account
- `login.html`
- `account.html`
- `profile.html`
- `addresses.html`
- `orders.html`
- `wishlist.html`

### Admin
- `admin.html`
- `admin-products.html`
- `admin-orders.html`
- `admin-settings.html`

### Info / Legal
- `about.html`
- `contact.html`
- `privacy-policy.html`
- `terms-and-conditions.html`
- `shipping-policy.html`
- `return-and-refund-policy.html`
- `order-cancellation-policy.html`
- `payment-and-security.html`

---

## 🔮 Next Improvements

- Add backend APIs for products, cart, checkout, and authentication
- Connect admin pages to live inventory/order data
- Add form validation and error handling across all user flows
- Add accessibility enhancements (ARIA labels, keyboard navigation checks)
- Add deployment pipeline (GitHub Pages, Netlify, or Vercel)

---

## 👤 Author

Built by **Gurudeep**.

If you like this project, consider adding ⭐ on GitHub.
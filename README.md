# 🛒 Frontend Challenge: "ShopLite" E-Commerce Store

**Difficulty:** Hard  
**Test Cases:** 30 (Automated)  
**Stack:** React (Hooks, Context API, Router)

## 📝 The Scenario

You are building a single-page e-commerce store. The application must fetch a list of products, allow users to filter/sort them, view details, and manage a shopping cart.

## ⚙️ Setup

1.  **Create App:** `npx create-react-app shop-lite`
2.  **Install Router:** `npm install react-router-dom`
3.  **Install Testing Libs:** `npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom`

## 📋 Requirements

### 1. Home Page (`/`)

- **Fetch Data:** Load products from `https://fakestoreapi.com/products` (or use the provided mock).
- **Loading/Error:** Show a "Loading..." text while fetching. Show "Error" if it fails.
- **Display:** Grid of product cards (Image, Title, Price, "Add to Cart" button).
- **Filters:**
  - **Search Bar:** Filter by title.
  - **Category Dropdown:** Filter by category.
- **Sort:** Sort by Price (Low-to-High vs High-to-Low).

### 2. Product Detail Page (`/product/:id`)

- Clicking a product title navigates to this page.
- Shows full description and larger image.
- "Back" button returns to Home.

### 3. Shopping Cart

- **Global State:** Cart data must persist across pages.
- **Add Item:**
  - If item exists, increment quantity.
  - If new, add to cart with quantity 1.
- **Cart View:**
  - List items with Quantity controls (+ / -).
  - Remove button.
  - **Total Price:** accurately calculated.

---

## 🧪 The 30 Test Cases (Grading Rubric)

Your app must pass these checks in `App.test.js`:

| Group            | Tests | Focus                                         |
| :--------------- | :---- | :-------------------------------------------- |
| **Structure**    | 1-5   | Header, Navigation, Basic Rendering           |
| **Data**         | 6-9   | Async Fetching, Loading, Error States         |
| **Interactions** | 10-15 | Searching, Filtering, Sorting                 |
| **Navigation**   | 16-19 | Routing between Home and Details              |
| **Cart Logic**   | 20-27 | Adding, Removing, Updating Quantities, Totals |
| **Edge Cases**   | 28-30 | Empty states, 404 Pages                       |

## 💡 Critical Test IDs

You **MUST** use these `data-testid` attributes:

- `loading-msg`, `error-msg`
- `product-item` (The card container)
- `search-input`, `category-select`, `sort-select`
- `add-to-cart-btn`
- `cart-link` (The nav link to view cart)
- `cart-item`, `cart-total`, `cart-empty`
- `qty-increase`, `qty-decrease`, `remove-btn`

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// --- MOCK DATA & SETUP ---
const mockProducts = [
  {
    id: 1,
    title: "Backpack",
    price: 50,
    category: "travel",
    description: " sturdy",
  },
  {
    id: 2,
    title: "T-Shirt",
    price: 20,
    category: "clothing",
    description: "cotton",
  },
  {
    id: 3,
    title: "Shoes",
    price: 100,
    category: "clothing",
    description: "running",
  },
];

// Helper to wrap components in Router if you aren't doing it in App.js
const renderApp = () =>
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

global.fetch = jest.fn();

describe("ShopLite Frontend Exam (30 Tests)", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });
  });

  // --- SECTION 1: STRUCTURE & RENDERING (5) ---

  test("1. Renders Header and Main Layout", async () => {
    renderApp();
    expect(screen.getByText(/ShopLite/i)).toBeInTheDocument();
  });

  test("2. Renders Navigation Links", async () => {
    renderApp();
    expect(screen.getByTestId("cart-link")).toBeInTheDocument();
  });

  test("3. Renders Search Bar", async () => {
    renderApp();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  test("4. Renders Category Filter", async () => {
    renderApp();
    expect(screen.getByTestId("category-select")).toBeInTheDocument();
  });

  test("5. Renders Sort Dropdown", async () => {
    renderApp();
    expect(screen.getByTestId("sort-select")).toBeInTheDocument();
  });

  // --- SECTION 2: DATA FETCHING (4) ---

  test("6. Shows Loading State initially", () => {
    // Delay the fetch response
    fetch.mockImplementation(() => new Promise(() => {}));
    renderApp();
    expect(screen.getByTestId("loading-msg")).toBeInTheDocument();
  });

  test("7. Renders Products after Fetch", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getAllByTestId("product-item")).toHaveLength(3);
    });
  });

  test("8. Displays Product Info Correctly", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  test("9. Handles Fetch Error", async () => {
    fetch.mockRejectedValue(new Error("API Down"));
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId("error-msg")).toBeInTheDocument();
    });
  });

  // --- SECTION 3: FILTERING & SORTING (6) ---

  test("10. Search Filter functionality", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const search = screen.getByTestId("search-input");
    fireEvent.change(search, { target: { value: "Shirt" } });

    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    expect(screen.queryByText("Backpack")).not.toBeInTheDocument();
  });

  test("11. Category Filter functionality", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const select = screen.getByTestId("category-select");
    fireEvent.change(select, { target: { value: "travel" } });

    expect(screen.getByText("Backpack")).toBeInTheDocument();
    expect(screen.queryByText("T-Shirt")).not.toBeInTheDocument();
  });

  test("12. Sort Price: Low to High", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const sort = screen.getByTestId("sort-select");
    fireEvent.change(sort, { target: { value: "low-high" } });

    const items = screen.getAllByTestId("product-item");
    expect(items[0]).toHaveTextContent("T-Shirt"); // $20
    expect(items[2]).toHaveTextContent("Shoes"); // $100
  });

  test("13. Sort Price: High to Low", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const sort = screen.getByTestId("sort-select");
    fireEvent.change(sort, { target: { value: "high-low" } });

    const items = screen.getAllByTestId("product-item");
    expect(items[0]).toHaveTextContent("Shoes"); // $100
  });

  test("14. Search clears when empty", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    const search = screen.getByTestId("search-input");

    fireEvent.change(search, { target: { value: "XYZ" } }); // No results
    expect(screen.queryByTestId("product-item")).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "" } }); // Reset
    expect(screen.getAllByTestId("product-item")).toHaveLength(3);
  });

  test("15. Filters reset when Category changes", async () => {
    // Implementation choice: Changing category might clear search, or work together.
    // We test that they work together here.
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const search = screen.getByTestId("search-input");
    const select = screen.getByTestId("category-select");

    fireEvent.change(select, { target: { value: "clothing" } });
    fireEvent.change(search, { target: { value: "Shoes" } });

    expect(screen.getByText("Shoes")).toBeInTheDocument();
    expect(screen.queryByText("T-Shirt")).not.toBeInTheDocument();
  });

  // --- SECTION 4: ROUTING (4) ---

  test("16. Clicking Product navigates to Detail Page", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    const link = screen.getAllByText(/Backpack/i)[0]; // Assuming title is a link
    fireEvent.click(link);

    expect(screen.getByText("sturdy")).toBeInTheDocument(); // Description check
  });

  test('17. Detail Page has "Back" button', async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByText(/Backpack/i)[0]);

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  test("18. Back button returns to Home", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByText(/Backpack/i)[0]); // Go to detail
    fireEvent.click(screen.getByRole("button", { name: /back/i })); // Go back

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  test("19. 404 Page for Invalid Routes", () => {
    window.history.pushState({}, "Test Page", "/bad/route");
    renderApp();
    expect(screen.getByText(/404|Not Found/i)).toBeInTheDocument();
  });

  // --- SECTION 5: CART LOGIC (8) ---

  test('20. Empty Cart shows "Empty" message', async () => {
    renderApp();
    const cartLink = screen.getByTestId("cart-link");
    fireEvent.click(cartLink);
    expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
  });

  test("21. Add to Cart updates Cart Count", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Shoes"));

    const addBtns = screen.getAllByTestId("add-to-cart-btn");
    fireEvent.click(addBtns[2]); // Add Backpack

    const count = screen.getByTestId("cart-count"); // Badge on header
    expect(count).toHaveTextContent("1");
  });

  test("22. Adding SAME item increments Quantity, not new row", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    const addBtns = screen.getAllByTestId("add-to-cart-btn");

    fireEvent.click(addBtns[0]); // Add Backpack
    fireEvent.click(addBtns[0]); // Add Backpack again

    // Go to cart
    fireEvent.click(screen.getByTestId("cart-link"));

    const items = screen.getAllByTestId("cart-item");
    expect(items).toHaveLength(1); // Still 1 row
    expect(screen.getByTestId("qty-display")).toHaveTextContent("2");
  });

  test("23. Adding DIFFERENT item adds new row", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    const addBtns = screen.getAllByTestId("add-to-cart-btn");

    fireEvent.click(addBtns[0]); // Backpack
    fireEvent.click(addBtns[1]); // T-Shirt

    fireEvent.click(screen.getByTestId("cart-link"));
    expect(screen.getAllByTestId("cart-item")).toHaveLength(2);
  });

  test("24. Cart: Increment Quantity", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByTestId("add-to-cart-btn")[0]);
    fireEvent.click(screen.getByTestId("cart-link"));

    const incBtn = screen.getByTestId("qty-increase");
    fireEvent.click(incBtn);
    expect(screen.getByTestId("qty-display")).toHaveTextContent("2");
  });

  test("25. Cart: Decrement Quantity", async () => {
    // Setup: Add item twice
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    const addBtn = screen.getAllByTestId("add-to-cart-btn")[0];
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    fireEvent.click(screen.getByTestId("cart-link"));
    const decBtn = screen.getByTestId("qty-decrease");

    fireEvent.click(decBtn);
    expect(screen.getByTestId("qty-display")).toHaveTextContent("1");
  });

  test("26. Cart: Remove Item", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByTestId("add-to-cart-btn")[0]);
    fireEvent.click(screen.getByTestId("cart-link"));

    const removeBtn = screen.getByTestId("remove-btn");
    fireEvent.click(removeBtn);

    expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
  });

  test("27. Cart: Total Calculation", async () => {
    // Math: 1 Backpack ($50) + 2 T-Shirts ($20x2) = $90
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    const addBtns = screen.getAllByTestId("add-to-cart-btn");

    fireEvent.click(addBtns[0]); // $50
    fireEvent.click(addBtns[1]); // $20
    fireEvent.click(addBtns[1]); // $20

    fireEvent.click(screen.getByTestId("cart-link"));

    // Check total
    expect(screen.getByTestId("cart-total")).toHaveTextContent("90");
  });

  // --- SECTION 6: EDGE CASES (3) ---

  test("28. Decrementing Quantity 1 does NOT remove item (Safety check)", async () => {
    // Some apps remove, some stick at 1. We'll enforce sticking at 1 for safety.
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByTestId("add-to-cart-btn")[0]);
    fireEvent.click(screen.getByTestId("cart-link"));

    const decBtn = screen.getByTestId("qty-decrease");
    fireEvent.click(decBtn); // Should stay at 1

    expect(screen.getByTestId("qty-display")).toHaveTextContent("1");
    expect(screen.getAllByTestId("cart-item")).toHaveLength(1);
  });

  test("29. Cart state persists when navigating Back to Home", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));
    fireEvent.click(screen.getAllByTestId("add-to-cart-btn")[0]);

    // Go to Cart
    fireEvent.click(screen.getByTestId("cart-link"));
    expect(screen.getAllByTestId("cart-item")).toHaveLength(1);

    // Go Home (via Logo or Back)
    fireEvent.click(screen.getByText(/ShopLite/i));

    // Go Cart again
    fireEvent.click(screen.getByTestId("cart-link"));
    expect(screen.getAllByTestId("cart-item")).toHaveLength(1);
  });

  test("30. Data Fetch only happens once (Optimization)", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Backpack"));

    // Trigger re-renders
    const search = screen.getByTestId("search-input");
    fireEvent.change(search, { target: { value: "a" } });

    // Fetch should still be called only once
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

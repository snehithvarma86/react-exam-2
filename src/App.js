import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import "./App.css"; // Assume basic CSS exists
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";

// --- CONTEXT MOCK (Or implement Context API here) ---
// Hint: const CartContext = React.createContext();

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;

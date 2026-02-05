import { filterProducts } from "../utils/filterProductsBySearch";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
import { useCartContext } from "../context/CartContext";

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const { products, loading, errorMessage } = useProductContext();
  const { cartItems, setCartItems } = useCartContext();

  const navigate = useNavigate();

  const handleCart = (it) => {
    const checkIfAlreadyInCart = cartItems.find((i) => i.id === it.id);

    if (checkIfAlreadyInCart) {
      const temp = cartItems.map((i) =>
        i.id === it.id ? { ...i, value: i.value + 1 } : i,
      );
      setCartItems(temp);
    } else {
      setCartItems([...cartItems, { ...it, value: 1 }]);
    }
  };

  let filteredProdcts = filterProducts(
    products,
    searchValue.toLowerCase(),
    category,
  );

  if (sort === "low-high") {
    filteredProdcts = filteredProdcts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    filteredProdcts = filteredProdcts.sort((a, b) => b.price - a.price);
  }

  return (
    <div>
      <div className="filters">
        <input
          data-testid="search-input"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <select
          data-testid="category-select"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="travel">Travel</option>
          <option value="jewelery">Jewelery</option>
        </select>
        <select
          data-testid="sort-select"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid">
        {/* Map your products here */}
        {!loading &&
          filteredProdcts.length > 0 &&
          filteredProdcts.map((it) => {
            return (
              <div
                data-testid="product-item"
                className="product-card"
                key={it.id}
              >
                <img src={it.image} alt="" />
                <h3 onClick={() => navigate(`product/${it.id}`)}>{it.title}</h3>
                <p className="price">${it.price}</p>
                <button
                  data-testid="add-to-cart-btn"
                  onClick={() => handleCart(it)}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
      </div>

      {loading && <h1 data-testid="loading-msg">Loading...</h1>}
      {errorMessage !== "" && <h1 data-testid="error-msg">Error</h1>}
    </div>
  );
};

export default Home;

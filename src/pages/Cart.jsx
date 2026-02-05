import { useCartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, setCartItems } = useCartContext();

  const handleCart = (request, item) => {
    setCartItems((prev) => {
      switch (request) {
        case "add":
          return prev.map((i) =>
            i.id === item.id ? { ...i, value: i.value + 1 } : i,
          );

        case "subtract":
          return prev.map((i) =>
            i.id === item.id && i.value !== 1
              ? { ...i, value: i.value - 1 }
              : i,
          );

        case "remove":
          return prev.filter((i) => i.id !== item.id);

        default:
          return prev;
      }
    });
  };

  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + curr.value * curr.price,
    0,
  );

  return (
    <div className="cart-container">
      {cartItems.length === 0 && (
        <h2 data-testid="cart-empty">Cart is Empty</h2>
      )}

      {cartItems.length > 0 &&
        cartItems.map((it) => {
          return (
            <div data-testid="cart-item">
              <h4>{it.title}</h4>
              <div className="qty-controls">
                <button
                  data-testid="qty-decrease"
                  onClick={() => handleCart("subtract", it)}
                >
                  -
                </button>
                <span data-testid="qty-display">{it.value}</span>
                <button
                  data-testid="qty-increase"
                  onClick={() => handleCart("add", it)}
                >
                  +
                </button>
                <button
                  data-testid="remove-btn"
                  onClick={() => handleCart("remove", it)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

      <h3>
        Total: $<span data-testid="cart-total">{totalPrice}</span>
      </h3>
    </div>
  );
};

export default Cart;

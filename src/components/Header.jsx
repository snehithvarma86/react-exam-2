import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const Header = () => {
  const { cartItems } = useCartContext();

  return (
    <header>
      <Link to="/">ShopLite</Link>
      <Link to="/cart" data-testid="cart-link">
        Cart <span data-testid="cart-count">{cartItems.length}</span>
      </Link>
    </header>
  );
};

export default Header;

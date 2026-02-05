import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { fetchProducts } from "../api/fetchProducts";

const ProductContext = createContext();

export function useProductContext() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        let productsDetails = await fetchProducts();
        setProducts(productsDetails);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, errorMessage }}>
      {children}
    </ProductContext.Provider>
  );
}

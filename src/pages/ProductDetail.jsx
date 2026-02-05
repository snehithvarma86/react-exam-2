import { useNavigate, useParams } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { products } = useProductContext();
  const product = products.find((it) => it.id === Number(id));

  return (
    <div>
      <button onClick={() => navigate("/")} className="back-btn">
        Back
      </button>
      {product && (
        <div className="detail-container">
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <img src={product.image} alt={product.title} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

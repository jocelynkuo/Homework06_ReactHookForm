import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE}/api/${VITE_API_PATH}/products`,
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  return (
    <>
      <h1>這是Products</h1>

      <div className="container">
        <div className="row">
          {(products || []).map((product, index) => (
            <div className="col-md-4 mb-3" key={product.id}>
              <div className="card">
                <img
                  className="card-img-top"
                  src={product.imageUrl || null}
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">價格：{product.price}</p>
                  <p className="card-text">
                    <small className="text-muted">{product.unit}</small>
                  </p>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      handleView(product.id);
                    }}
                  >
                    按鈕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;

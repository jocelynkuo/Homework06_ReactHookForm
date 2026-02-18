import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`,
        );
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleView(id);
  }, [id]);

  const addToCart = async (id) => {
    try {
      const data = {
        product_id: `${id}`,
        qty: 1,
      };
      // console.log('id',dataToAdd.product_id)
      const response = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart`,
        { data },
      );
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>{product.title}</h1>
          <small className="text-muted">詳細內容</small>
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
                <p className="card-text">尺寸：{product.size}</p>
                <p className="card-text">
                  <small className="text-muted">{product.unit}</small>
                </p>
                <p className="card-text">內容：{product.content}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToCart(product.id)}
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;

import { useState, useEffect } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function Carts() {
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    const response = await axios.get(
      `${VITE_API_BASE}/api/${VITE_API_PATH}/cart`,
    );
    console.log(response.data.data);
    setCart(response.data.data);
  };
  useEffect(() => {
    getCart();
  }, []);

  const updateCart = async (cartId, productId, itemQty = 1) => {
    const datax = {
      data: {
        product_id: productId,
        qty: itemQty,
      },
    };
    console.log(datax.data);
    try {
      const response = await axios.put(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${cartId}`,
        datax,
      );
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeCartItem = async (id) => {
    try {
      const response = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`,
      );
      console.log(response);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeAllCartItems = async () => {
    try {
      const response = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/carts`,
      );
      console.log(response);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => removeAllCartItems()}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem, index) => (
            <tr key={index}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    removeCartItem(cartItem.id);
                  }}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) => {
                      if (e.target.value === "") return;
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        parseInt(e.target.value),
                      );
                    }}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {" "}
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart?.final_total || 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Carts;

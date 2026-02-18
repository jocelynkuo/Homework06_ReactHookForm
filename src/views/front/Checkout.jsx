import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { currency } from "../../utils/filter";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

// Why the product list qty doesn't work?

function Checkout() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const productModalRef = useRef(null);
  const [cartQty, setCartQty] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const getCart = async () => {
    const response = await axios.get(
      `${VITE_API_BASE}/api/${VITE_API_PATH}/cart`,
    );
    console.log(response.data.data);
    setCart(response.data.data);

  };

  const handleView = async (id) => {
    try {
      setLoadingProductId(id);
      const response = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`,
      );
      setProduct(response.data.product);
      console.log(response.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
      productModalRef.current.show();
    }
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/products`,
      );
      setProducts(response.data.products);
      console.log(products);
    } catch (error) {
      console.log(error.response);
    }
  };

  const addToCart = async (id, cartQty) => {
    try {
      setLoadingCartId(id);
      const data = {
        product_id: `${id}`,
        qty: cartQty,
      };
      // console.log('id',dataToAdd.product_id)
      const response = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/cart`,
        { data },
      );
      closeModal();
      getCart();
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingCartId(null);
    }
  };
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
      getCart();
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

  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/order`,
        { data },
      );
      console.log(response);
      getCart();
    } catch (error) {
      console.log(error);
    }
    console.log(formData);
  };

  useEffect(() => {
    getCart();

    getProducts();
    productModalRef.current = new bootstrap.Modal("#productModal");
  }, []);

  //   useEffect(() => {

  //   })

  return (
    <div className="container">
      {/* 產品列表  */}
      <div className="products-section mt-5 mb-6">
        <h2>產品列表</h2>
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <div
                    style={{
                      height: "100px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${product.imageUrl})`,
                    }}
                  ></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價：{product.origin_price}</del>
                  <div className="h5">特價：{product.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        handleView(product.id);
                      }}
                      disabled={loadingProductId === product.id}
                    >
                      {loadingProductId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        "查看更多"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        addToCart(product.id, cartQty);
                      }}
                      disabled={loadingCartId === product.id}
                    >
                      {loadingCartId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        "加到購物車"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 產品Modal */}
      <div className="modal" id="productModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">產品名稱：{product.name}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img className="w-100" src={product.imageUrl || null} />
              <p className="mt-3">產品內容：{product.content}</p>
              <p>產品描述：{product.description}</p>
              <p>
                價錢：<del>原價 $ {product.origin_price}</del>，特價：${" "}
                {product.price}
              </p>
              <div className="d-flex align-items-center">
                <label style={{ width: "150px" }}>購買數量：</label>
                <button
                  className="btn btn-danger"
                  type="button"
                  id="button-addon1"
                  aria-label="Decrease quantity"
                  onClick={() => setCartQty((pre) => (pre === 1 ? 1 : pre - 1))}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  max="10"
                  value={cartQty}
                  onChange={(e) => setCartQty(Number(e.target.value))}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon2"
                  aria-label="Decrease quantity"
                  onClick={() => setCartQty((pre) => pre + 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  addToCart(product.id, cartQty);
                }}
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 購物車 */}
      <div className="cart-section mt-5 mb-6">
        <h2>購物車列表</h2>
        <div className="text-right mt-4">
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
                      value={cartItem.qty}
                      onChange={(e) => {
                        if (e.target.value === "") return;
                        updateCart(
                          cartItem.id,
                          cartItem.product_id,
                          parseInt(e.target.value),
                        );
                      }}
                    />
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
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
      {/* 結帳 */}
      <div className="checkout-section">
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <h2>結帳</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                defaultValue="jojo@email.com"
                {...register("email", {
                  required: "請輸入Email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email格式不正確",
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="姓名"
                type="text"
                className="form-control"
                placeholder="請輸入姓名"
                defaultValue="JoJo"
                {...register("name", {
                  required: "請填入姓名",
                  minLength: {
                    value: 2,
                    message: "姓名最少兩個字",
                  },
                })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="電話"
                type="tel"
                className="form-control"
                placeholder="請輸入電話"
                defaultValue="0923123123"
                {...register("tel", {
                  required: "請輸入電話",
                  pattern: {
                    value: /^\d+$/,
                    message: "電話僅能輸入數字",
                  },
                  minLength: {
                    value: 8,
                    message: "電話至少8碼",
                  },
                })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                name="地址"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                defaultValue="新竹縣"
                {...register("address", {
                  required: "地址必填！",
                })}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
                defaultValue="週日不收貨"
                {...register("message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

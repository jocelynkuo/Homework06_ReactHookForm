import { useState, useEffect, useRef } from "react";
import axios from "axios";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;
import * as bootstrap from "bootstrap";
import ProductModal from "./ProductModal.jsx";
import Pagination from "./Pagination.jsx";
import { useDispatch } from "react-redux";
// import { createAsyncMessage } from "../../slice/MessageSlice.js";
import MessageToast from "../../components/MessageToast.jsx";
import useMessage from "../../hooks/useMessage.jsx";

// API 設定

const INITIAL_TEMPLATE_DATA = {
  id: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size: "",
};
// 為什麼INITIAL_TEMPLATE_DATA要大寫？ 為什麼不放倒App裡面？

function AdminProducts() {
  //表單登入狀態(儲存登入表單輸入)

  //登入狀態管理(控制顯示登入或產品頁)
  const [isAuth, setIsAuth] = useState(false);
  //產品資料狀態
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: false,
  });

  const productModalRef = useRef(null);

  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const { showError, showSuccess } = useMessage();
  //打開關閉modal
  const onChangePage = (page) => {
    getProducts(page);
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`,
      );
      console.log(response);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      showSuccess("取得成功");
    } catch (error) {
      console.log(error.response);
      // dispatch(createAsyncMessage(error.response.data));
      showError(error.response.data.message);
    }
  };

  // useEffect(() => {
  //   const token = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("hexToken"))
  //     ?.split("=")[1];
  //   axios.defaults.headers.common["Authorization"] = token;

  //   const checkLogin = async () => {
  //     try {
  //       const response = await axios.post(`${VITE_API_BASE}/api/user/check`);
  //       console.log(response.data);
  //       setIsAuth(true);
  //       getProducts();
  //     } catch (error) {
  //       console.log(error.response?.data.message);
  //     }
  //   };
  //   checkLogin();
  //   //綁定modal JS
  //   productModalRef.current = new bootstrap.Modal("#productModal", {
  //     keyboard: false,
  //   });
  // }, []);

  const openModal = (type, product) => {
    productModalRef.current.show();
    setModalType(type);
    setTemplateProduct((INITIAL_TEMPLATE_DATA) => ({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    }));
  };

  return (
    <>
      {
        <div className="container">
          <div>
            <MessageToast />
          </div>
          <div className="row mt-5">
            <div>
              <h1>後台產品列表</h1>
            </div>
            <div className="col-md-12">
              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
                >
                  建立新的產品
                </button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.category}</td>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>
                          {product.is_enabled ? (
                            <p className="text-success ">啟用</p>
                          ) : (
                            "未啟用"
                          )}
                        </td>
                        <td>
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => openModal("edit", product)}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => {
                                openModal("delete", product);
                              }}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onChangePage={onChangePage} />
          </div>
        </div>
      }
      {/* <!-- Modal --> */}
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        productModalRef={productModalRef}
        getProducts={getProducts}
      />
    </>
  );
}

export default AdminProducts;

import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/MessageSlice";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function ProductModal({
  modalType,
  templateProduct,
  productModalRef,
  getProducts,
}) {
  const [tempData, setTempData] = useState(templateProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    setTempData(templateProduct);
  }, [templateProduct]);

  const closeModal = () => {
    productModalRef.current.hide();
  };
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    console.log("event:" + e);
    setTempData((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageInput = (index, value) => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages[index] = value;
      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const handleMainImageInput = (value) => {
    setTempData((preData) => ({
      ...preData,
      imageUrl: value,
    }));
  };

  const handleAddImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.push("");
      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const handleRemoveImage = () => {
    setTempData((preData) => {
      const newImages = [...preData.imagesUrl];
      newImages.pop();
      return {
        ...preData,
        imagesUrl: newImages,
      };
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const url = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`;
      const response = await axios.post(url, formData);
      setTempData((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateProduct = async (id) => {
    let method = "post";
    let url = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`;

    if (modalType === "edit") {
      // url = `${url}/${id}`;
      url = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        is_enabled: tempData.is_enabled ? 1 : 0,
        imagesUrl: [...tempData.imagesUrl.filter((url) => url !== "")],
      },
    };
    try {
      const response = await axios[method](url, productData);
      console.log(response.data);
      getProducts();
      closeModal();
      dispatch(createAsyncMessage(response.data));
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };

  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`,
      );
      console.log(response);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };

  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${modalType === "delete" ? "danger" : "dark"} text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除"
                  : modalType === "edit"
                    ? "編輯"
                    : "新增"}
                產品
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <div className="modal-body">
                <p className="fs-4">
                  確定要刪除
                  <span className="text-danger">{tempData.title}</span>
                  嗎？
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        type="file"
                        name="fileUpload"
                        id="fileUpload"
                        className="form-control mb-3"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => uploadImage(e)}
                      />
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempData.imageUrl}
                        onChange={(e) => handleMainImageInput(e.target.value)}
                        //這邊主圖是不是跟下面不一樣？
                      />
                    </div>
                    {tempData.imageUrl && (
                      <img
                        className="img-fluid"
                        src={
                          tempData.imageUrl === "" ? null : tempData.imageUrl
                        }
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {tempData.imagesUrl.map((url, index) => {
                      return (
                        <div key={index}>
                          <label htmlFor="imageUrl" className="form-label">
                            輸入圖片網址
                          </label>
                          <input
                            type="text"
                            name="imageUrl"
                            id="imageUrl"
                            className="form-control"
                            value={url}
                            onChange={(e) =>
                              handleImageInput(index, e.target.value)
                            }
                            // placeholder={`圖片網址${index + 1}`}
                          />
                          <img
                            className="img-fluid"
                            src={url === "" ? null : url}
                            // alt={`副圖${index + 1}`}
                          />
                        </div>
                      );
                    })}
                    <button
                      className="btn btn-outline-primary btn-sm d-block w-100"
                      onClick={() => handleAddImage()}
                    >
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={() => handleRemoveImage()}
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempData.title}
                      onChange={(e) => handleModalInputChange(e)}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={tempData.category}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={tempData.unit}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempData.origin_price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempData.price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={tempData.description}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={tempData.content}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={tempData.is_enabled}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                  <hr />
                  <label htmlFor="size">產品尺寸</label>
                  <select
                    id="size"
                    name="size"
                    className="form-select"
                    aria-label="Default select example"
                    value={tempData.size}
                    onChange={(e) => handleModalInputChange(e)}
                  >
                    <option value="">選擇尺寸</option>
                    <option value="1">大</option>
                    <option value="2">中</option>
                    <option value="3">小</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => delProduct(tempData.id)}
                >
                  刪除
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    updateProduct(tempData.id);
                  }}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;

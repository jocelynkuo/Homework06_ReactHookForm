import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "hkuodesign@gmail.com",
      password: "",
    },
  });

  const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });

  //抓取輸入的資料
  // const handleInputChange = (e) => {
  //   const { id, value } = e.target;

  //   setFormData((preData) => ({
  //     ...preData,
  //     [id]: value,
  //   }));
  // };

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(response.data);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      //登入成功後，請將Token設定到axios的預設Header, 之後所有的API都會自動帶上Token
      // getProducts();
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container login">
      <form
        className="card p-4"
        style={{ width: "500px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="h3 mt-3 text-center">後台登入</h1>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            {...register("username", {
              required: "請輸入email",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email 格式不正確",
              },
            })}
            // value={formData.username}
            // onChange={(e) => handleInputChange(e)}
          />
          <small className="text-danger">
            {errors.username && errors.username.message}
          </small>
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼長度至少6碼",
              },
            })}
            // value={formData.password}
            // onChange={(e) => handleInputChange(e)}
          />
          <small className="text-danger">
            {errors.password && errors.password.message}
          </small>

          <label htmlFor="password">Password</label>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={!isValid}
        >
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;

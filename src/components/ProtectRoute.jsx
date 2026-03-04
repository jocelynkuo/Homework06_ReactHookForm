import axios from "axios";
import { RotatingTriangles } from "react-loader-spinner";
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken"))
      ?.split("=")[1];
    axios.defaults.headers.common["Authorization"] = token;

    const checkLogin = async () => {
      try {
        const response = await axios.post(`${VITE_API_BASE}/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        console.log(error.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
    //綁定modal JS
    // productModalRef.current = new bootstrap.Modal("#productModal", {
    //   keyboard: false,
    // });
  }, []);

  if (loading) return <RotatingTriangles />;
  if (!isAuth) return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;

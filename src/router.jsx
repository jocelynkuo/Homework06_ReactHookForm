import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import Products from "./views/front/Products";
import Home from "./views/front/Home";
import SingleProduct from "./views/front/SingleProduct";
import Carts from "./views/front/Carts";
import NotFound from "./views/front/NotFound";
import Checkout from "./views/front/Checkout";
import Login from "./views/Login";



export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "carts",
        element: <Carts />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

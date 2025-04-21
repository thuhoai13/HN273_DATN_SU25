import { useRoutes } from "react-router-dom";
import axios from "axios";
import "antd/dist/reset.css";
import ProductList from "./pages/admin/product/list";
import ProductEdit from "./pages/admin/product/edit";
import ProductAdd from "./pages/admin/product/add";
import Register from "./pages/client/auth/register";
import Login from "./pages/client/auth/login";
import Homepage from "./pages/Homepage";
import AdminLayout from "./pages/layout/AdminLayout";
import ClientLayout from "./pages/layout/ClientLayout";
import ProductDetail from "./pages/client/product/detail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutPage from "./pages/client/checkout/Checkout";
import CategoryList from "./pages/admin/category/list";
import CategoryAdd from "./pages/admin/category/add";
import CategoryEdit from "./pages/admin/category/edit";
import CartPage from "./pages/client/cart/CartPage";
import SearchPage from "./pages/SearchPage";
import CheckPayment from "./pages/client/checkout/CheckPayment";
import OrderSuccess from "./pages/client/orders/OrderSuccess"; // Thêm trang Order Success
import OrdersPage from "./pages/client/orders/Orders";
import AdminOrders from "./pages/admin/orders/list";
import AdminUsers from "./pages/admin/user/list";
import UserProfile from "./pages/client/user/UserProfile";
import PaymentResult from "./pages/checkout/PaymentResult";
import LienHe from "./pages/lienhe/lienhe";
import OrderDetailAdminPage from "./pages/admin/orders/detai";
import UserDetail from "./pages/admin/user/detail";
import Statistics from "./pages/admin/statistics/Statistics";
import OrderDetail from "./pages/client/orders/Detail";

axios.defaults.baseURL = "http://localhost:3000";

const queryClient = new QueryClient();

function App() {
  const routes = [
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "gio-hang", element: <CartPage /> },  
        { path: "search", element: <SearchPage /> },
        { path: "thanh-toan", element: <CheckoutPage /> },
        { path: "check-payment", element: <PaymentResult /> }, 
        { path: "order-success", element: <OrderSuccess /> },
        { path: "orders", element: <OrdersPage /> },
        { path: "orders/:id", element: <OrderDetail /> },
        { path: "profile", element: <UserProfile/> },
        { path: "san-pham/:id", element: <ProductDetail /> },
        { path: "auth/dang-ky", element: <Register /> },
        { path: "auth/dang-nhap", element: <Login /> },
        {path:"lien-he",element:<LienHe/>}
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "product/list", element: <ProductList /> },
        { path: "product/add", element: <ProductAdd /> },
        { path: "product/:id/edit", element: <ProductEdit /> },
        { path: "category/list", element: <CategoryList /> },
        { path: "category/add", element: <CategoryAdd /> },
        { path: "category/:id/edit", element: <CategoryEdit /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "orders/:id", element: <OrderDetailAdminPage /> },
        { path: "users", element: <AdminUsers /> },
        { path: "users/:id", element: <UserDetail  /> },
        { path: "statistics", element: <Statistics  /> },
      ],
    },
  ];

  const element = useRoutes(routes);

  return <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>;
}

export default App;

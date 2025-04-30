import { useRoutes, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/client/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import DetailProduct from './pages/client/detailProduct';
import Orders from './pages/client/orders'; // bạn cần import các file thiếu
import Cart from './pages/client/cart';
import Dathang from './pages/client/dathang';
import CheckLogin from './components/CheckLogin'; // nếu có file này

const queryClient = new QueryClient();

function App() {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/products/:id', element: <DetailProductWrapper /> },
    { path: '/orders', element: <CheckLogin element={<Orders />} /> },
    { path: '/cart', element: <CheckLogin element={<Cart />} /> },
    { path: '/dathang', element: <CheckLogin element={<Dathang />} /> },
  ]);

  return <QueryClientProvider client={queryClient}>{routes}</QueryClientProvider>;
}

const DetailProductWrapper = () => {
  const { id } = useParams();
  if (!id) {
    return <div>Product ID không hợp lệ</div>;
  }
  return <DetailProduct productId={id} />;
};

export default App;

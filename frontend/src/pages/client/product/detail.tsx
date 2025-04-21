import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  InputNumber,
  message,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  desc: string;
  stock: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  async function getProductDetail(id: string) {
    try {
      const { data } = await axios.get(`http://localhost:3000/products/${id}`);
      if (!data) {
        message.error("Sản phẩm không tồn tại!");
        return;
      }
      setProduct(data);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết sản phẩm!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductDetail(id);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      Modal.confirm({
        title: "Bạn chưa đăng nhập",
        content: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        onOk: () => navigate("/auth/login"),
      });
      return;
    }

    if (product && quantity > product.stock) {
      message.error(`Số lượng sản phẩm trong kho không đủ. Chỉ còn ${product.stock} sản phẩm!`);
      return;
    }

    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productInCart = cart.find((item: any) => item.id === product?.id);

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  if (!product) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Sản phẩm không tồn tại!</h2>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Row justify="center">
        <Col xs={24} md={20} lg={18}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Row gutter={[32, 32]}>
              {/* Image Column */}
              <Col xs={24} md={12}>
                <div className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-lg object-cover"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </Col>

              {/* Details Column */}
              <Col xs={24} md={12} className="flex flex-col justify-between p-6">
                <div>
                  <Title level={3} className="text-gray-900 mb-2">
                    {product.name}
                  </Title>
                  <Text className="text-xl font-bold text-red-500 mb-4">
                    {product.price.toLocaleString("vi-VN")}₫
                  </Text>
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <Tag color="green">Còn hàng</Tag>
                    ) : (
                      <Tag color="red">Hết hàng</Tag>
                    )}
                  </div>
                  <div className="text-gray-700 mb-6">{product.desc}</div>
                  <div className="flex items-center mb-4">
                    <Text strong className="mr-2">
                      Số lượng:
                    </Text>
                    <InputNumber
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(value) => setQuantity(value || 1)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      disabled={product.stock === 0}
                    />
                  </div>
                </div>

                <div>
                  {isLoggedIn ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleAddToCart}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 w-full"
                      disabled={product.stock === 0}
                    >
                      🛒 Thêm vào giỏ hàng
                    </Button>
                  ) : (
                    <Text type="danger" className="mt-4 block text-center">
                      Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
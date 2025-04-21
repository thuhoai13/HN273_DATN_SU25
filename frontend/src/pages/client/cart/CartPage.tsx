import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, InputNumber, message, Typography, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);
    setTotalPrice(total);
  }, [cart, products]);

  const handleQuantityChange = (id: number, value: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const handleCheckout = () => {
    navigate("/thanh-toan");
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <Empty description="Giỏ hàng của bạn trống" />
          <Button
            type="primary"
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            onClick={() => navigate("/")}
          >
            Mua sắm ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Title level={2} className="text-center text-gray-900 mb-6">
        Giỏ hàng
      </Title>
      <Row gutter={[24, 24]}>
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="rounded-lg shadow-md overflow-hidden"
                style={{ textAlign: "center" }}
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-full h-40 object-cover rounded-md"
                  />
                }
              >
                <Typography.Title level={4} className="text-gray-800 mb-2">
                  {product.name}
                </Typography.Title>
                <Text strong className="text-lg text-red-500 block mb-2">
                  {product.price.toLocaleString("vi-VN")} VND
                </Text>
                <div className="mt-3 flex items-center justify-center">
                  <Typography.Text strong className="mr-2">
                    Số lượng:
                  </Typography.Text>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value || 1)}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="mt-3 block w-full text-center"
                >
                  Xóa
                </Button>
              </Card>
            </Col>
          ) : null;
        })}
      </Row>

      <Row justify="end" style={{ marginTop: "30px" }}>
        <Col>
          <Typography.Title level={3} className="text-gray-900">
            Tổng cộng: {totalPrice.toLocaleString("vi-VN")} VND
          </Typography.Title>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col>
          <Button
            type="primary"
            size="large"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            onClick={handleCheckout}
          >
            Tiến hành thanh toán
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
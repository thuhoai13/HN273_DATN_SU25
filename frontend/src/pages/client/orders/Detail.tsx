import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Descriptions, Table, Tag, Button, message, Modal } from "antd";

interface Order {
  id: number;
  paymentMethod: string;
  status: string;
  total: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: { name: string; price: number; quantity: number; image: string }[];
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Order>(`http://localhost:3000/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        message.error("Không thể tải chi tiết đơn hàng!");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!order) return;
    Modal.confirm({
      title: "Xác nhận hủy đơn hàng?",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      okText: "Hủy đơn",
      cancelText: "Quay lại",
      onOk: async () => {
        setCancelling(true);
        try {
          await axios.patch(`http://localhost:3000/orders/${id}`, { status: "Đã hủy" });
          setOrder({ ...order, status: "Đã hủy" });
          message.success("Đơn hàng đã được hủy thành công!");
        } catch (error) {
          message.error("Không thể hủy đơn hàng. Vui lòng thử lại!");
        } finally {
          setCancelling(false);
        }
      },
    });
  };

  if (loading) return <div>Đang tải chi tiết đơn hàng...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng!</div>;

  const columns = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <img src={image} alt="product" style={{ width: 50, borderRadius: 5 }} />,
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VND`,
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#1890ff" }}>Chi tiết đơn hàng</h1>
      <Card bordered={false} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <Descriptions bordered column={1} title="Thông tin đơn hàng">
          <Descriptions.Item label="Mã đơn hàng">
            <strong>{order.id}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Tag color={order.paymentMethod === "VNPAY" ? "blue" : order.paymentMethod === "ZALOPAY" ? "green" : "orange"}>
              {order.paymentMethod}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={order.status === "Chờ xác nhận" ? "orange" : order.status === "Đã xác nhận" ? "green" : "red"}>
              {order.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Descriptions bordered column={1} title="Thông tin khách hàng" style={{ marginTop: "20px" }}>
          <Descriptions.Item label="Tên khách hàng">{order.customer.name}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.customer.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customer.email}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.customer.address}</Descriptions.Item>
        </Descriptions>

        <h3 style={{ marginTop: "20px" }}>Danh sách sản phẩm</h3>
        <Table columns={columns} dataSource={order.items} rowKey="name" pagination={false} />

        <h3 style={{ marginTop: "20px", textAlign: "right", fontSize: "18px", fontWeight: "bold" }}>
          Tổng tiền: {order.total.toLocaleString("vi-VN")} VND
        </h3>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate("/orders")}>
            Quay lại danh sách đơn hàng
          </Button>
          {order.status !== "Đã hủy" && (
            <Button danger onClick={handleCancelOrder} loading={cancelling}>
              Hủy đơn
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;

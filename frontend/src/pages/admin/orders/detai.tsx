import { Card, Typography, Descriptions, message, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

interface OrderDetail {
    id: number;
    userId: number;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    items: {
      name: string;
      price: number;
      image: string;
      id: number; 
      stock: number;
      desc: string;
      category: number;
      quantity: number;
    }[];
    total: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }

const { Title } = Typography;


const OrderDetailAdminPage = () => {
  const { id: orderIdParam } = useParams();
  const orderId = Number(orderIdParam);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        setError("ID đơn hàng không hợp lệ!");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<OrderDetail>(
          `http://localhost:3000/orders/${orderId}` 
        );
        setOrderDetail(response.data);
      } catch (err: any) {
        setError("Không thể tải chi tiết đơn hàng!");
        message.error("Không thể tải chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Typography.Paragraph type="danger">{error}</Typography.Paragraph>;
  }

  if (!orderDetail) {
    return <Typography.Paragraph>Không tìm thấy đơn hàng.</Typography.Paragraph>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Chi tiết đơn hàng #{orderDetail.id}</Title>

      <Card style={{ marginBottom: 20 }} title="Thông tin khách hàng" bordered>
        <Descriptions column={1}>
          <Descriptions.Item label="Họ và tên">{orderDetail.customer.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{orderDetail.customer.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{orderDetail.customer.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{orderDetail.customer.address}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: 20 }} title="Thông tin đơn hàng" bordered>
        <Descriptions column={1}>
          <Descriptions.Item label="Mã đơn hàng">{orderDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {orderDetail.total.toLocaleString("vi-VN")} VND
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {orderDetail.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{orderDetail.status}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(orderDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Sản phẩm trong đơn hàng" bordered>
        {orderDetail.items && orderDetail.items.length > 0 ? (
          <Table
            dataSource={orderDetail.items}
            columns={[
              { title: "ID", dataIndex: "id", key: "id" },
              {
                title: "Hình ảnh",
                dataIndex: "image",
                key: "image",
                render: (image: string) => (
                  <img
                    src={image}
                    alt="Product"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                ),
              },
              { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
              { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
              {
                title: "Giá",
                dataIndex: "price",
                key: "price",
                render: (price: number) => price.toLocaleString("vi-VN") + " VND",
              },
              {
                title: "Thành tiền",
                render: (item) => (item.quantity * item.price).toLocaleString("vi-VN") + " VND",
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Typography.Paragraph>Không có sản phẩm nào trong đơn hàng này.</Typography.Paragraph>
        )}
      </Card>
    </div>
  );
};

export default OrderDetailAdminPage;
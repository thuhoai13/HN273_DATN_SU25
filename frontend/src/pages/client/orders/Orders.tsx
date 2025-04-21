import { Button, Card, Table, Tag, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = localStorage.getItem("user");

      if (!user) {
        message.error("Bạn đã đăng xuất!");
        navigate("/auth/dang-nhap");
        setLoading(false);
        return;
      }

      try {
        const userId = JSON.parse(user).id;
        const { data } = await axios.get(`http://localhost:3000/orders?userId=${userId}`);

        if (data.length === 0) {
          message.info("Bạn chưa có đơn hàng nào!");
        }

        setOrders(data);
      } catch (error) {
        message.error("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}`, { status: "Đã hủy" });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Đã hủy" } : order
        )
      );
      message.success("Đơn hàng đã bị hủy!");
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng!");
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod: string) => {
        let color = "default";
  
        switch (paymentMethod) {
          case "VNPAY":
            color = "blue";
            break;
          case "ZALOPAY":
            color = "green";
            break;
          case "COD":
            color = "orange";
            break;
          default:
            color = "default";
        }
  
        return <Tag color={color}>{paymentMethod}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "Chờ xác nhận" ? "orange" : status === "Đã xác nhận" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        record.status === "Chờ xác nhận" ? (
          <Popconfirm
            title="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            onConfirm={() => handleCancelOrder(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Hủy đơn</Button>
          </Popconfirm>
        ) : (
          <Tag color="default">Đã hủy</Tag>
        )
      ),
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => navigate(`/orders/${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    }
    
  ];
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lịch sử đơn hàng</h1>
      <Card>
        <Table columns={columns} dataSource={orders} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
};

export default OrdersPage;
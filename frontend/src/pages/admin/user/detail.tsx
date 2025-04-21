import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Descriptions, Tag, message, Popconfirm } from "antd";

interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  name?: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User>(`http://localhost:3000/users/${id}`);
        setUser(response.data);
      } catch (error: any) {
        message.error(`Không thể tải chi tiết người dùng với ID: ${id}`);
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetail();
    }
  }, [id, navigate]);

  const handleUpdateUserStatus = async (newStatus: "Đang hoạt động" | "Bị dừng") => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { status: newStatus });
      setUser({ ...user, status: newStatus });
      message.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
    } catch (error: any) {
      message.error(`Không thể cập nhật trạng thái người dùng.`);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  if (!user) {
    return <div>Không tìm thấy người dùng!</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chi tiết người dùng</h1>
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          {user.name && <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>}
          <Descriptions.Item label="Vai trò">
            <Tag color={user.role === "admin" ? "red" : "blue"}>{user.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={user.status === "Bị dừng" ? "red" : "green"}>{user.status}</Tag>
          </Descriptions.Item>
          {user.lastLogin && <Descriptions.Item label="Đăng nhập cuối">{user.lastLogin}</Descriptions.Item>}
        </Descriptions>
        <div style={{ marginTop: "20px" }}>
  {user.role !== "admin" && (
    user.status === "Đang hoạt động" ? (
      <Popconfirm
        title="Bạn có chắc chắn muốn ngừng hoạt động người dùng này?"
        onConfirm={() => handleUpdateUserStatus("Bị dừng")}
        okText="Ngừng hoạt động"
        cancelText="Hủy"
      >
        <Button danger style={{ marginRight: 8 }}>
          Ngừng hoạt động
        </Button>
      </Popconfirm>
    ) : (
      <Button type="primary" onClick={() => handleUpdateUserStatus("Đang hoạt động")} style={{ marginRight: 8 }}>
        Kích hoạt
      </Button>
    )
  )}
  <Button onClick={() => navigate("/admin/users")}>
    Quay lại
  </Button>
</div>

      </Card>
    </div>
  );
};

export default UserDetail;
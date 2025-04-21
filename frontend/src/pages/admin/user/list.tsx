import { Button, Card, Table, message, Tag } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<User[]>("http://localhost:3000/users");
        setUsers(data); // **Giữ nguyên dữ liệu trạng thái từ API**
      } catch (error: any) {
        message.error("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={status === "Bị dừng" ? "red" : "green"}>{status}</Tag>, // Hiển thị màu sắc dựa trên trạng thái
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: User) => (
        <Button onClick={() => navigate(`/admin/users/${record.id}`)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <Card>
        <Table columns={columns} dataSource={users} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
};

export default AdminUsers;
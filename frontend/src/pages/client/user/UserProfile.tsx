import { Button, Card, Form, Input, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  status: "Hoạt động" | "Bị dừng";
  lastLogin: string;
}

const UserProfile = () => {
  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = loggedInUser?.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data }: { data: User } = await axios.get(`http://localhost:3000/users/${userId}`);
        setUser(data);
        profileForm.setFieldsValue({ name: data.name, email: data.email });
      } catch (error) {
        message.error("Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [profileForm, userId, navigate]);

  const handleUpdateProfile = async (values: { name: string; email: string }) => {
    if (!user) return;

    try {
        // Lấy danh sách tất cả người dùng để kiểm tra email
        const { data: users }: { data: User[] } = await axios.get("http://localhost:3000/users");

        // Kiểm tra xem email đã tồn tại chưa (trừ user hiện tại)
        const emailExists = users.some(u => u.email === values.email && u.id !== user.id);

        if (emailExists) {
            message.error("Email này đã tồn tại. Vui lòng chọn email khác!");
            return;
        }

        // Nếu email chưa tồn tại, tiến hành cập nhật
        const response = await axios.patch(`http://localhost:3000/users/${user.id}`, { 
            name: values.name, 
            email: values.email 
        });

        if (response.status === 200) {
            message.success("Cập nhật thông tin thành công!");
            setUser({ ...user, name: values.name, email: values.email });

            // Cập nhật localStorage
            const updatedUser = { ...loggedInUser, name: values.name, email: values.email };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
            message.error("Lỗi khi cập nhật thông tin!");
        }
    } catch (error) {
        message.error("Lỗi khi cập nhật thông tin!");
        console.error("Lỗi cập nhật thông tin:", error);
    }
};


  const handleUpdatePassword = async (values: { password: string }) => {
    if (!user) return;

    try {
      const response = await axios.patch(`http://localhost:3000/users/${user.id}`, { password: values.password });
      if (response.status === 200) {
        message.success("Cập nhật mật khẩu thành công!");
        passwordForm.resetFields(['password']);
      } else {
        message.error("Lỗi khi cập nhật mật khẩu!");
        console.error("Lỗi cập nhật mật khẩu:", response);
      }
    } catch (error: any) {
      message.error("Lỗi khi cập nhật mật khẩu!");
      console.error("Lỗi cập nhật mật khẩu:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await axios.delete(`http://localhost:3000/users/${user.id}`);
      if (response.status === 200) {
        message.success("Tài khoản đã bị xóa!");
        setUser(null);
        localStorage.removeItem('user');
        navigate('/auth/dang-ky');
      } else {
        message.error("Lỗi khi xóa tài khoản!");
        console.error("Lỗi xóa tài khoản:", response);
      }
    } catch (error: any) {
      message.error("Lỗi khi xóa tài khoản!");
      console.error("Lỗi xóa tài khoản:", error);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!user) return <p>Tài khoản không tồn tại hoặc đã bị xóa.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý tài khoản</h1>

      {user.status === "Bị dừng" && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          🔴 Tài khoản của bạn đã bị dừng do không đăng nhập quá 90 ngày. Hãy liên hệ quản trị viên để kích hoạt lại.
        </p>
      )}

      <Card title="Thông tin cá nhân">
        <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form>
      </Card>

      <Card title="Cập nhật mật khẩu" style={{ marginTop: 16 }}>
        <Form form={passwordForm} layout="vertical" name="updatePasswordForm" onFinish={handleUpdatePassword}>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={user.status === "Bị dừng"}>
            Cập nhật mật khẩu
          </Button>
        </Form>
      </Card>

      <Popconfirm
        title="Bạn có chắc chắn muốn xóa tài khoản không?"
        onConfirm={handleDeleteAccount}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button type="primary" danger style={{ marginTop: 16 }}>
          Xóa tài khoản
        </Button>
      </Popconfirm>
    </div>
  );
};

export default UserProfile;
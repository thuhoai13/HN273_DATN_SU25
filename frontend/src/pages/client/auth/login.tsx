import { Button, Form, Input, message, notification, Typography } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { email, password } = await form.validateFields();
      const { data } = await axios.get(`http://localhost:3000/users?email=${email}`);

      if (data.length === 0) {
        return message.error("Email không tồn tại!");
      }

      const user = data[0];

      if (user.status !== "Đang hoạt động") {
        return message.error("Tài khoản của bạn đã bị dừng hoạt động!");
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return message.error("Sai mật khẩu!");
      }

      localStorage.setItem("token", "fake-jwt-token");
      localStorage.setItem("user", JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));

      notification.success({ message: "Đăng nhập thành công" });
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <Typography.Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        ĐĂNG NHẬP
      </Typography.Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Typography.Text>
          Bạn chưa có tài khoản? <Link to="/auth/dang-ky">Đăng ký</Link>
        </Typography.Text>
      </div>
    </div>
  );
}

export default Login;
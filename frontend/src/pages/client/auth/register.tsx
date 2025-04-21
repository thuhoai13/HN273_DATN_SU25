import { Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';
import { Link } from 'react-router-dom'; // Import Link

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { name, email, password } = await form.validateFields();

      const { data: users } = await axios.get(`http://localhost:3000/users?email=${email}`);
      if (users.length > 0) return message.error("Email đã tồn tại!");

      const hashedPassword = await bcrypt.hash(password, 10);

      await axios.post("http://localhost:3000/users", { name, email, password: hashedPassword, role: 'user' });

      message.success("Đăng ký thành công!");
      navigate("/auth/dang-nhap");
    } catch (error: any) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Lỗi đăng ký:", error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <Typography.Title level={2} style={{ textAlign: "center", color: "#ff6f61" }}>
        ĐĂNG KÝ
      </Typography.Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Typography.Text>
          Bạn đã có tài khoản? <Link to="/auth/dang-nhap">Đăng nhập</Link>
        </Typography.Text>
      </div>
    </div>
  );
}

export default Register;
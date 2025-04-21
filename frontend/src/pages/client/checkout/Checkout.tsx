import { Button, Card, Col, Form, Input, Radio, Row, Table, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const [paymentMethod, setPaymentMethod] = useState<number>(1);
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const total = useMemo(() => {
        return cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const columns = [
        { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
        { title: "Giá", dataIndex: "price", key: "price", render: (price: number) => price.toLocaleString("vi-VN") + " VND" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    ];

    const saveOrder = async (customerInfo: any) => {
        const paymentMethods = { 1: "VNPAY", 2: "ZALOPAY", 3: "COD" };

        // Lấy userId từ localStorage
        const user = localStorage.getItem("user");
        let userId = null;
        if (user) {
            try {
                const userData = JSON.parse(user);
                userId = userData.id;
            } catch (error) {
                console.error("Lỗi khi phân tích cú pháp dữ liệu người dùng:", error);
                message.error("Có lỗi xảy ra khi lấy thông tin người dùng.");
                return; // Dừng hàm nếu có lỗi
            }
        } else {
            message.error("Bạn chưa đăng nhập.");
            navigate("/auth/dang-nhap");
            return; // Dừng hàm nếu chưa đăng nhập
        }

        const orderData = {
            id: new Date().getTime(),
            userId: userId, // Thêm userId vào dữ liệu đơn hàng
            customer: customerInfo,
            items: cart,
            total,
            paymentMethod: paymentMethods[paymentMethod as keyof typeof paymentMethods],
            status: "Chờ xác nhận",
            createdAt: new Date().toISOString(),
        };

        try {
            await axios.post("http://localhost:3000/orders", orderData);
            localStorage.removeItem("cart");
            message.success("Đơn hàng đã được tạo thành công!");
            navigate("/order-success");
        } catch (error) {
            message.error("Lỗi khi lưu đơn hàng. Vui lòng thử lại!");
        }
    };

    const handlePayment = async () => {
        try {
            if (total === 0) {
                message.warning("Giỏ hàng của bạn đang trống!");
                return;
            }

            const values = await form.validateFields();
            setLoading(true);

            if (paymentMethod === 1) {
                const { data } = await axios.get(`http://localhost:3000/create_payment?amount=${total}`);
                message.success("Đang chuyển hướng đến cổng thanh toán VNPAY...");
                window.location.href = data.paymentUrl;
            } else if (paymentMethod === 2) {
                message.info("Thanh toán bằng ZaloPay đang được phát triển!");
            } else {
                await saveOrder(values);
            }
        } catch (error) {
            message.error("Vui lòng kiểm tra lại thông tin!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Thanh toán</h1>
            <Row gutter={16}>
                <Col span={14}>
                    <Card title="Thông tin nhận hàng">
                        <Form form={form} layout="vertical">
                            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="Thông tin sản phẩm">
                        <Table pagination={false} dataSource={cart} columns={columns} rowKey="id" />
                        <h3>Tổng tiền: {new Intl.NumberFormat("vi-VN").format(total)} VND</h3>
                        <Radio.Group
                            defaultValue={1}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                const paymentName = e.target.value === 1 ? "VNPAY" : e.target.value === 2 ? "ZaloPay" : "Ship COD";
                                message.info(`Bạn đã chọn phương thức thanh toán: ${paymentName}`);
                            }}
                            style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}
                        >
                            <Radio value={1}>VNPAY</Radio>
                            <Radio value={2}>ZALOPAY</Radio>
                            <Radio value={3}>Ship COD</Radio>
                        </Radio.Group>
                        <Button onClick={handlePayment} style={{ marginTop: 20 }} type="primary" loading={loading} disabled={total === 0}>
                            Thanh toán
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
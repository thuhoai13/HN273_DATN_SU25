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

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const columns = [
        { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
        { title: "Giá", dataIndex: "price", key: "price", render: (price: number) => `${price.toLocaleString("vi-VN")} VND` },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    ];

    const saveOrder = async (customerInfo: any) => {
        const user = localStorage.getItem("user");
        if (!user) {
            message.error("Bạn chưa đăng nhập.");
            navigate("/auth/dang-nhap");
            return;
        }

        let userId;
        try {
            userId = JSON.parse(user).id;
        } catch (error) {
            message.error("Lỗi khi lấy thông tin người dùng.");
            return;
        }

        const orderData = {
            id: Date.now(),
            userId,
            customer: customerInfo,
            items: cart,
            total,
            paymentMethod: paymentMethod === 1 ? "VNPAY" : paymentMethod === 2 ? "ZALOPAY" : "COD",
            status: "Chờ xác nhận",
            createdAt: new Date().toISOString(),
        };

        try {
            await axios.post("http://localhost:3000/orders", orderData);
            localStorage.removeItem("cart");
            message.success("Đơn hàng đã được tạo thành công!");
            navigate("/order-success");
        } catch {
            message.error("Lỗi khi lưu đơn hàng. Vui lòng thử lại!");
        }
    };

    const handlePayment = async () => {
        if (total === 0) {
            message.warning("Giỏ hàng của bạn đang trống!");
            return;
        }

        try {
            const values = await form.validateFields();
            setLoading(true);

            if (paymentMethod === 1) {
                const vnp_TmnCode = "RHPI71CG";
                const vnp_Amount = total * 100;
                const vnp_TxnRef = Date.now().toString();
                const vnp_OrderInfo = encodeURIComponent(`Thanh toán đơn hàng ${vnp_TxnRef}`);
                const vnp_ReturnUrl = "http://localhost:5173/order-success";
                
                const params = new URLSearchParams({
                    vnp_Version: "2.1.0",
                    vnp_Command: "pay",
                    vnp_TmnCode,
                    vnp_Amount: vnp_Amount.toString(),
                    vnp_CurrCode: "VND",
                    vnp_TxnRef,
                    vnp_OrderInfo,
                    vnp_OrderType: "other",
                    vnp_Locale: "vn",
                    vnp_ReturnUrl,
                });
                
                window.location.href = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${params.toString()}`;
            } else {
                await saveOrder(values);
            }
        } catch {
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
                        <h3>Tổng tiền: {total.toLocaleString("vi-VN")} VND</h3>
                        <Radio.Group
                            defaultValue={1}
                            onChange={(e) => setPaymentMethod(e.target.value)}
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

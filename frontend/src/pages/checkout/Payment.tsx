import React, { useState } from "react";
import { Button, InputNumber, Select, message } from "antd";
import { generatePaymentUrl } from "./PaymentUrl";
const Payment = () => {
  const [amount, setAmount] = useState(10000);
  const [bankCode, setBankCode] = useState("NCB");

  const handlePayment = () => {
    if (amount < 10000) {
      message.error("Số tiền tối thiểu là 10,000 VND");
      return;
    }
    const paymentUrl = generatePaymentUrl(amount, bankCode);
    window.location.href = paymentUrl; // Chuyển hướng đến VNPay
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thanh toán VNPay</h2>
      <InputNumber
        min={10000}
        value={amount}
        onChange={(value) => setAmount(value || 10000)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <Select
        value={bankCode}
        onChange={setBankCode}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <Select.Option value="NCB">Ngân hàng NCB</Select.Option>
        <Select.Option value="VCB">Vietcombank</Select.Option>
        <Select.Option value="BIDV">BIDV</Select.Option>
        <Select.Option value="VNPAYQR">VNPay QR</Select.Option>
      </Select>
      <Button type="primary" onClick={handlePayment}>
        Thanh toán
      </Button>
    </div>
  );
};

export default Payment;

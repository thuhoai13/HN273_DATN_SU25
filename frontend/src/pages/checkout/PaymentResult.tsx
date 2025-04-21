import React from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";

const PaymentResult = () => {
  const location = useLocation();
  const params = qs.parse(location.search);

  return (
    <div style={{ padding: 20 }}>
      <h2>Kết quả thanh toán</h2>
      {params.vnp_ResponseCode === "00" ? (
        <p style={{ color: "green" }}>✅ Thanh toán thành công!</p>
      ) : (
        <p style={{ color: "red" }}>❌ Thanh toán thất bại!</p>
      )}
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
};

export default PaymentResult;

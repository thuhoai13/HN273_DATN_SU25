import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const transactionStatus = searchParams.get("vnp_ResponseCode"); // 00 = thành công

        if (transactionStatus === "00") {
            message.success("Thanh toán thành công!");
        } else {
            message.error("Thanh toán thất bại hoặc bị hủy!");
        }
    }, [searchParams]);

    return <h1>Kết quả thanh toán</h1>;
};

export default OrderSuccess;

import CryptoJS from "crypto-js";
import qs from "query-string";
import moment from "moment";

// Thông tin từ VNPay
const TMN_CODE = "RHPI71CG"; // Thay bằng mã của bạn
const SECRET_KEY = "J65DUQAE4XEBYS92CRD65L9OZH8UKUD6"; // Thay bằng key của bạn
const VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Sandbox của VNPay
const RETURN_URL = "http://localhost:5173/payment-result"; // Trang kết quả

// Hàm tạo URL thanh toán
export const generatePaymentUrl = (amount: number, bankCode: string = "NCB") => {
  const orderId = moment().format("YYYYMMDDHHmmss");
  const createDate = moment().format("YYYYMMDDHHmmss");

  let vnp_Params: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: TMN_CODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toán đơn hàng",
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100, // Chuyển đổi sang đơn vị VNĐ
    vnp_ReturnUrl: RETURN_URL,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Sắp xếp tham số theo thứ tự từ A-Z
  const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
  const signData = qs.stringify(sortedParams, { encode: false });

  // Tạo chữ ký SHA512
  const secureHash = CryptoJS.HmacSHA512(signData, SECRET_KEY).toString();

  // Thêm chữ ký vào params
  sortedParams["vnp_SecureHash"] = secureHash;

  // Tạo URL thanh toán
  return `${VNP_URL}?${qs.stringify(sortedParams)}`;
};

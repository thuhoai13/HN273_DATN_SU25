import React from "react";
import { Card, Typography, Row, Col } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const LienHe: React.FC = () => {
  return (
    <Row justify="center" style={{ padding: "40px 20px" }}>
      <Col xs={24} md={20} lg={12}>
        <Card
          style={{
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={3} style={{ color: "#ee4d2d", textAlign: "center", marginBottom: 30 }}>
            Thông tin liên hệ cửa hàng
          </Title>

          <Paragraph>
            <HomeOutlined style={{ marginRight: 10, color: "#1890ff" }} />
            <Text strong>Địa chỉ:</Text> Vạn Phúc Hà Đông Hà Nội
          </Paragraph>

          <Paragraph>
            <PhoneOutlined style={{ marginRight: 10, color: "#52c41a" }} />
            <Text strong>Hotline:</Text> 0345208573
          </Paragraph>

          <Paragraph>
            <MailOutlined style={{ marginRight: 10, color: "#faad14" }} />
            <Text strong>Email:</Text> tuanpaph50818@gmail.com
          </Paragraph>

          <Paragraph>
            <FacebookOutlined style={{ marginRight: 10, color: "#1877f2" }} />
            <Text strong>Facebook:</Text>{" "}
            <a href="https://www.facebook.com/profile.php?id=100048992024006" target="_blank" rel="noreferrer">
              facebook.com/nhom8
            </a>
          </Paragraph>

          <Paragraph style={{ marginTop: 30 }}>
            <Text type="secondary">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn từ 8:00 - 22:00 mỗi ngày. Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi!
            </Text>
          </Paragraph>
        </Card>
      </Col>
    </Row>
  );
};

export default LienHe;

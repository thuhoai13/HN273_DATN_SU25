import { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import axios from "axios";
import { Product } from "./admin/product/list";
import { Link } from "react-router-dom";

const { Meta } = Card;

function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function getProductList() {
    const { data } = await axios.get("/products");
    setProducts(data);
  }
  useEffect(() => {
    getProductList();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <Link to={`/product/${product.id}`}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
            >
              <Meta title={product.name} description={product.price} />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default Homepage;

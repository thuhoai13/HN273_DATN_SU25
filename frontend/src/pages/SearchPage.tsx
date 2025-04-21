import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { List, Card, Image } from "antd";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      axios.get(`http://localhost:3000/products?name_like=${query}`)
        .then(res => setResults(res.data))
        .catch(err => console.error("Lỗi tìm kiếm:", err));
    }
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={results}
        renderItem={(product) => (
          <List.Item>
            <Card 
              title={product.name} 
              cover={<Image src={product.image} alt={product.name} />}
            >
              <p>{product.price} VND</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SearchPage;

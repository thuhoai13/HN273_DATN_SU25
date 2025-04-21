import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Table, Tag, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProduct, removeProduct } from "../../../services/product";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
};

function ProductList() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [stockFilter, setStockFilter] = useState<string | null>(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Xóa sản phẩm thành công!");
    },
    onError: () => {
      message.error("Lỗi khi xóa sản phẩm!");
    },
  });

  const filteredProducts = products?.filter((product: Product) => {
    if (!stockFilter || stockFilter === "Tất cả sản phẩm") return true;
  
    const stock = Number(product.stock);
  
    if (stockFilter === "Còn hàng") {
      return stock > 0; 
    }
  
    if (stockFilter === "Hết hàng") {
      return stock === 0; 
    }
  
    return true;
  });
  
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price", render: (price: number) => `${price.toLocaleString()} đ` },
    {
      title: "Trạng thái",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (stock > 0 ? <Tag color="green">Còn hàng</Tag> : <Tag color="red">Hết hàng</Tag>),
    },
    {
      title: "Hành động",
      render: (record: Product) => (
        <>
          <Button onClick={() => nav(`/admin/product/${record.id}/edit`)} type="link">Chỉnh sửa</Button>
          <Button onClick={() => deleteProduct(record.id)} type="link" danger>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>
      
      {/* Bộ lọc */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Button type="primary" onClick={() => nav("/admin/product/add")}>Thêm sản phẩm</Button>

        <Select defaultValue="Tất cả sản phẩm" onChange={setStockFilter}>
  <Select.Option value="Tất cả sản phẩm">🟢 Tất cả</Select.Option>
  <Select.Option value="Còn hàng">🟢 Còn hàng</Select.Option>
  <Select.Option value="Hết hàng">🔴 Hết hàng</Select.Option>
</Select>
      </div>

      <Table columns={columns} dataSource={filteredProducts} loading={isLoading} rowKey="id" />
    </div>
  );
}

export default ProductList;

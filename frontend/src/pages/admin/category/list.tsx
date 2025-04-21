import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllCategories, removeCategory } from "../../../services/category";

export type Category = {
  id: number;
  name: string;
};

function CategoryList() {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => {
        message.success("Xóa danh mục thành công!");
      },
      onError: () => {
        message.error("Lỗi khi xóa danh mục!");
      },
    });
  };

  if (error) return <p>Lỗi khi tải danh mục</p>;

  const columns = [
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      render: (record: Category) => {
        return (
          <>
            <Button
              onClick={() => nav(`/admin/category/${record.id}/edit`)}
              type="link"
            >
              Chỉnh sửa
            </Button>
            <Button onClick={() => handleDelete(record.id)} type="link" danger>
              Xóa
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => nav("/admin/category/add")}
      >
        Thêm danh mục
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        rowKey="id"
      />
    </div>
  );
}

export default CategoryList;

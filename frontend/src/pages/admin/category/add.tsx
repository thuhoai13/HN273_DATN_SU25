import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addCategory } from "../../../services/category"; 

function CategoryAdd() {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { mutate: handleAddCategory } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      message.success("Thêm danh mục thành công!");
      nav("/admin/category/list");  
    },
    onError: (error: any) => {
      message.error(error.message || "Lỗi khi thêm danh mục!");
    },
  });

  const onFinish = (values: { name: string; description: string }) => {
    handleAddCategory(values); 
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Thêm danh mục
      </Button>
    </Form>
  );
}

export default CategoryAdd;

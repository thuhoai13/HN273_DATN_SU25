import { Button, Form, FormProps, Input, message } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  editCategoryDetail,
  getCategoryDetail,
  CategoryForm,
} from "../../../services/category"; 
import { useMutation, useQuery } from "@tanstack/react-query";

function CategoryEdit() {
  const { id } = useParams();

  const [form] = Form.useForm();
  const nav = useNavigate();

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryDetail(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    }
  }, [category, form]);

  const { mutate: handleEdit } = useMutation({
    mutationFn: editCategoryDetail,  
  });

  const onFinish: FormProps<CategoryForm>["onFinish"] = (values) => {
    if (!id) return;
    handleEdit(
      { id, values },
      {
        onSuccess: () => {
          message.success("Cập nhật danh mục thành công!");
          nav("/admin/category/list"); 
        },
        onError: () => {
          message.error("Lỗi khi cập nhật danh mục!");
        },
      }
    );
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Cập nhật
      </Button>
    </Form>
  );
}

export default CategoryEdit;

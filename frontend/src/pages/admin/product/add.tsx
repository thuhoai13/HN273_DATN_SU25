import { Button, Form, FormProps, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addProduct, ProductForm } from "../../../services/product";
import { useMutation } from "@tanstack/react-query";

function ProductAdd() {
  const [form] = Form.useForm();
  const nav = useNavigate();

  const { mutate: handleAdd } = useMutation({
    mutationFn: addProduct,
  });

  const onFinish: FormProps<ProductForm>["onFinish"] = (values) => {
    handleAdd(values, {
      onSuccess: () => {
        message.success("Thêm sản phẩm thành công!");
        nav("/admin/product/list");
      },
      onError: () => {
        message.error("Lỗi khi thêm sản phẩm!");
      },
    });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item name="image" label="Image URL" rules={[{ required: true, message: "Vui lòng nhập URL ảnh sản phẩm" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="stock"
        label="Stock"
        rules={[{ required: true, message: "Vui lòng nhập số lượng kho" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ProductAdd;
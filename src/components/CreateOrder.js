import React, { useState } from "react";
import { Button, Input, Select, Card, Radio, Table, message, Row, Col, Form, Popconfirm } from "antd";
import ConfirmOrder from "./ConfirmOrder";

const { Option } = Select;

const mockProducts = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
  { id: 3, name: "Product C", price: 300 },
];

const mockDiscounts = [
  { code: "SALE10", type: "percent", value: 10 },
  { code: "VOUCHER50$", type: "flat", value: 50 },
];

const CreateOrder = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addProductToCart = (productId) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setCart([...cart, { ...product, quantity: 1, discountCode: null }]);
    }
  };

  const updateCart = (index, key, value) => {
    const updatedCart = [...cart];
    updatedCart[index][key] = value;
    setCart(updatedCart);
  };

  const removeProductFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      let discount = 0;
      const discountDetail = mockDiscounts.find((d) => d.code === item.discountCode);
      if (discountDetail) {
        if (discountDetail.type === "percent") {
          discount = (item.price * item.quantity * discountDetail.value) / 100;
        } else if (discountDetail.type === "flat") {
          discount = discountDetail.value;
        }
      }
      return total + item.price * item.quantity - discount;
    }, 0);
  };

  const handlePayment = () => {
    if (paymentMethod === "cash" && cashGiven < calculateTotal()) {
      message.error("Số tiền khách đưa không đủ!");
      return;
    }
    console.log("customerInfo", customerInfo);
    setIsModalVisible(true);
  };

  const handleConfirmOrder = () => {
    setCustomerInfo((prevOrder) => ({
      ...prevOrder,
      name: "",
      email: "",
      phone: "",
    }));
    setCart([]);
    setPaymentMethod("cash");
    setCashGiven(0);

    setIsModalVisible(false); // Đóng modal
  };

  const columnsTable = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Số lượng",
      render: (_, record, index) => (
        <Input
          type="number"
          value={record.quantity}
          onChange={(e) => updateCart(index, "quantity", parseInt(e.target.value))}
        />
      ),
    },
    {
      title: "Đơn giá",
      render: (_, record, index) => (
        <Input
          type="number"
          value={record.price}
          onChange={(e) => updateCart(index, "price", parseFloat(e.target.value))}
        />
      ),
    },
    {
      title: "Mã khuyến mãi",
      render: (_, record, index) => (
        <Select
          placeholder="Áp mã"
          value={record.discountCode}
          style={{ width: 120 }}
          onChange={(value) => updateCart(index, "discountCode", value)}
        >
          {mockDiscounts.map((d) => (
            <Option key={d.code} value={d.code}>
              {d.code}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Xóa",
      render: (_, __, index) => (
        <Popconfirm
          title="Xoá sản phẩm"
          description="bạn có chắc chắn muốn xoá sản phẩm này không?"
          onConfirm={() => removeProductFromCart(index)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Order</h2>
      {/* thông tin khách hàng */}
      <Row gutter={16} style={{ marginBottom: 5 }}>
        <Col span={8}>
          <Form.Item label="Tên khách hàng">
            <Input
              placeholder="Tên khách hàng"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Email khách hàng">
            <Input
              placeholder="Email khách hàng"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Số điện thoại khách hàng">
            <Input
              placeholder="Số điện thoại khách hàng"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* Product Selection */}
      <Select placeholder="Thêm sản phẩm" style={{ width: 300, marginBottom: 10 }} onChange={addProductToCart}>
        {mockProducts.map((product) => (
          <Option key={product.id} value={product.id}>
            {product.name} - {product.price}$
          </Option>
        ))}
      </Select>
      {/* Giỏ hàng */}
      <Table dataSource={cart} columns={columnsTable} rowKey="id" pagination={false} />
      {/* phương thức thanh toán */}
      <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginTop: 10 }}>
        <Radio value="cash">Tiền mặt</Radio>
        <Radio value="card">Thẻ</Radio>
      </Radio.Group>
      {paymentMethod === "cash" && (
        <Input
          placeholder="Số tiền khách đưa"
          type="number"
          value={cashGiven}
          onChange={(e) => setCashGiven(parseFloat(e.target.value))}
          style={{ marginTop: 10 }}
        />
      )}
      {/* Tổng tiền */}
      <Card style={{ marginTop: 20 }}>
        <h3 style={{ color: "red" }}>Tổng giá trị: {calculateTotal()}$</h3>
        {paymentMethod === "cash" && cashGiven > calculateTotal() && (
          <h4>Tiền thừa: {cashGiven - calculateTotal()}$</h4>
        )}
      </Card>
      {/* Submit */}
      <Button type="primary" style={{ marginTop: 10 }} onClick={handlePayment}>
        Thanh toán
      </Button>
      {/* Modal */}
      <ConfirmOrder
        visible={isModalVisible}
        onConfirm={handleConfirmOrder}
        onClose={() => setIsModalVisible(false)}
        customerInfo={customerInfo}
        cart={cart}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default CreateOrder;

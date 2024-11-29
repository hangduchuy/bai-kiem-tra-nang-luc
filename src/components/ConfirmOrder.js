import React from "react";
import { Modal, Table } from "antd";

const ConfirmOrder = ({ visible, onConfirm, onClose, customerInfo, cart, paymentMethod }) => {
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    { title: "Mã khuyến mãi", dataIndex: "discountCode", key: "discountCode" },
  ];

  return (
    <Modal
      title="Xác nhận đơn hàng"
      visible={visible}
      onOk={() => {
        onConfirm();
        onClose();
      }}
      onCancel={onClose}
    >
      {/* Thông tin khách hàng */}
      <h3>Thông tin khách hàng</h3>
      <p>Tên: {customerInfo.name}</p>
      <p>Email: {customerInfo.email}</p>
      <p>Điện thoại: {customerInfo.phone}</p>

      {/* Thông tin giỏ hàng */}
      <h3>Thông tin giỏ hàng</h3>
      <Table dataSource={cart} columns={columns} rowKey="id" pagination={false} />

      {/* Thông tin thanh toán */}
      <h3>Phương thức thanh toán</h3>
      <p>{paymentMethod === "cash" ? "Tiền mặt" : "Thẻ"}</p>
    </Modal>
  );
};

export default ConfirmOrder;

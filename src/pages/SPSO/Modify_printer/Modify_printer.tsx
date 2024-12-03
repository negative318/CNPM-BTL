import React, { useState } from "react";
import { Button, Input, Modal, Select, Space, Form, Typography, Card, Row, Col } from "antd";

const { Title } = Typography;

interface Printer {
  id: string;
  status: string;
  campus: string;
  building: string;
  location: string;
}

const ModifyPrinter: React.FC = () => {
  const initialPrinterData: Printer[] = [
    { id: "Máy 1", status: "Khả dụng", campus: "Cơ sở Lý Thường Kiệt", building: "H4", location: "Tầng 1" },
    { id: "Máy 2", status: "Bảo trì", campus: "Cơ sở Lý Thường Kiệt", building: "H5", location: "Tầng 2" },
    { id: "Máy 3", status: "Khả dụng", campus: "Cơ sở Dĩ An Bình Dương", building: "H4", location: "Tầng 3" },
    { id: "Máy 4", status: "Khả dụng", campus: "Cơ sở Dĩ An Bình Dương", building: "H5", location: "Tầng 4" },
  ];

  const [printerData, setPrinterData] = useState<Printer[]>(initialPrinterData);
  const [selectedCampus, setSelectedCampus] = useState<string | undefined>();
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>();
  const [filteredPrinters, setFilteredPrinters] = useState<Printer[]>(initialPrinterData);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleResetSearch = () => {
    setSelectedCampus(undefined);
    setSelectedBuilding(undefined);
    setFilteredPrinters(printerData); // Hiển thị toàn bộ danh sách máy in
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (selectedCampus && selectedBuilding) {
      const result = printerData.filter(
        (printer) =>
          printer.campus === selectedCampus && printer.building === selectedBuilding
      );
      setFilteredPrinters(result);
    } else {
      setFilteredPrinters(printerData);
    }
  };

  // Xử lý thêm máy in
  const handleAddPrinter = (values: any) => {
    const newPrinter: Printer = {
      id: `Máy ${printerData.length + 1}`,
      status: "Khả dụng",
      campus: values.campus,
      building: values.building,
      location: values.location,
    };
    setPrinterData([...printerData, newPrinter]);
    setFilteredPrinters([...filteredPrinters, newPrinter]);
    setIsAdding(false);
  };

  // Xử lý thay đổi trạng thái máy in
  const handleChangeStatus = (printerId: string) => {
    setPrinterData((prevData) => {
      const updatedData = prevData.map((printer) =>
        printer.id === printerId
          ? { ...printer, status: printer.status === "Khả dụng" ? "Bảo trì" : "Khả dụng" }
          : printer
      );
      setFilteredPrinters(updatedData); // Cập nhật lại danh sách hiển thị
      return updatedData;
    });
  };

  // Xử lý xóa máy in
  const handleDeletePrinter = () => {
    if (selectedPrinter) {
      Modal.confirm({
        title: "Xác nhận xóa máy in",
        content: `Bạn có chắc muốn xóa ${selectedPrinter.id}?`,
        onOk: () => {
          const updatedData = printerData.filter((printer) => printer.id !== selectedPrinter.id);
          setPrinterData(updatedData);
          setFilteredPrinters(updatedData);
          setSelectedPrinter(null);
        },
      });
    }
  };

  // Hàm để lấy màu nền dựa trên trạng thái máy in
  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "Khả dụng":
        return "#d4edda"; // Màu xanh nhạt
      case "Bảo trì":
        return "#f8d7da"; // Màu đỏ nhạt
      default:
        return "#ffffff"; // Màu trắng
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f7f7f7", borderRadius: "10px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2}>Chọn cơ sở và tòa nhà để xử lý</Title>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Select
          placeholder="Chọn cơ sở"
          value={selectedCampus}
          onChange={(value) => setSelectedCampus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Cơ sở Lý Thường Kiệt">Cơ sở Lý Thường Kiệt</Select.Option>
          <Select.Option value="Cơ sở Dĩ An Bình Dương">Cơ sở Dĩ An Bình Dương</Select.Option>
        </Select>
        <Select
          placeholder="Chọn tòa nhà"
          value={selectedBuilding}
          onChange={(value) => setSelectedBuilding(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="H4">H4</Select.Option>
          <Select.Option value="H5">H5</Select.Option>
        </Select>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button onClick={() => handleResetSearch()}>
            Hủy tìm kiếm
          </Button>
        </Space>
      </Space>

      <Row gutter={[20, 20]} style={{ marginTop: "20px" }}>
        {filteredPrinters.map((printer) => (
          <Col key={printer.id} span={6}>
            <Card
              hoverable
              onClick={() => setSelectedPrinter(printer)}
              style={{
                backgroundColor: printer.id === selectedPrinter?.id ? "#e6f7ff" : getBackgroundColor(printer.status),
                borderColor: printer.id === selectedPrinter?.id ? "#1890ff" : "#f0f0f0",
              }}
            >
              <Title level={4}>{printer.id}</Title>
              <p>{printer.location}</p>
              <p
                onClick={() => handleChangeStatus(printer.id)}
                style={{
                  color: printer.status === "Khả dụng" ? "green" : "red",
                  cursor: "pointer",
                }}
              >
                {printer.status}
              </p>
            </Card>
          </Col>
        ))}
        <Col span={6}>
          <Card
            hoverable
            onClick={() => setIsAdding(true)}
            style={{
              border: "1px dashed #ccc",
              textAlign: "center",
            }}
          >
            <Title level={4}>+ Thêm máy in</Title>
          </Card>
        </Col>
      </Row>

      <Button
        type="primary"
        danger
        onClick={handleDeletePrinter}
        disabled={!selectedPrinter}
        style={{ marginTop: "20px" }}
      >
        Xóa máy in
      </Button>

      {/* Modal thêm máy in */}
      <Modal
        title="Thêm máy in mới"
        visible={isAdding}
        onCancel={() => setIsAdding(false)}
        footer={null}
      >
        <Form onFinish={handleAddPrinter} layout="vertical">
          <Form.Item name="campus" label="Cơ sở" rules={[{ required: true, message: "Vui lòng chọn cơ sở!" }]}>
            <Select placeholder="Chọn cơ sở">
              <Select.Option value="Cơ sở Lý Thường Kiệt">Cơ sở Lý Thường Kiệt</Select.Option>
              <Select.Option value="Cơ sở Dĩ An Bình Dương">Cơ sở Dĩ An Bình Dương</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="building" label="Tòa nhà" rules={[{ required: true, message: "Vui lòng chọn tòa nhà!" }]}>
            <Select placeholder="Chọn tòa nhà">
              <Select.Option value="H4">H4</Select.Option>
              <Select.Option value="H5">H5</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="location" label="Vị trí" rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}>
            <Input placeholder="Nhập vị trí (ví dụ: Tầng 1)" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm máy in
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ModifyPrinter;

import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Modal, Select, Space, Typography, Card, Row, Col, Form } from "antd";
import { AppContext } from "../../../contexts/app.context";

const { Title } = Typography;

interface Printer {
  id: number;
  status: string;
  campus: string;
  building: string;
  location: string;
}

const ModifyPrinter: React.FC = () => {
  const { isAuthenticated, profile } = useContext(AppContext); // Lấy thông tin từ context
  const [printerData, setPrinterData] = useState<Printer[]>([]);
  const [filteredPrinters, setFilteredPrinters] = useState<Printer[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string | undefined>();
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>();
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isAuthenticated || !profile) return;

    const fetchPrinters = async () => {
      try {
        const token = profile?.jwtToken || "";
        const response = await fetch(
          "http://localhost:8080/api/v1/printers/status?location=LTK&pageNumber=0&pageSize=10",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const formattedPrinters: Printer[] = data.content.map((printer: any) => ({
          id: printer.id,
          status: printer.printerStatus === "ON" ? "Khả dụng" : "Bảo trì",
          campus: printer.campusName,
          building: printer.buildingName,
          location: `Phòng ${printer.roomNumber}`,
        }));

        setPrinterData(formattedPrinters);
        setFilteredPrinters(formattedPrinters);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu máy in:", error);
      }
    };

    fetchPrinters();
  }, [isAuthenticated, profile]);

  // Thêm máy in mới
  const handleAddPrinter = async (values: any) => {
    try {
      const token = profile?.jwtToken || "";
      const response = await fetch("http://localhost:8080/api/v1/printers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPrinter = await response.json();
      const formattedPrinter: Printer = {
        id: newPrinter.id,
        status: "Khả dụng",
        campus: newPrinter.campusName,
        building: newPrinter.buildingName,
        location: `Phòng ${newPrinter.roomNumber}`,
      };

      // Cập nhật danh sách máy in
      setPrinterData([...printerData, formattedPrinter]);
      setFilteredPrinters([...filteredPrinters, formattedPrinter]);

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm máy in mới:", error);
    }
  };

  const handleSearch = () => {
    const result = printerData.filter(
      (printer) =>
        (!selectedCampus || printer.campus === selectedCampus) &&
        (!selectedBuilding || printer.building === selectedBuilding)
    );
    setFilteredPrinters(result);
  };

  const handleResetSearch = () => {
    setSelectedCampus(undefined);
    setSelectedBuilding(undefined);
    setFilteredPrinters(printerData);
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
          {Array.from(new Set(printerData.map((printer) => printer.campus))).map((campus) => (
            <Select.Option key={campus} value={campus}>
              {campus}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Chọn tòa nhà"
          value={selectedBuilding}
          onChange={(value) => setSelectedBuilding(value)}
          style={{ width: "100%" }}
        >
          {Array.from(new Set(printerData.map((printer) => printer.building))).map((building) => (
            <Select.Option key={building} value={building}>
              {building}
            </Select.Option>
          ))}
        </Select>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button onClick={handleResetSearch}>Hủy tìm kiếm</Button>
          <Button type="dashed" onClick={() => setIsModalVisible(true)}>
            Thêm máy in mới
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
                backgroundColor: printer.status === "Khả dụng" ? "#d4edda" : "#f8d7da",
              }}
            >
              <Title level={4}>{`Máy in ${printer.id}`}</Title>
              <p>{printer.location}</p>
              <p style={{ color: printer.status === "Khả dụng" ? "green" : "red" }}>{printer.status}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal thêm máy in */}
      <Modal
        title="Thêm máy in mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPrinter}>
          <Form.Item name="model" label="Model" rules={[{ required: true, message: "Vui lòng nhập model" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="buildingName" label="Tên tòa nhà" rules={[{ required: true, message: "Vui lòng nhập tên tòa nhà" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="campusName" label="Tên cơ sở" rules={[{ required: true, message: "Vui lòng nhập tên cơ sở" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roomNumber" label="Số phòng" rules={[{ required: true, message: "Vui lòng nhập số phòng" }]}>
            <Input />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "end" }}>
            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default ModifyPrinter;

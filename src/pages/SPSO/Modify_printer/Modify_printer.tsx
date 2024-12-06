import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Form,
  message,
  Popconfirm,
} from "antd";
import { AppContext } from "../../../contexts/app.context";

const { Title } = Typography;
const { Option } = Select;

interface Printer {
  id: number;
  status: string;
  campus: string;
  building: string;
  location: string;
}

const ModifyPrinter: React.FC = () => {
  const { isAuthenticated, profile } = useContext(AppContext);
  const [printerData, setPrinterData] = useState<Printer[]>([]);
  const [filteredPrinters, setFilteredPrinters] = useState<Printer[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string | undefined>();
  const [selectedBuilding, setSelectedBuilding] = useState<
    string | undefined
  >();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchPrinters = async () => {
    if (!isAuthenticated || !profile || !selectedCampus) {
      message.warning("Vui lòng đăng nhập và chọn cơ sở để tiếp tục!");
      return;
    }

    try {
      setLoading(true);
      const token = profile?.jwtToken || "";
      const response = await fetch(
        `http://localhost:8080/api/v1/printers/status?location=${selectedCampus}&pageNumber=0&pageSize=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Không thể tải dữ liệu máy in!"
        );
      }

      const data = await response.json();
      const formattedPrinters: Printer[] = data.content.map((printer: any) => ({
        id: printer.id,
        status: printer.printerStatus === "ON" ? "Khả dụng" : "Bảo trì",
        campus: printer.campusName,
        building: printer.buildingName,
        location: `Phòng ${printer.roomNumber}`,
      }));

      if (formattedPrinters.length === 0) {
        message.info("Không tìm thấy máy in nào.");
      }

      setPrinterData(formattedPrinters);
      setFilteredPrinters(formattedPrinters);
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu máy in:", error);
      message.error(error.message || "Không thể tải dữ liệu máy in!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, [isAuthenticated, profile, selectedCampus]);

  const handleAddPrinter = async (values: any) => {
    setLoading(true);
    try {
      const token = profile?.jwtToken || "";
      if (!token) {
        throw new Error("Token xác thực không hợp lệ. Vui lòng đăng nhập lại.");
      }

      const payload = {
        model: values.model.trim(),
        description: values.description.trim(),
        brand: values.brand.trim(),
        buildingName: values.buildingName.trim(),
        campusName: values.campusName,
        roomNumber: values.roomNumber.trim(),
      };

      const response = await fetch("http://localhost:8080/api/v1/printers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Không thể thêm máy in!");
      }

      const newPrinter = await response.json();

      const formattedPrinter: Printer = {
        id: newPrinter.id,
        status: "Khả dụng",
        campus: newPrinter.campusName,
        building: newPrinter.buildingName,
        location: `Phòng ${newPrinter.roomNumber}`,
      };

      setPrinterData([...printerData, formattedPrinter]);
      setFilteredPrinters([...filteredPrinters, formattedPrinter]);

      setIsModalVisible(false);
      form.resetFields();

      Modal.confirm({
        title: "Thành công",
        content: "Thêm máy in thành công!",
        onOk: () => window.location.reload(),
      });
    } catch (error: any) {
      console.error("Lỗi khi thêm máy in:", error);
      message.error(
        error.message || "Không thể thêm máy in. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrinterStatus = async (printerId: number) => {
    setLoading(true);
    try {
      const token = profile?.jwtToken || "";
      if (!token) {
        throw new Error("Token xác thực không hợp lệ. Vui lòng đăng nhập lại.");
      }

      const printer = printerData.find((p) => p.id === printerId);
      if (!printer) {
        throw new Error("Không tìm thấy máy in để cập nhật.");
      }

      const newStatus = printer.status === "Khả dụng" ? "OFF" : "ON";

      const payload = {
        brand: null,
        buildingName: printer.building,
        campusName: printer.campus,
        roomNumber: printer.location.replace("Phòng ", ""),
        count: 100,
        printerStatus: newStatus,
        recentMaintenanceDate: new Date().toISOString(),
        max: 200,
      };

      const response = await fetch(
        `http://localhost:8080/api/v1/printers/${printerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Không thể thay đổi trạng thái máy in!"
        );
      }

      Modal.confirm({
        title: "Thành công",
        content: "Thay đổi trạng thái máy in thành công!",
        onOk: () => window.location.reload(), // Reload trang khi nhấn OK
      });
    } catch (error: any) {
      console.error("Lỗi khi thay đổi trạng thái máy in:", error);
      message.error(
        error.message || "Không thể thay đổi trạng thái. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrinter = async (printerId: number) => {
    setLoading(true);
    try {
      const token = profile?.jwtToken || "";
      const response = await fetch(
        `http://localhost:8080/api/v1/printers/${printerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Không thể xóa máy in!");
      }

      Modal.confirm({
        title: "Thành công",
        content: "Xóa máy in thành công!",
        onOk: () => window.location.reload(), // Reload trang khi nhấn OK
      });
    } catch (error: any) {
      console.error("Lỗi khi xóa máy in:", error);
      message.error(error.message || "Không thể xóa máy in. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const result = printerData.filter(
      (printer) =>
        (!selectedCampus || printer.campus === selectedCampus) &&
        (!selectedBuilding || printer.building === selectedBuilding)
    );
    setFilteredPrinters(result);
    if (result.length === 0) {
      message.info("Không có máy in nào phù hợp với tiêu chí tìm kiếm.");
    }
  };

  const handleResetSearch = () => {
    setSelectedCampus(undefined);
    setSelectedBuilding(undefined);
    setFilteredPrinters(printerData);
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <Title level={2}>Chọn cơ sở và tòa nhà để xử lý</Title>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Select
          placeholder="Chọn cơ sở"
          onChange={(value) => setSelectedCampus(value)}
          style={{ width: "300px" }}
        >
          <Option value="LTK">Cơ sở Lý Thường Kiệt</Option>
          <Option value="DA">Cơ sở Dĩ An</Option>
        </Select>

        <Select
          placeholder="Chọn tòa nhà"
          value={selectedBuilding}
          onChange={(value) => setSelectedBuilding(value)}
          style={{ width: "300px" }}
        >
          {Array.from(
            new Set(printerData.map((printer) => printer.building))
          ).map((building) => (
            <Option key={building} value={building}>
              {building}
            </Option>
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
        {filteredPrinters.length === 0 ? (
          <p>Không có máy in nào phù hợp.</p>
        ) : (
          filteredPrinters.map((printer) => (
            <Col key={printer.id} span={6}>
              <Card
                hoverable
                style={{
                  backgroundColor:
                    printer.status === "Khả dụng" ? "#d4edda" : "#f8d7da",
                }}
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleTogglePrinterStatus(printer.id)}
                    loading={loading}
                  >
                    {printer.status === "Khả dụng" ? "Bảo trì" : "Khả dụng"}
                  </Button>,
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa máy in này?"
                    onConfirm={() => handleDeletePrinter(printer.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="link" danger loading={loading}>
                      Xóa
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Title level={4}>{printer.location}</Title>
                <p>Tòa nhà: {printer.building}</p>
                <p>Cơ sở: {printer.campus}</p>
                <p>Trạng thái: {printer.status}</p>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Modal
        title="Thêm máy in mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddPrinter}
          layout="vertical"
          initialValues={{
            model: "",
            description: "",
            brand: "",
            buildingName: "",
            campusName: "",
            roomNumber: "",
          }}
        >
          <Form.Item
            label="Model máy in"
            name="model"
            rules={[
              { required: true, message: "Vui lòng nhập model máy in!" },
              { max: 100, message: "Model không được vượt quá 100 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập model máy in (ví dụ: Epson Workforce)" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả cho máy in!" },
              { max: 200, message: "Mô tả không được vượt quá 200 ký tự!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập mô tả máy in (ví dụ: All-in-one wireless color printer)" />
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brand"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập thương hiệu máy in!",
              },
              {
                max: 50,
                message: "Thương hiệu không được vượt quá 50 ký tự!",
              },
            ]}
          >
            <Input placeholder="Nhập thương hiệu máy in (ví dụ: Epson)" />
          </Form.Item>

          <Form.Item
            label="Tên tòa nhà"
            name="buildingName"
            rules={[
              { required: true, message: "Vui lòng nhập tên tòa nhà!" },
              {
                max: 50,
                message: "Tên tòa nhà không được vượt quá 50 ký tự!",
              },
            ]}
          >
            <Input placeholder="Nhập tên tòa nhà (ví dụ: B6)" />
          </Form.Item>

          <Form.Item
            label="Tên cơ sở"
            name="campusName"
            rules={[{ required: true, message: "Vui lòng chọn tên cơ sở!" }]}
          >
            <Select placeholder="Chọn cơ sở">
              <Option value="LTK">Lý Thường Kiệt</Option>
              <Option value="DA">Dĩ An</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số phòng"
            name="roomNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số phòng!" },
              {
                pattern: /^[a-zA-Z0-9\-]+$/,
                message: "Số phòng chỉ được chứa chữ, số và dấu gạch ngang!",
              },
            ]}
          >
            <Input placeholder="Nhập số phòng (ví dụ: 408 hoặc H6-704)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm máy in
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ModifyPrinter;

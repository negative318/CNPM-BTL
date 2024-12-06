import React, { useState, useEffect, useContext } from "react";
import { Table, Card, message, Select, Button } from "antd";
import { AppContext } from "../../../contexts/app.context";
import axios from "axios";

const { Option } = Select;

interface PrintHistory {
  key: string;
  date: string;
  documentName: string;
  status: string;
  pagePerSheet: number;
  copies: number;
  pageOrientation: string;
}

interface Printer {
  id: number;
  name: string;
}

const PrintingHistory: React.FC = () => {
  const [data, setData] = useState<PrintHistory[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, profile } = useContext(AppContext);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error("Vui lòng đăng nhập để xem lịch sử in ấn.");
      return;
    }

    if (!selectedCampus) return;

    const fetchPrinters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/printers/status?location=${selectedCampus}&pageNumber=0&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${profile.jwtToken}`,
            },
          }
        );
        const printersData = response.data.content.map((printer: any) => ({
          id: printer.id,
          name: `${printer.description} - ${printer.buildingName} (${printer.roomNumber})`,
        }));
        console.log(response);

        setPrinters(printersData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách máy in:", error);
        message.error("Không thể tải danh sách máy in. Vui lòng thử lại sau.");
      }
    };

    fetchPrinters();
  }, [isAuthenticated, profile, selectedCampus]);

  useEffect(() => {
    if (selectedPrinter === null) return;

    const fetchPrintHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/printing/printers/${selectedPrinter}/logs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu, vui lòng thử lại sau.");
        }

        const result = await response.json();

        const formattedData = result.content.map((item: any) => ({
          key: item.id.toString(),
          date: new Date(item.logDate).toLocaleString(),
          documentName: item.document.name,
          status: item.logStatus,
          pagePerSheet: item.pagePerSheet,
          copies: item.numberOfCopy,
          pageOrientation: item.pageOrientation,
        }));

        setData(formattedData);
      } catch (error: any) {
        message.error(error.message || "Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintHistory();
  }, [selectedPrinter, profile]);

  const columns = [
    { title: "Ngày in", dataIndex: "date", key: "date" },
    { title: "Tài liệu", dataIndex: "documentName", key: "documentName" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Trang mỗi tờ", dataIndex: "pagePerSheet", key: "pagePerSheet" },
    { title: "Số bản sao", dataIndex: "copies", key: "copies" },
    {
      title: "Hướng giấy",
      dataIndex: "pageOrientation",
      key: "pageOrientation",
    },
  ];

  return (
    <div style={{ background: "#f8f9fa", padding: "20px", minHeight: "100vh" }}>
      {/* Tiêu đề */}
      <Card
        style={{
          borderRadius: "10px",
          marginBottom: "20px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#343a40",
            fontFamily: "Arial, sans-serif",
            marginBottom: "0",
          }}
        >
          Lịch sử in ấn
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#6c757d",
            fontFamily: "Arial, sans-serif",
            marginTop: "10px",
          }}
        >
          Vui lòng chọn campus và máy in để xem lịch sử.
        </p>
      </Card>

      {/* Chọn campus */}
      <Card style={{ marginBottom: "20px", borderRadius: "10px" }}>
        <Select
          placeholder="Chọn campus"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(value) => {
            setSelectedCampus(value);
            setPrinters([]);
            setSelectedPrinter(null);
          }}
          allowClear
        >
          <Option value="LTK">Lý Thường Kiệt</Option>
          <Option value="DA">Bình Dương</Option>
        </Select>

        <Select
          placeholder="Chọn máy in"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedPrinter(value)}
          allowClear
          disabled={!selectedCampus}
        >
          {printers.map((printer) => (
            <Option key={printer.id} value={printer.id}>
              {printer.name}
            </Option>
          ))}
        </Select>
      </Card>

      {/* Bảng */}
      <Card style={{ borderRadius: "10px" }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{
            pageSize: 50,
            position: ["bottomCenter"],
          }}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif", // Phông chữ bảng
            fontSize: "14px", // Cỡ chữ bảng
          }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>
    </div>
  );
};

export default PrintingHistory;

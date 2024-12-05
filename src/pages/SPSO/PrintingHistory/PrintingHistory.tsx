import React, { useState, useEffect, useContext } from "react";
import { Radio, Input, Table, Card, Select, message } from "antd";
import { AppContext } from "../../../contexts/app.context";

const { Group: RadioGroup } = Radio;
const { Option } = Select;

interface PrintHistory {
  key: string;
  date: string;
  printerId: string;
  document: string;
  quantity: number;
  mssv: string;
}

const PrintingHistory: React.FC = () => {
  const [searchType, setSearchType] = useState("student");
  const [mssv, setMssv] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [data, setData] = useState<PrintHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, profile } = useContext(AppContext);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error("Vui lòng đăng nhập để xem lịch sử in ấn.");
      return;
    }

    const fetchPrintHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/printing/printers/3/logs",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${profile.jwtToken}`, // Sửa lại chỗ này
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
          printerId: item.document.id.toString(),
          document: item.document.name,
          quantity: item.document.pageNumber,
          mssv: "unknown",
        }));

        setData(formattedData);
      } catch (error: any) {
        message.error(error.message || "Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintHistory();
  }, [isAuthenticated, profile]);

  const filteredData =
    searchType === "student"
      ? data.filter((item) => item.mssv === mssv)
      : data.filter((item) => item.printerId === selectedPrinter);

  const columns = [
    { title: "Ngày in", dataIndex: "date", key: "date" },
    { title: "STT máy in", dataIndex: "printerId", key: "printerId" },
    { title: "Tài liệu", dataIndex: "document", key: "document" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
  ];

  return (
    <div style={{ background: "#e9ecef", padding: "20px", minHeight: "100vh" }}>
      {/* Khung tra cứu */}
      <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Lịch sử in ấn:</h3>
        <div>
          <span style={{ fontWeight: "bold", marginRight: "10px" }}>
            Tra cứu trên:
          </span>
          <RadioGroup
            onChange={(e) => setSearchType(e.target.value)}
            defaultValue="student"
          >
            <Radio value="student">Sinh viên</Radio>
            <Radio value="printer">Máy in</Radio>
          </RadioGroup>
        </div>
      </Card>

      {/* Khung nhập thông tin */}
      {searchType === "student" && (
        <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "10px" }}>Dựa trên sinh viên:</h4>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", marginRight: "10px" }}>
              MSSV:
            </span>
            <Input
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              style={{
                width: "300px",
                borderRadius: "10px",
                background: "#e9ecef",
                border: "none",
              }}
              placeholder="Nhập MSSV (VD: 20210001)"
            />
          </div>
        </Card>
      )}

      {searchType === "printer" && (
        <Card style={{ borderRadius: "10px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "10px" }}>Dựa trên máy in:</h4>
          <Select
            placeholder="Chọn máy in"
            onChange={(value) => setSelectedPrinter(value)}
            style={{
              width: "300px",
              borderRadius: "10px",
              background: "#e9ecef",
            }}
          >
            <Option value="1">Máy in 001</Option>
            <Option value="2">Máy in 002</Option>
            <Option value="3">Máy in 003</Option>
            <Option value="4">Máy in 004</Option>
            <Option value="5">Máy in 005</Option>
            <Option value="6">Máy in 006</Option>
            <Option value="7">Máy in 007</Option>
            <Option value="8">Máy in 008</Option>
            <Option value="9">Máy in 009</Option>
            <Option value="10">Máy in 010</Option>
          </Select>
        </Card>
      )}

      {/* Bảng lịch sử */}
      <Card style={{ borderRadius: "10px" }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSize: 50,
            position: ["bottomCenter"], // Căn giữa thanh phân trang
          }}
          style={{ borderRadius: "10px", overflow: "hidden" }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>
    </div>
  );
};

export default PrintingHistory;

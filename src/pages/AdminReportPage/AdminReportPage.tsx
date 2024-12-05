import React, { useState, useEffect, useContext } from "react";
import { Table, Card, message, Radio } from "antd";
import { AppContext } from "../../contexts/app.context";

interface ReportData {
  key: string;
  reportDate: string;
  reportType: string;
  url: string;
}

const AdminReportPage: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<"MONTHLY" | "ANNUALLY">(
    "MONTHLY"
  );
  const { isAuthenticated, profile } = useContext(AppContext);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error("Vui lòng đăng nhập để xem lịch sử in ấn.");
      return;
    }

    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/reports?pageNumber=0&pageSize=10&reportType=${reportType}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${profile.jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu, vui lòng thử lại sau.");
        }

        const result = await response.json();

        const formattedData = result.content.map((item: any) => ({
          key: item.id.toString(),
          reportDate: new Date(item.reportDate).toLocaleString(),
          reportType: item.reportType,
          url: `http://localhost:8080${item.url}`, // Nối thêm URL gốc
        }));

        setData(formattedData);
      } catch (error: any) {
        message.error(error.message || "Đã xảy ra lỗi!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [isAuthenticated, profile, reportType]);

  const columns = [
    { title: "ID Báo cáo", dataIndex: "key", key: "key" },
    { title: "Ngày báo cáo", dataIndex: "reportDate", key: "reportDate" },
    { title: "Loại báo cáo", dataIndex: "reportType", key: "reportType" },
    {
      title: "Tên file báo cáo",
      dataIndex: "url",
      key: "url",
      render: (url: string) => {
        const fileName = url.split("/").pop(); // Lấy tên file từ URL
        return (
          <a href={url} download target="_blank" rel="noopener noreferrer">
            {fileName}
          </a>
        );
      },
    },
  ];

  return (
    <div style={{ background: "#e9ecef", padding: "20px", minHeight: "100vh" }}>
      <Card style={{ borderRadius: "10px" }}>
        <h3 style={{ marginBottom: "20px" }}>Danh sách báo cáo</h3>

        {/* Radio để chọn loại báo cáo */}
        <Radio.Group
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{ marginBottom: "20px" }}
        >
          <Radio.Button value="MONTHLY">Hàng tháng</Radio.Button>
          <Radio.Button value="ANNUALLY">Hàng năm</Radio.Button>
        </Radio.Group>

        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          locale={{ emptyText: "Không có dữ liệu" }}
          style={{ borderRadius: "10px" }}
        />
      </Card>
    </div>
  );
};

export default AdminReportPage;

import React, { useState, useEffect, useContext } from 'react';
import { message, Table, Button, Card, Typography, Space } from 'antd'; // Thêm các component từ antd
import axios from 'axios';
import { AppContext } from '../../../contexts/app.context';

const { Title } = Typography;

interface Report {
  id: number;
  reportDate: string;
  reportType: string;
  url: string;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface ApiResponse {
  content: Report[];
  pageable: Pageable;
}

const Report: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const { isAuthenticated, profile } = useContext(AppContext); // Thay bằng giá trị thực tế từ hệ thống xác thực

  const fetchReports = async () => {
    try {
      const token = profile?.jwtToken;
      const response = await axios.get<ApiResponse>(
        `http://localhost:8080/api/v1/reports?pageNumber=${pageNumber}&pageSize=${pageSize}&reportType=MONTHLY`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports(response.data.content);
      setTotalPages(response.data.pageable.totalPages);
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('Error fetching reports');
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error('Vui lòng đăng nhập để xem báo cáo.');
      return;
    }
    fetchReports();
  }, [pageNumber, isAuthenticated, profile]); 

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Report Date',
      dataIndex: 'reportDate',
      key: 'reportDate',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Type',
      dataIndex: 'reportType',
      key: 'reportType',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Report) => (
        <a href={`http://localhost:8080${record.url}`} target="_blank" rel="noopener noreferrer">
          View Report
        </a>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={2}>Báo Cáo Hàng Tháng</Title>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={false}
        />
        <Space style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handlePreviousPage} disabled={pageNumber === 0}>
            Previous
          </Button>
          <span>
            Page {pageNumber + 1} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={pageNumber === totalPages - 1}>
            Next
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Report;

import React, { useState, useEffect, useContext } from 'react';
import { Table, Card, message } from 'antd';
import { AppContext } from '../../../contexts/app.context';

interface PrintHistory {
  key: string;
  date: string;
  documentName: string;
  status: string;
  pagePerSheet: number;
  copies: number;
  pageOrientation: string;
}

const PrintingHistory: React.FC = () => {
  const [data, setData] = useState<PrintHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, profile } = useContext(AppContext); // Thay bằng giá trị thực tế từ hệ thống xác thực

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error('Vui lòng đăng nhập để xem lịch sử in ấn.');
      return;
    }

    const fetchPrintHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/printing/printers/3/logs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${profile.jwtToken}`, // Đảm bảo sử dụng token hợp lệ
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu, vui lòng thử lại sau.');
        }

        const result = await response.json();

        // Định dạng lại dữ liệu cho bảng
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
        message.error(error.message || 'Đã xảy ra lỗi!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintHistory();
  }, [isAuthenticated, profile]);

  const columns = [
    { title: 'Ngày in', dataIndex: 'date', key: 'date' },
    { title: 'Tài liệu', dataIndex: 'documentName', key: 'documentName' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Trang mỗi tờ', dataIndex: 'pagePerSheet', key: 'pagePerSheet' },
    { title: 'Số bản sao', dataIndex: 'copies', key: 'copies' },
    { title: 'Hướng giấy', dataIndex: 'pageOrientation', key: 'pageOrientation' },
  ];

  return (
    <div style={{ background: '#f8f9fa', padding: '20px', minHeight: '100vh' }}>
      {/* Tiêu đề */}
      <Card style={{ borderRadius: '10px', marginBottom: '20px', textAlign: 'center', padding: '20px' }}>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#343a40', 
          fontFamily: 'Arial, sans-serif', 
          marginBottom: '0' 
        }}>
          Lịch sử in ấn
        </h3>
        <p style={{ 
          fontSize: '16px', 
          color: '#6c757d', 
          fontFamily: 'Arial, sans-serif', 
          marginTop: '10px' 
        }}>
        </p>
      </Card>

      {/* Bảng */}
      <Card style={{ borderRadius: '10px' }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          pagination={{
            pageSize: 50,
            position: ['bottomCenter'],
          }}
          style={{
            borderRadius: '10px',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif', // Phông chữ bảng
            fontSize: '14px', // Cỡ chữ bảng
          }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Card>
    </div>
  );
};

export default PrintingHistory;

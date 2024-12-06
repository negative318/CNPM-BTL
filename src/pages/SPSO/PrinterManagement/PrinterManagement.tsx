import React, { useState, useEffect, useContext } from 'react';
import { Input, DatePicker, message, Button, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { AppContext } from '../../../contexts/app.context';

const PrinterManagement = () => {
  const [paperAmount, setPaperAmount] = useState<number>(1);
  const [restrictedFiles, setRestrictedFiles] = useState<string[]>([]);
  const [updateDate, setUpdateDate] = useState<string | null>(dayjs().toISOString()); // Mặc định là ngày hôm nay
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isAuthenticated, profile } = useContext(AppContext);

  const logErrorDetails = (error: any) => {
    if (error.response) {
      console.error('Lỗi từ API:', error.response.data);
      console.error('Mã lỗi:', error.response.status);
      console.error('Header lỗi:', error.response.headers);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ server:', error.request);
    } else {
      console.error('Lỗi khi tạo yêu cầu:', error.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      message.error('Vui lòng đăng nhập để xem báo cáo.');
      return;
    }

    axios
      .get('http://localhost:8080/api/v1/configs', {
        headers: { Authorization: `Bearer ${profile?.jwtToken}` },
      })
      .then((response) => {
        const { defaultPageNumber, acceptedFileType, updateDate } = response.data;
        setPaperAmount(defaultPageNumber || 1);
        setRestrictedFiles(acceptedFileType || []);
        setUpdateDate(updateDate || dayjs().toISOString()); // Nếu không có ngày, mặc định là hôm nay
        message.success('Tải dữ liệu cấu hình thành công!');
      })
      .catch((error) => {
        logErrorDetails(error);
        message.error('Không thể tải dữ liệu cấu hình.');
      });
  }, [profile?.jwtToken, isAuthenticated]);

  const handleUpdateConfig = () => {
    if (!profile?.jwtToken) {
      message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
      return;
    }

    const data = {
      defaultPageNumber: paperAmount,
      updateDate: updateDate,
      acceptedFileType: restrictedFiles,
    };

    if (!updateDate) {
      message.error('Vui lòng chọn ngày phát giấy.');
      return;
    }

    setIsLoading(true);
    axios
      .put('http://localhost:8080/api/v1/configs', data, {
        headers: { Authorization: `Bearer ${profile?.jwtToken}` },
      })
      .then((response) => {
        console.log('Phản hồi từ server:', response.data);
        message.success('Cập nhật cấu hình thành công!');
      })
      .catch((error) => {
        logErrorDetails(error);
        message.error('Lỗi khi cập nhật cấu hình. Vui lòng kiểm tra lại!');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '900px',
        margin: 'auto',
        background: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>1. Chỉnh sửa số lượng giấy và ngày phát giấy:</h3>
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '15px',
              display: 'inline-block',
              width: '200px',
            }}
          >
            Số lượng giấy:
          </label>
          <Input
            type="number"
            value={paperAmount}
            onChange={(e) => setPaperAmount(Number(e.target.value))}
            style={{
              width: '250px',
              height: '40px',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '16px',
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '15px',
              display: 'inline-block',
              width: '200px',
            }}
          >
            Ngày phát giấy:
          </label>
          <DatePicker
            value={dayjs(updateDate)} // Hiển thị ngày hôm nay trên lịch
            onChange={(date) => setUpdateDate(date ? date.toISOString() : null)}
            style={{
              width: '250px',
              height: '40px',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '16px',
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>2. Cấu hình in cho sinh viên:</h3>
        <div>
          <label
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '15px',
              display: 'inline-block',
              width: '200px',
            }}
          >
            Các file được phép:
          </label>
          <Select
            mode="tags"
            style={{
              width: '450px',
              height: '40px',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '16px',
            }}
            value={restrictedFiles}
            onChange={(value) => setRestrictedFiles(value)}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          type="primary"
          onClick={handleUpdateConfig}
          loading={isLoading}
          style={{
            width: '200px',
            height: '45px',
            fontSize: '16px',
            borderRadius: '5px',
          }}
        >
          Lưu cấu hình
        </Button>
      </div>
    </div>
  );
};

export default PrinterManagement;

import React, { useState } from 'react';
import { Radio, Input, Table, Card, Select } from 'antd';

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
  const [searchType, setSearchType] = useState('student');
  const [mssv, setMssv] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

  // Dữ liệu lịch sử in
  const data: PrintHistory[] = [
    { key: '1', date: '2024-07-22', printerId: '001', document: 'File_A.docx', quantity: 10, mssv: '20210001' },
    { key: '2', date: '2024-07-23', printerId: '001', document: 'Paper_B.pdf', quantity: 15, mssv: '20210002' },
    { key: '3', date: '2024-07-24', printerId: '002', document: 'Thesis_C.docx', quantity: 20, mssv: '20210001' },
    { key: '4', date: '2024-07-25', printerId: '002', document: 'Project_D.pdf', quantity: 5, mssv: '20210003' },
    { key: '5', date: '2024-07-26', printerId: '003', document: 'Notes_E.docx', quantity: 12, mssv: '20210001' },
    { key: '6', date: '2024-07-27', printerId: '003', document: 'Report_F.pdf', quantity: 8, mssv: '20210002' },
  ];

  // Lọc dữ liệu dựa trên tìm kiếm
  const filteredData =
    searchType === 'student'
      ? data.filter((item) => item.mssv === mssv)
      : data.filter((item) => item.printerId === selectedPrinter);

  const columns = [
    { title: 'Ngày in', dataIndex: 'date', key: 'date' },
    { title: 'STT máy in', dataIndex: 'printerId', key: 'printerId' },
    { title: 'Tài liệu', dataIndex: 'document', key: 'document' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  ];

  return (
    <div style={{ background: '#e9ecef', padding: '20px', minHeight: '100vh' }}>
      {/* Khung tra cứu */}
      <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Lịch sử in ấn:</h3>
        <div>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Tra cứu trên:</span>
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
      {searchType === 'student' && (
        <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Dựa trên sinh viên:</h4>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>MSSV:</span>
            <Input
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              style={{
                width: '300px',
                borderRadius: '10px',
                background: '#e9ecef',
                border: 'none',
              }}
              placeholder="Nhập MSSV (VD: 20210001)"
            />
          </div>
        </Card>
      )}

      {searchType === 'printer' && (
        <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Dựa trên máy in:</h4>
          <Select
            placeholder="Chọn máy in"
            onChange={(value) => setSelectedPrinter(value)}
            style={{
              width: '300px',
              borderRadius: '10px',
              background: '#e9ecef',
            }}
          >
            <Option value="001">Máy in 001</Option>
            <Option value="002">Máy in 002</Option>
            <Option value="003">Máy in 003</Option>
          </Select>
        </Card>
      )}

      {/* Bảng lịch sử */}
      <Card style={{ borderRadius: '10px' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          style={{ borderRadius: '10px', overflow: 'hidden' }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Card>
    </div>
  );
};

export default PrintingHistory;

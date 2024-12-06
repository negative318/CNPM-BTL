import React, { useState } from "react";
import { Input, DatePicker } from "antd";

const PrinterManagement = () => {
  const [paperAmount, setPaperAmount] = useState(1);
  const [restrictedFiles, setRestrictedFiles] = useState("");

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "auto",
        background: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Section 1 */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "22px", marginBottom: "20px" }}>
          {" "}
          {/* Adjusted font size */}
          1. Chỉnh sửa số lượng giấy và ngày phát giấy:
        </h3>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px", // Adjusted font size
              marginRight: "15px",
              display: "inline-block",
              width: "200px", // Adjusted label width for better alignment
            }}
          >
            Số lượng giấy:
          </label>
          <Input
            type="number"
            value={paperAmount}
            onChange={(e) => setPaperAmount(Number(e.target.value))}
            style={{
              width: "250px", // Adjusted input width
              height: "40px",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "16px",
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px", // Adjusted font size
              marginRight: "15px",
              display: "inline-block",
              width: "200px", // Adjusted label width for better alignment
            }}
          >
            Ngày phát giấy:
          </label>
          <DatePicker
            style={{
              width: "250px", // Adjusted input width
              height: "40px",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "16px",
            }}
          />
        </div>
      </div>

      {/* Section 2 */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "22px", marginBottom: "20px" }}>
          {" "}
          {/* Adjusted font size */}
          2. Cấu hình in cho sinh viên:
        </h3>
        <div>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginRight: "15px",
              display: "inline-block",
              width: "200px",
            }}
          >
            Các file không được phép:
          </label>
          <Input
            value={restrictedFiles}
            onChange={(e) => setRestrictedFiles(e.target.value)}
            style={{
              width: "450px",
              height: "40px",
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "16px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrinterManagement;

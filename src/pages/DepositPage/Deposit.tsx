import { useState } from "react";

export default function Depositpage() {
  const [amount, setAmount] = useState<number>(10000); // Giá trị mặc định 10,000 VNĐ
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal

  // Hàm định dạng tiền
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddMoney = async () => {
    setLoading(true);
    setMessage(null); // Reset thông báo
    try {
      const url = `http://localhost:8080/api/v1/payments/add_wallet?amount=${amount}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || "Nạp tiền thành công!");
      setShowModal(true); // Hiển thị modal sau khi nạp thành công
    } catch (error) {
      setMessage("Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.");
      console.error("Error adding money:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload(); // Reload trang sau khi đóng modal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container px-4 py-10 mx-auto">
        <h1 className="mb-8 text-4xl font-bold tracking-wide text-center text-blue-600 uppercase">
          Nạp Tiền Vào Ví
        </h1>

        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl">
          <label className="block mb-4">
            <span className="text-lg font-medium text-gray-700">
              Số tiền cần nạp (VNĐ):
            </span>
            <input
              type="text"
              className="block w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formatCurrency(amount)} // Hiển thị định dạng tiền
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Xóa ký tự không phải số
                setAmount(Number(rawValue)); // Cập nhật giá trị thực tế
              }}
            />
          </label>

          <button
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddMoney}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Nạp tiền"}
          </button>

          {message && !showModal && (
            <p
              className={`mt-4 text-center ${
                message.includes("thành công")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Modal hiển thị thông báo thành công */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-center text-gray-700">
              {message}
            </h2>
            <button
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleModalClose}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

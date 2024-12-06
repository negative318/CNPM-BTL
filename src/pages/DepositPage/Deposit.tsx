import { useState } from "react";

export default function Depositpage() {
  const [amount, setAmount] = useState<number>(10000); // Giá trị mặc định 10,000 VNĐ
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    } catch (error) {
      setMessage("Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.");
      console.error("Error adding money:", error);
    } finally {
      setLoading(false);
    }
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
              type="number"
              className="block w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={10000}
              step={1000}
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

          {message && (
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
    </div>
  );
}

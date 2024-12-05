import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu
interface Transaction {
  payDate: string;
  numberOfPages: number;
  payCost: number;
  status: string;
}

export default function HistoryBuyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = "2024-12-03T00:00:00";
        const endDate = "2024-12-10T23:59:59";
        const url = `http://localhost:8080/api/v1/payments/history/student_buy_pages?pageNumber=0&pageSize=5&startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`;
        console.log(url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Gán dữ liệu từ API vào state
        setTransactions(data.studentPaymentDtoList || []);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container px-4 py-10 mx-auto">
        <h1 className="mb-8 text-4xl font-bold tracking-wide text-center text-blue-600 uppercase">
          Lịch Sử Mua Giấy
        </h1>

        <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <h2 className="py-4 text-2xl font-semibold text-center text-white bg-gradient-to-r from-blue-400 to-blue-600">
            Lịch sử giao dịch
          </h2>

          {loading ? (
            <p className="py-6 text-center text-blue-600">
              Đang tải dữ liệu...
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-blue-800 bg-blue-200">
                  <th className="px-6 py-3 border border-blue-300">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 border border-blue-300">Số trang</th>
                  <th className="px-6 py-3 border border-blue-300">
                    Thành tiền
                  </th>
                  <th className="px-6 py-3 border border-blue-300">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-3 border border-gray-300">
                      {new Date(transaction.payDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-3 border border-gray-300">
                      {transaction.numberOfPages}
                    </td>
                    <td className="px-6 py-3 border border-gray-300">
                      {transaction.payCost.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td
                      className={`px-6 py-3 border border-gray-300 font-semibold ${
                        transaction.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.status === "COMPLETED"
                        ? "Thành công"
                        : "Thất bại"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

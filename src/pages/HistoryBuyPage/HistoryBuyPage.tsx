
export default function HistoryBuyPage() {
  const transactions = [
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thành công" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "800.000 VNĐ", status: "Thất bại" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thành công" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thành công" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thành công" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thành công" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thất bại" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thất bại" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thất bại" },
    { time: "12:00 30/02/2024", pages: 1000, amount: "80.000 VNĐ", status: "Thất bại" },
  ];

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
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-blue-800 bg-blue-200">
                <th className="px-6 py-3 border border-blue-300">Thời gian</th>
                <th className="px-6 py-3 border border-blue-300">Số trang</th>
                <th className="px-6 py-3 border border-blue-300">Thành tiền</th>
                <th className="px-6 py-3 border border-blue-300">Trạng thái</th>
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
                  <td className="px-6 py-3 border border-gray-300">{transaction.time}</td>
                  <td className="px-6 py-3 border border-gray-300">{transaction.pages}</td>
                  <td className="px-6 py-3 border border-gray-300">{transaction.amount}</td>
                  <td
                    className={`px-6 py-3 border border-gray-300 font-semibold ${
                      transaction.status === "Thành công"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/app.context";
import mainPath from "../../constants/path";

export default function BuyPage() {
  const calculatePrice = (pages: number): number => {
    if (pages <= 50) return pages * 600;
    if (pages <= 200) return pages * 570;
    if (pages <= 500) return pages * 550;
    return pages * 500;
  };

  const [pages, setPages] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPages(value);
    setPrice(calculatePrice(value));
  };
  const { profile } = useContext(AppContext);
  const handleConfirm = async () => {
    const requestBody = {
      numOfPages: pages,
      pageType: "A4",
    };

    try {
      console.log(profile?.jwtToken);
      console.log(requestBody);
      const response = await fetch(
        "http://localhost:8080/api/v1/payments/buy_pages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${profile?.jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      const result = await response.json();
      console.log(response);
      if (result.message == "Not enough money!") {
        alert(result.message || "Số dư không đủ, vui lòng nạp tiền!");
        window.location.href = mainPath.depositpage;
      } else {
        alert(result.message || "Thanh toán thành công!");
        window.location.href = mainPath.historyBuyPage;
      }
    } catch (error) {
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-full bg-gray-100">
      <div className="container py-10 mx-auto">
        <h1 className="mb-10 text-3xl font-bold text-center text-blue-700 uppercase">
          Mua Giấy
        </h1>

        {/* Bảng giá */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-center">Bảng giá</h2>
          <table className="w-full max-w-3xl mx-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 border border-gray-300">Số thứ tự</th>
                <th className="px-4 py-2 border border-gray-300">Số giấy</th>
                <th className="px-4 py-2 border border-gray-300">Giá/trang</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-center border border-gray-300">
                  1
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  0 - 50
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  600 VNĐ
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center border border-gray-300">
                  2
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  51 - 200
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  570 VNĐ
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center border border-gray-300">
                  3
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  201 - 500
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  550 VNĐ
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-center border border-gray-300">
                  4
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  501 trở lên
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  500 VNĐ
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Thanh toán */}
        <div className="w-full max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-center">Thanh toán</h2>
          <div className="space-y-4">
            {/* Nhập số trang */}
            <div>
              <label
                htmlFor="pages"
                className="block mb-2 font-medium text-gray-700"
              >
                1. Nhập số trang:
              </label>
              <input
                id="pages"
                type="number"
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Nhập số trang"
                value={pages}
                onChange={handlePageChange}
              />
            </div>

            {/* Giá tiền */}
            <div>
              <label
                htmlFor="price"
                className="block mb-2 font-medium text-gray-700"
              >
                2. Giá tiền:
              </label>
              <input
                id="price"
                type="text"
                className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none"
                value={`${price.toLocaleString()} VNĐ`}
                readOnly
              />
            </div>

            {/* Phương thức thanh toán */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                3. Phương thức thanh toán:
              </label>
              <div className="flex items-center space-x-4">
                <input type="radio" id="bkpay" name="payment" defaultChecked />
                <label htmlFor="bkpay" className="text-gray-700">
                  BK Pay
                </label>
              </div>
            </div>

            {/* Nút xác nhận */}
            <button
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
              onClick={handleConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

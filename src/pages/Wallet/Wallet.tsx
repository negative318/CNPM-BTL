import { Link, NavLink } from "react-router-dom";
import mainPath from "../../constants/path";



export default function Wallet() {
  return (
    <div className="container flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center p-10 bg-white rounded-lg shadow-lg w-96">
          {/* Logo */}
          <img src="/public/images/wallet.jpg" alt="Logo" className="h-16 mb-4" />

          {/* Balance Display */}
          <div className="flex justify-around w-full mb-6">
            <div className="text-center">
              <div className="text-lg font-bold">Paper</div>
              <div className="text-xl font-semibold">10 Sheets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Purchased Paper</div>
              <div className="text-xl font-semibold">10 Sheets</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full mb-6 space-y-4">
  
              <Link to={mainPath.buypage} className="flex items-center justify-center flex-grow w-full px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700">
                Buy Page
              </Link>
            
              <Link to={mainPath.historyBuyPage} className="flex items-center justify-center flex-grow w-full px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700">
                History
              </Link>
          </div>

          {/* Priority Text */}
          <div className="mb-4 text-sm text-center text-gray-500">
            Priority when paying online
          </div>
          <div className="mb-4 text-sm text-center text-gray-500">
            We will use the paper type you choose when calculating your printing costs.
          </div>

          {/* Change Paper Type */}
          <div className="flex flex-col w-full space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>Paper</div>
              <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg">Priority</button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>Purchased Paper</div>
              <button className="px-4 py-2 text-sm text-gray-500 bg-gray-300 rounded-lg" disabled>
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

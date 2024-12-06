import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import mainPath from "../../constants/path";

export default function Wallet() {
  const [numPages, setNumPages] = useState(0); // For remaining and purchased pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/payments/student/num_pages",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const { studentNumRemained } = response.data;
        setNumPages(studentNumRemained);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center p-10 bg-white rounded-lg shadow-lg w-96">
          {/* Logo */}
          <img
            src="/public/images/wallet.jpg"
            alt="Logo"
            className="h-16 mb-4"
          />

          {/* Balance Display */}
          <div className="w-full mb-6 text-center">
            <div className="text-lg font-bold">Paper</div>
            <div className="text-xl font-semibold">{numPages} Sheets</div>
          </div>

          {/* Buttons */}
          <div className="w-full mb-6 space-y-4">
            <Link
              to={mainPath.buypage}
              className="flex items-center justify-center flex-grow w-full px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Buy Page
            </Link>
            <Link
              to={mainPath.historyBuyPage}
              className="flex items-center justify-center flex-grow w-full px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              History
            </Link>
          </div>

          {/* Priority Text */}
          <div className="mb-4 text-sm text-center text-gray-500">
            Priority when paying online
          </div>
          <div className="mb-4 text-sm text-center text-gray-500">
            We will use the paper type you choose when calculating your printing
            costs.
          </div>
        </div>
      </div>
    </div>
  );
}

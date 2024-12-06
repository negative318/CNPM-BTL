import { useState, useEffect, useContext } from "react";
import mainPath from "../../constants/path";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppContext } from "../../contexts/app.context";
import {
  faUser,
  faSignOutAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export default function MainHeader() {
  const { isAuthenticated, profile, handleLogout } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  // State để lưu số lượng tờ từ API
  const [paperCount, setPaperCount] = useState(null);

  // State để lưu số tiền từ API
  const [walletBalance, setWalletBalance] = useState(null);

  // Role logic
  const isSPSO = profile?.role === 2;
  const isStudent = profile?.role === 3;
  const isAdmin = profile?.role === 1;

  useEffect(() => {
    if (isStudent) {
      const fetchPaperCount = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/v1/payments/student/num_pages",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setPaperCount(data.studentNumRemained);
          } else {
            console.error("Failed to fetch paper count:", data.message);
          }
        } catch (error) {
          console.error("Error fetching paper count:", error);
        }
      };

      const fetchWalletBalance = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/v1/payments/get_wallet",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setWalletBalance(data.studentWallet);
          } else {
            console.error("Failed to fetch wallet balance:", data.message);
          }
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      };

      fetchPaperCount();
      fetchWalletBalance();
    }
  }, [isStudent]);

  const titleClassname =
    "text-lightText uppercase justify-center rounded-lg col-span-1 relative flex items-center font-medium px-6 hover:bg-hoveringBg";

  const SPSOHeader = (
    <>
      <NavLink
        to={mainPath.modifyPrinter}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        Cấu hình máy
      </NavLink>
      <NavLink
        to={mainPath.printerManagement}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        Cấu hình in
      </NavLink>
      <NavLink
        to={mainPath.printingHistory}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        Report của máy
      </NavLink>
      <NavLink
        to={mainPath.spsoreport}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        Report hàng tháng/năm
      </NavLink>
    </>
  );

  const studentHeader = (
    <>
      <NavLink
        to={mainPath.printing}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        PRINT
      </NavLink>
      <NavLink
        to={mainPath.historyprintpage}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        HISTORY PRINT
      </NavLink>
      <NavLink
        to={mainPath.wallet}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        WALLET
      </NavLink>
      <NavLink
        to={mainPath.help}
        className={({ isActive }) =>
          classNames(titleClassname, {
            "bg-hoveringBg": isActive,
          })
        }
      >
        NEED HELP?
      </NavLink>
    </>
  );

  const adminHeader = (
    <NavLink
      to={mainPath.adminreportpage}
      className={({ isActive }) =>
        classNames(titleClassname, {
          "bg-hoveringBg": isActive,
        })
      }
    >
      Report
    </NavLink>
  );

  return (
    <div
      className="items-center justify-center w-full h-full bg-webColor500 text-lightText"
      style={{ minHeight: "inherit" }}
    >
      <div className="container flex justify-between w-full h-full">
        <div className="flex justify-start py-2 space-x-2">
          <img
            className="h-12 rounded"
            src="\images\HCMCUT_logo.png"
            alt="logo"
          />
          <Link
            to={mainPath.home}
            className="flex items-center text-lg font-bold uppercase desktop:text-2xl"
          >
            CNPM
          </Link>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-4">
            <NavLink
              to={mainPath.home}
              className={({ isActive }) =>
                classNames(titleClassname, {
                  "bg-hoveringBg": isActive,
                })
              }
            >
              TRANG CHỦ
            </NavLink>

            {isSPSO && SPSOHeader}

            {isStudent && studentHeader}

            {isStudent && (
              <div className="flex items-center px-4 space-x-4 border-l border-gray-300">
                {paperCount !== null && (
                  <div className="flex items-center justify-center px-3 py-1 font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-blue-500 to-green-400">
                    <span>{paperCount} tờ</span>
                  </div>
                )}
                {walletBalance !== null && (
                  <Link
                    to={mainPath.depositpage}
                    className="flex items-center justify-center px-3 py-1 font-semibold text-white rounded-full shadow-md cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 hover:bg-orange-600"
                  >
                    <span>{walletBalance} VNĐ</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-end">
          {!isAuthenticated ? (
            <NavLink
              to={mainPath.login}
              className="bg-red-500 text-black flex h-[42px] rounded-full items-center justify-center space-x-2 px-6 pb-1 hover:bg-red-600 desktop:text-lg"
            >
              <FontAwesomeIcon icon={faUser} />
              <p className="mt-1 font-semibold uppercase">Đăng nhập</p>
            </NavLink>
          ) : (
            <div className="relative">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-lightText text-webColor500 hover:bg-gray-200"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 w-48 bg-white rounded-lg shadow-md top-12">
                  <ul>
                    <li>
                      <NavLink
                        to={mainPath.info}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Thông tin cá nhân
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useContext, useState } from "react"
import mainPath from "../../constants/path"
import { Link, NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AppContext } from "../../contexts/app.context"
import { faUser, faSignOutAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"

export default function MainHeader() {
  const { isAuthenticated, profile, handleLogout } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false)

  const menus = [
    {
      name: "TRANG CHỦ",
      path: mainPath.home,
    },
  ]

  const isAdmin = profile?.role == 2

  const titleClassname =
    "text-lightText uppercase justify-center rounded-lg col-span-1 relative flex items-center font-medium px-6 hover:bg-hoveringBg"

  return (
    <div
      className="items-center justify-center w-full h-full bg-webColor500 text-lightText"
      style={{ minHeight: "inherit" }}
    >
      <div className="container flex justify-between w-full h-full">
        <div className="flex justify-start py-2 space-x-2">
          <img className="h-12 rounded" src="\images\HCMCUT_logo.png" alt="logo" />
          <Link to={mainPath.home} className="flex items-center text-lg font-bold uppercase desktop:text-2xl">
          CNPM
        </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="grid grid-cols-4 shrink-0 h-[70%] gap-2">
            {menus.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.path}
                className={({ isActive }) =>
                  classNames(titleClassname, {
                    "bg-hoveringBg": isActive,
                  })
                }
              >
                {menu.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <NavLink
                to={mainPath.printing}
                className={({ isActive }) =>
                  classNames(titleClassname, {
                    "bg-hoveringBg": isActive,
                  })
                }
              >
                PRINTING
              </NavLink>
            )}

            {isAuthenticated && !isAdmin && (
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
            )}

            {isAuthenticated && !isAdmin && (
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
  )
}

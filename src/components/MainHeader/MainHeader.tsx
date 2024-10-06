import { useContext } from "react"
import mainPath from "../../constants/path"
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from "../../contexts/app.context"
import { faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames"

export default function MainHeader() {
    const { isAuthenticated, profile } = useContext(AppContext)
  
    const menus = [
      {
        name: 'TRANG CHỦ',
        path: mainPath.home
      }
    ]
  
    const isAdmin = profile?.role == 2
  
    //! Style
    const titleClassname =
      'text-lightText uppercase justify-center rounded-lg col-span-1 relative flex items-center font-medium px-6 hover:bg-hoveringBg'
  
    return (
      <div
        className='flex items-center justify-center w-full h-full bg-webColor700 text-lightText'
        style={{ minHeight: 'inherit' }}
      >
        <div className='container flex justify-between w-full h-full'>
          <div className='flex justify-start py-2 space-x-2 '>
            <img className='h-12 rounded bg-slate-50' src='\images\HCMCUT_logo.png' alt='logo' />
            <div className='flex items-center text-lg font-bold uppercase desktop:text-2xl'>CNPM</div>
          </div>
  
          <div className='flex items-center justify-center'>
            <div className='grid grid-cols-4 shrink-0 h-[70%] gap-2'>
              {menus.map((menu, index) => (
                <NavLink
                  key={index}
                  to={menu.path}
                  className={({ isActive }) =>
                    classNames(titleClassname, {
                      'bg-hoveringBg': isActive
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
                      'bg-hoveringBg': isActive
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
                      'bg-hoveringBg': isActive
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
                      'bg-hoveringBg': isActive
                    })
                  }
                >
                  NEED HELP?
                </NavLink>
              )}
  
              {/* {isAdmin && (
                <NavLink
                  to={adminPath.mainPage}
                  className={({ isActive }) =>
                    classNames(titleClassname, {
                      'bg-hoveringBg': isActive
                    })
                  }
                >
                  Quản lí
                </NavLink>
              )} */}
            </div>
          </div>
  
          <div className='flex items-center justify-end '>
          {isAuthenticated && (
  <div className="flex space-x-4">
    {/* Nút Đăng nhập */}
    <NavLink
  to={mainPath.login}
  className='bg-red-500 text-black flex h-[42px] rounded-full items-center justify-center space-x-2 px-6 pb-1 hover:bg-red-600 desktop:text-lg'
>
  <FontAwesomeIcon icon={faUser} />
  <p className='mt-1 font-semibold uppercase'>Đăng nhập</p>
</NavLink>
  </div>
)}
            {/* {isAuthenticated && <PersonalPopover />} */}
          </div>
        </div>
      </div>
    )
  }
  
import { Link } from "react-router-dom"
import mainPath from "../../constants/path"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons"
import MainFooter from "../../components/MainFooter"

export default function LoginPage() {
  
  return (
    <div className='flex flex-col justify-between h-full min-h-full shrink-0' style={{ minHeight: 'inherit' }}>
      <div className=''>
        <div className='w-full bg-webColor700'>
          <div className='container'>
            <div className='flex justify-start w-full'>
              <Link to={mainPath.home} className='flex px-6 py-4 space-x-2 text-lightText hover:bg-hoveringBg shrink'>
                <FontAwesomeIcon icon={faCaretLeft} />
                <p className='font-semibold uppercase'>Trang chủ</p>
              </Link>
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='flex items-start justify-center py-10'>
            <div className='w-10/12 tablet:w-8/12 desktop:w-6/12'>
            <div></div>
              <form
                className='p-5 duration-200 shadow-lg md:p-10 rounded-xl bg-webColor100'
                // onSubmit={onSubmit}
                noValidate
              >
                <div className='text-2xl font-semibold text-center uppercase text-primaryText'>Đăng nhập</div>

                {/* <AccountInput
                  name='username'
                  register={register}
                  type='text'
                  className='mt-8 autofill:text-darkText autofill:dark:text-lightText'
                  errorMessage={errors.username?.message}
                  labelName='Tài khoản'
                  required
                  autoComplete='on'
                  svgData={
                    <>
                      <path d='M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z' />
                      <path d='M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z' />
                    </>
                  }
                /> */}

                {/* <AccountInput
                  name='password'
                  register={register}
                  type='password'
                  className='mt-3'
                  errorMessage={errors.password?.message}
                  labelName='Mật khẩu'
                  required
                  isPasswordInput
                  svgData={
                    <path
                      fillRule='evenodd'
                      d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z'
                      clipRule='evenodd'
                    />
                  }
                /> */}

                <div className='mt-2 text-base lg:text-lg'>
                  {/* <button
                    className='flex items-center justify-center w-full py-2 uppercase lg:py-3'
                    type='submit'
                    isLoading={loginAccountMutation.isPending}
                    disabled={loginAccountMutation.isPending}
                  >
                    Đăng nhập
                  </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  )
}
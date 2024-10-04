import MainFooter from "../../components/MainFooter"
import MainHeader from "../../components/MainHeader"

interface Props {
    children?: React.ReactNode
}

export default function MainLayout({children}: Props) {
  return (
      <div className='flex flex-col min-h-screen bg-mainBg'>
          <div className='fixed z-[9999] h-12 desktop:h-16 w-full'>
              <MainHeader />
          </div>
          <div className='flex-grow pt-12 desktop:pt-16'>
              {children}
          </div>
          <div className=''>
              <MainFooter />
          </div>
      </div>
  );
}
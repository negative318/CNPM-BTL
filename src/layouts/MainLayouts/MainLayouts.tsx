import MainFooter from "../../components/MainFooter"
import MainHeader from "../../components/MainHeader"

interface Props {
    children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
      <div className='flex flex-col justify-between h-full min-h-full bg-mainBg shrink-0' style={{minHeight: 'inherit'}}>
        <div className='fixed z-[9999] h-12 desktop:h-16 w-full'>
          <MainHeader />
        </div>
        <div className='pt-12 desktop:pt-16 '>{children}</div>
        <div className=''>
          <MainFooter />
        </div>
      </div>
    )
  }
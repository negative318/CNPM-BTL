import { Component, ErrorInfo, ReactNode } from 'react'
import mainPath from '../../constants/path'
interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    //? Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    //? You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      //? You can render any custom fallback UI
      return (
        <main className='flex flex-col items-center justify-center w-full h-screen bg-lightBg dark:bg-darkBg'>
          <h1 className='font-black tracking-widest text-9xl text-darkText'>500</h1>
          <div className='absolute px-2 text-sm rounded rotate-12 bg-webColor400'>Something went wrong</div>
          <button className='mt-5'>
            <a
              href={mainPath.home}
              className='relative inline-block text-sm font-medium group text-primaryBlue focus:outline-none focus:ring active:text-primaryBlue'
            >
              <span className='relative block px-8 py-3 text-white border border-current rounded-md bg-unhoverBg hover:bg-hoveringBg'>
                <span>Go Home</span>
              </span>
            </a>
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

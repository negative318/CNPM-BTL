import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>  
        </QueryClientProvider>
      </ScrollToTop>
    </BrowserRouter>
  </React.StrictMode>
)

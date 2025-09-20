import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { SesionProvider } from "./context/sesion";
import './index.css'
import App from './App.tsx'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      refetchInterval: 60000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools/> */}
        </QueryClientProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)

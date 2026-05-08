import '@/index.css';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import App from '@/App';

const queryClient = new QueryClient();

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return;

  const { worker } = await import('@/mocks/browser');

  await worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
          />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});

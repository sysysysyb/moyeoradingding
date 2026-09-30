import '@/index.css';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { API_BASE_URL } from '@/api/config';
import App from '@/App';

const queryClient = new QueryClient();

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === 'false') return;

  const { worker } = await import('@/mocks/browser');

  const apiUrl = new URL(API_BASE_URL, window.location.origin);

  await worker.start({
    onUnhandledRequest(request, print) {
      const requestUrl = new URL(request.url);
      const isApiRequest =
        requestUrl.origin === apiUrl.origin &&
        (requestUrl.pathname === apiUrl.pathname ||
          requestUrl.pathname.startsWith(`${apiUrl.pathname}/`));

      if (isApiRequest) print.error();
    },
  });
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

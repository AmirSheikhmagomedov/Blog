import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './redux/store';
import { DarkThemeProvider } from './context/DarkThemeProvider';
import App from './App';
import './main.scss';
import ErrorPage from './pages/ErrorPage/ErrorPage';

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <DarkThemeProvider>
      <Provider store={store}>
        <ErrorBoundary fallback={<ErrorPage />}>
          <App />
        </ErrorBoundary>
      </Provider>
    </DarkThemeProvider>
  </BrowserRouter>
);

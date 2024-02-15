import { useContext, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Spinner } from 'react-bootstrap';
import Layout from './components/Layout/Layout';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DarkThemeContext } from './context/DarkThemeProvider';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { getMe } from './redux/features/userSlice';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const EditPage = lazy(() => import('./pages/EditPage/EditPage'));
const WritePage = lazy(() => import('./pages/WritePage/WritePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage/ArticlePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage/SearchPage'));
const EditProfilePage = lazy(
  () => import('./pages/EditProfilePage/EditProfilePage')
);

export default function App() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Blog App</title>
      </Helmet>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div style={{ textAlign: 'center' }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              }
            >
              <Layout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <MainPage />
              </Suspense>
            }
          />
          <Route
            path="/write"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <WritePage />
              </Suspense>
            }
          />
          <Route
            path="/article/:articleId"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <ArticlePage />
              </Suspense>
            }
          />
          <Route
            path="/article/:articleId/edit"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <EditPage />
              </Suspense>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <CategoryPage />
              </Suspense>
            }
          />
          <Route
            path="/profile/:profileName"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path="/profile/:profileName/edit"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <EditProfilePage />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <SearchPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense
                fallback={
                  <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={!!true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkTheme ? 'dark' : 'light'}
      />
    </>
  );
}

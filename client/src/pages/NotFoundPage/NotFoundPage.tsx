import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page was not found</title>
      </Helmet>
      <div className={styles['notfound-page']}>
        <div className={styles['notfound-page__container']}>
          <p
            style={{
              fontSize: '128px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            404
          </p>
          <p
            style={{
              fontSize: '48px',
              display: 'inline-block',
              marginBottom: '48px',
              textAlign: 'center',
            }}
          >
            Page was not found
          </p>
          <button
            className={
              isDarkTheme
                ? styles['notfound-page__button-dark']
                : styles['notfound-page__button']
            }
            type="button"
            onClick={() => {
              navigate('/');
            }}
          >
            Go to main page
          </button>
        </div>
      </div>
    </>
  );
}

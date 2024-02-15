import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './ErrorPage.module.scss';

export default function ErrorPage() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Something went wrong</title>
      </Helmet>
      <div className={styles['error-page']}>
        <div className={styles['error-page__container']}>
          <div
            style={{
              fontSize: '128px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 50C0 77.6154 22.3846 100 50 100C77.6154 100 100 77.6154 100 50C100 22.3846 77.6154 0 50 0C22.3846 0 0 22.3846 0 50ZM95.0006 50C95.0006 74.8532 74.8532 95.0006 50 95.0006C25.1468 95.0006 4.99936 74.8532 4.99936 50C4.99936 25.1468 25.1468 4.99936 50 4.99936C74.8532 4.99936 95.0006 25.1468 95.0006 50ZM53.5358 50L69.2684 34.2673C70.2444 33.2913 70.2444 31.7085 69.2684 30.7316C68.2916 29.7556 66.7087 29.7556 65.7318 30.7316L50 46.4642L34.2673 30.7316C33.2913 29.7556 31.7085 29.7556 30.7316 30.7316C29.7556 31.7084 29.7556 33.2913 30.7316 34.2673L46.4642 50L30.7316 65.7318C29.7556 66.7087 29.7556 68.2915 30.7316 69.2684C31.7084 70.2444 33.2913 70.2444 34.2673 69.2684L50 53.5358L65.7318 69.2684C66.7087 70.2444 68.2915 70.2444 69.2684 69.2684C70.2444 68.2916 70.2444 66.7087 69.2684 65.7318L53.5358 50Z"
                fill={isDarkTheme ? '#FFFFFF' : '#292929'}
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: '48px',
              display: 'inline-block',
              marginBottom: '48px',
              textAlign: 'center',
            }}
          >
            Something went wrong
          </p>
          <button
            className={
              isDarkTheme
                ? styles['error-page__button-dark']
                : styles['error-page__button']
            }
            type="button"
            onClick={() => {
              navigate('/');
              navigate(0);
            }}
          >
            Go to main page
          </button>
        </div>
      </div>
    </>
  );
}

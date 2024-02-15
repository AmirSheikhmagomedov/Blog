import { useContext } from 'react';
import { toast } from 'react-toastify';
import styles from './ArticleNav.module.scss';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import { useAppSelector } from '../../hooks/reduxHooks';
import { checkAuth } from '../../redux/features/userSlice';

export default function ArticleNav({
  activeTab,
  onChange,
}: {
  activeTab: number;
  onChange: (number: number) => void;
}) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const isAuth = useAppSelector(checkAuth);

  return (
    <div
      className={
        isDarkTheme ? styles['article-nav-dark'] : styles['article-nav']
      }
    >
      <button
        type="button"
        className={
          isDarkTheme
            ? activeTab === 0
              ? styles['button-dark-active']
              : styles['button-dark']
            : activeTab === 0
            ? styles['button-active']
            : styles['button']
        }
        onClick={() => {
          onChange(0);
        }}
      >
        All articles
      </button>
      <button
        type="button"
        className={
          isDarkTheme
            ? activeTab === 1
              ? styles['button-dark-active']
              : isAuth
              ? styles['button-dark']
              : styles['button-disabled-dark']
            : activeTab === 1
            ? styles['button-active']
            : isAuth
            ? styles['button']
            : styles['button-disabled']
        }
        onClick={() => {
          if (!isAuth) {
            toast.warning('You need to sign in first', {
              toastId: '1',
            });
            return;
          }
          onChange(1);
        }}
      >
        Following
        {isAuth ? null : (
          <svg
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.33993 5.21465V3.39627C7.33993 2.7521 7.07746 2.16761 6.65486 1.74489L6.65141 1.74144C6.22881 1.31884 5.6442 1.05637 5.00003 1.05637C4.35754 1.05637 3.77305 1.3205 3.34865 1.74488C2.92429 2.16748 2.66015 2.75209 2.66015 3.39626V5.21464L7.33993 5.21465ZM0.884553 5.21465H1.60373V3.39627C1.60373 2.46407 1.98723 1.61543 2.60237 1.00029V0.998631C3.21586 0.383464 4.06626 0 5.00013 0C5.93233 0 6.78097 0.383494 7.3961 0.998631L7.39777 1.00029C8.01293 1.61546 8.3964 2.46419 8.3964 3.39627V5.21465H9.11725C9.60296 5.21465 10 5.61169 10 6.09904V12.4077C10 12.8935 9.60296 13.2921 9.11725 13.2921H0.884392C0.397005 13.2921 0 12.8933 0 12.4077V6.09904C0 5.61166 0.397036 5.21465 0.884392 5.21465H0.884553Z"
              fill={isDarkTheme ? '#9b9b9b' : '#757575'}
            />
          </svg>
        )}
      </button>
      <button
        type="button"
        className={
          isDarkTheme
            ? activeTab === 2
              ? styles['button-dark-active']
              : isAuth
              ? styles['button-dark']
              : styles['button-disabled-dark']
            : activeTab === 2
            ? styles['button-active']
            : isAuth
            ? styles['button']
            : styles['button-disabled']
        }
        onClick={() => {
          if (!isAuth) {
            toast.warning('You need to sign in first', {
              toastId: '1',
            });
            return;
          }
          onChange(2);
        }}
      >
        My articles
        {isAuth ? null : (
          <svg
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.33993 5.21465V3.39627C7.33993 2.7521 7.07746 2.16761 6.65486 1.74489L6.65141 1.74144C6.22881 1.31884 5.6442 1.05637 5.00003 1.05637C4.35754 1.05637 3.77305 1.3205 3.34865 1.74488C2.92429 2.16748 2.66015 2.75209 2.66015 3.39626V5.21464L7.33993 5.21465ZM0.884553 5.21465H1.60373V3.39627C1.60373 2.46407 1.98723 1.61543 2.60237 1.00029V0.998631C3.21586 0.383464 4.06626 0 5.00013 0C5.93233 0 6.78097 0.383494 7.3961 0.998631L7.39777 1.00029C8.01293 1.61546 8.3964 2.46419 8.3964 3.39627V5.21465H9.11725C9.60296 5.21465 10 5.61169 10 6.09904V12.4077C10 12.8935 9.60296 13.2921 9.11725 13.2921H0.884392C0.397005 13.2921 0 12.8933 0 12.4077V6.09904C0 5.61166 0.397036 5.21465 0.884392 5.21465H0.884553Z"
              fill={isDarkTheme ? '#9b9b9b' : '#757575'}
            />
          </svg>
        )}
      </button>
    </div>
  );
}

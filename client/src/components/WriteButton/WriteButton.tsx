import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './WriteButton.module.scss';

export default function WriteButton() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <Link
      className={
        isDarkTheme ? styles['write-button-dark'] : styles['write-button']
      }
      to="/write"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3.45655C16.0004 2.91008 15.7819 2.38616 15.3934 2.00151L13.9954 0.6041C13.6091 0.217403 13.0849 0 12.5383 0C11.9916 0 11.4672 0.217403 11.081 0.6041L1.77409 9.91323L1.32833 10.3618L1.2343 10.765L0 16L5.23729 14.7692L5.6406 14.6722L6.08636 14.2267L15.3964 4.92376C15.7869 4.53564 16.0044 4.00681 16 3.45655ZM1.32839 14.6723L2.05623 11.5773L4.42476 13.9448L1.32839 14.6723ZM5.392 13.5295L2.47172 10.6105L9.28321 3.79879L12.2037 6.71802L5.392 13.5295ZM14.6994 4.22657L12.9012 6.02407L9.98068 3.10484L11.7789 1.30735C11.9834 1.11309 12.255 1.0049 12.537 1.0049C12.8193 1.0049 13.0906 1.11309 13.2953 1.30735L14.6934 2.70476V2.70496C14.8934 2.90633 15.0055 3.17875 15.0055 3.46273C15.0055 3.74651 14.8934 4.01892 14.6934 4.22049L14.6994 4.22657Z"
          fill={isDarkTheme ? '#ffffff' : '#292929'}
        />
      </svg>
      Write
    </Link>
  );
}

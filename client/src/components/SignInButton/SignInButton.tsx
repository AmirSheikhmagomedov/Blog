import { useContext } from 'react';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './SignInButton.module.scss';

export default function SignInButton({ onClick }: { onClick: () => void }) {
  const { isDarkTheme } = useContext(DarkThemeContext);
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isDarkTheme ? styles['signin-button-dark'] : styles['signin-button']
      }
    >
      Sign in
    </button>
  );
}

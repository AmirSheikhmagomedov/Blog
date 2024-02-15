import { useContext } from 'react';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './SignUpButton.module.scss';

export default function SignUpButton({ onClick }: { onClick: () => void }) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <button
      type="button"
      className={
        isDarkTheme ? styles['signup-button-dark'] : styles['signup-button']
      }
      onClick={onClick}
    >
      Sign up
    </button>
  );
}

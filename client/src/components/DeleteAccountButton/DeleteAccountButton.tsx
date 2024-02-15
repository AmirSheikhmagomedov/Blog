import { useContext } from 'react';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './DeleteAccountButton.module.scss';

export default function DeleteAccountButton({
  onDelete,
}: {
  onDelete: () => void;
}) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <button
      className={styles[isDarkTheme ? 'delete-button-dark' : 'delete-button']}
      type="button"
			onClick={onDelete}
    >
      Delete account
    </button>
  );
}

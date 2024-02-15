import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DarkThemeContext } from '../../context/DarkThemeProvider';

import styles from './MobileSearch.module.scss';

export default function MobileSearch({ onSubmit }: { onSubmit: () => void }) {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const { isDarkTheme } = useContext(DarkThemeContext);

  const isAutoFocusOn = true;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={styles['mobile-search']}
    >
      <input
        className={
          isDarkTheme
            ? styles['mobile-search__input-dark']
            : styles['mobile-search__input']
        }
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        autoFocus={isAutoFocusOn}
        name="search"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/search?query=${searchValue}`);
            onSubmit();
          }
        }}
        maxLength={70}
        placeholder="Search"
        enterKeyHint="search"
      />
    </form>
  );
}

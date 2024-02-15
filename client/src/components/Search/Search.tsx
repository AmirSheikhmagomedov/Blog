import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './Search.module.scss';

export default function Search() {
  const { isDarkTheme } = useContext(DarkThemeContext);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  return (
    <div className={styles['search']}>
      <input
        className={
          isDarkTheme ? styles['search__input-dark'] : styles['search__input']
        }
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        placeholder="Search"
				onKeyDown={(e) => {
					if(e.key === 'Enter') navigate(`search?query=${searchValue}`);
				}}
        maxLength={75}
      />
      <button
        className={
          isDarkTheme ? styles['search__button-dark'] : styles['search__button']
        }
        onClick={() => {
          navigate(`search?query=${searchValue}`);
        }}
        type="button"
        disabled={!searchValue}
      >
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.6667 17.5395L14.2228 14.0957C15.507 12.6558 16.3048 10.7491 16.3048 8.66722C16.3048 4.1727 12.6469 0.514828 8.15239 0.514828C3.65787 0.514828 0 4.1727 0 8.66722C0 13.1617 3.65787 16.8196 8.15239 16.8196C9.74791 16.8196 11.2266 16.3526 12.4718 15.5744L16.0518 19.1544C16.2659 19.3685 16.5577 19.4852 16.8496 19.4852C17.1414 19.4852 17.4333 19.3684 17.6474 19.1544C18.1143 18.7069 18.1143 17.9869 17.6668 17.5395L17.6667 17.5395ZM2.27641 8.66725C2.27641 5.43739 4.90314 2.79131 8.15235 2.79131C11.4016 2.79131 14.0088 5.43743 14.0088 8.66725C14.0088 11.8971 11.3821 14.5432 8.15235 14.5432C4.9226 14.5432 2.27641 11.9165 2.27641 8.66725Z"
            fill={isDarkTheme ? '#ffffff' : '#292929'}
          />
        </svg>
      </button>
    </div>
  );
}

import { useContext, useState } from 'react';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import profileImage from '../../assets/profile.jpg';
import styles from './Profile.module.scss';
import PopupMenu from '../PopupMenu/PopupMenu';
import { useAppSelector } from '../../hooks/reduxHooks';
import { checkAuth } from '../../redux/features/userSlice';

export default function Profile() {
  const { isDarkTheme } = useContext(DarkThemeContext);
  const [isPopupMenuOpened, setIsPopupMenuOpened] = useState(false);

  const user = useAppSelector((state) => state.user.user);

  const handleClick = () => {
    setIsPopupMenuOpened(!isPopupMenuOpened);
  };

  const isAuth = useAppSelector(checkAuth);

  return (
    <div className={styles['profile']}>
      <div
        className={styles['profile__visible-content']}
        onClick={handleClick}
        onKeyDown={handleClick}
        role="button"
        tabIndex={-1}
      >
        <div
          className={styles['profile__image']}
          style={{
            border: isDarkTheme
              ? user?.avatar
                ? ''
                : '1px solid #7a7a7a'
              : user?.avatar
              ? ''
              : '1px solid #dcdcdc',
          }}
        >
          <img
            src={
              isAuth && user?.avatar
                ? `${import.meta.env.VITE_REACT_BACKEND_ASSETS}${user.avatar}`
                : profileImage
            }
            style={{
              filter: isDarkTheme && !user?.avatar ? 'invert(0.8)' : '',
            }}
            alt="Avatar"
            crossOrigin="anonymous"
          />
        </div>
        <div className={styles['profile__name']}>
          {user?.firstName} {user?.lastName}
        </div>
        <div className={styles['profile__arrow']}>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.88966 0.743284C10.0406 0.569115 10.0361 0.29779 9.87956 0.129477C9.723 -0.0388352 9.47062 -0.0436778 9.30861 0.118621L4.9233 4.83309L0.691425 0.118621C0.529416 -0.0436772 0.27696 -0.0388346 0.120399 0.129477C-0.0361624 0.29779 -0.0405919 0.569113 0.110374 0.743284L4.92326 6L9.88966 0.743284Z"
              fill={isDarkTheme ? '#ffffff' : '#292929'}
            />
          </svg>
        </div>
      </div>
      <div className={styles['profile__popup-menu-wrapper']}>
        {isPopupMenuOpened ? <PopupMenu onClickAway={handleClick} /> : null}
      </div>
    </div>
  );
}

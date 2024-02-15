import { useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ClickAwayListener from 'react-click-away-listener';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './Header.module.scss';
import Logo from '../Logo/Logo';
import Search from '../Search/Search';
import SignUpButton from '../SignUpButton/SignUpButton';
import SignInButton from '../SignInButton/SignInButton';
import ThemeSwitchButton from '../ThemeSwitchButton/ThemeSwitchButton';
import MobileSearch from '../MobileSearch/MobileSearch';
import Profile from '../Profile/Profile';
import WriteButton from '../WriteButton/WriteButton';
import MobileMenu from '../MobileMenu/MobileMenu';
import SignInForm from '../SignInForm/SignInForm';
import SignUpForm from '../SignUpForm/SignUpForm';
import { useAppSelector } from '../../hooks/reduxHooks';
import { checkAuth } from '../../redux/features/userSlice';

export default function Header() {
  const isAuth = useAppSelector(checkAuth);

  const isTablet = useMediaQuery({
    query: '(max-width: 820px)',
  });

  const { isDarkTheme } = useContext(DarkThemeContext);

  const [isMobileSearchOpened, setIsMobileSearchOpened] = useState(false);
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const [isSignInFormOpened, setIsSignInFormOpened] = useState(false);
  const [isSignUpFormOpened, setIsSignUpFormOpened] = useState(false);

  return (
    <>
      {isMobileMenuOpened || isSignInFormOpened || isSignUpFormOpened ? (
        <div
          className={
            isDarkTheme
              ? styles['header-overlay-dark']
              : styles['header-overlay']
          }
        />
      ) : null}
      <header
        className={isDarkTheme ? styles['header-dark'] : styles['header']}
        style={{
          borderColor: isMobileSearchOpened ? 'transparent' : '',
          paddingRight: isAuth && !isTablet ? '16px' : '',
        }}
      >
        <div className={styles['header__content']}>
          <Logo />
          {!isTablet ? <Search /> : null}
          {isAuth ? null : <ThemeSwitchButton />}
          {isAuth ? <WriteButton /> : null}
          {isAuth ? (
            !isTablet ? (
              <Profile />
            ) : null
          ) : (
            <div className={styles['header__buttons']}>
              <SignUpButton
                onClick={() => {
                  setIsSignUpFormOpened((prev: boolean) => !prev);
                  document.body.classList.add('no-scroll');
                }}
              />
              <SignInButton
                onClick={() => {
                  setIsSignInFormOpened((prev: boolean) => !prev);
                  document.body.classList.add('no-scroll');
                }}
              />
            </div>
          )}

          {isTablet ? (
            <div className={styles['header__mobile-buttons']}>
              <button
                className={styles['header__mobile-search-button']}
                type="button"
                onClick={() => {
                  setIsMobileSearchOpened((prev: boolean) => !prev);
                }}
              >
                <svg
                  width="24"
                  height="26"
                  viewBox="0 0 24 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.5556 22.6996L18.9638 18.1078C20.676 16.188 21.7397 13.6457 21.7397 10.8699C21.7397 4.87717 16.8625 0 10.8699 0C4.87716 0 0 4.87717 0 10.8699C0 16.8625 4.87716 21.7397 10.8699 21.7397C12.9972 21.7397 14.9687 21.117 16.6291 20.0794L21.4025 24.8528C21.6878 25.1382 22.0769 25.2938 22.4661 25.2938C22.8552 25.2938 23.2445 25.1382 23.5298 24.8528C24.1523 24.2562 24.1523 23.2962 23.5557 22.6996L23.5556 22.6996ZM3.03521 10.8699C3.03521 6.56342 6.53752 3.0353 10.8698 3.0353C15.2021 3.0353 18.6785 6.56347 18.6785 10.8699C18.6785 15.1764 15.1761 18.7045 10.8698 18.7045C6.56346 18.7045 3.03521 15.2022 3.03521 10.8699Z"
                    fill={
                      isDarkTheme
                        ? isMobileSearchOpened
                          ? '#6ea3ec'
                          : '#FFFFFF'
                        : isMobileSearchOpened
                        ? '#4683d9'
                        : '#292929'
                    }
                  />
                </svg>
              </button>
              {isAuth ? (
                <button
                  className={styles['header__mobile-menu-button']}
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpened(!isMobileMenuOpened);
                    if (isMobileSearchOpened)
                      setIsMobileSearchOpened((prev: boolean) => !prev);
                    document.body.classList.add('no-scroll');
                  }}
                >
                  <svg
                    width="28"
                    height="22"
                    viewBox="0 0 28 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.75 0C0.783437 0 0 0.794268 0 1.77419C0 2.75412 0.783437 3.54839 1.75 3.54839H26.25C27.2166 3.54839 28 2.75412 28 1.77419C28 0.794268 27.2166 0 26.25 0H1.75ZM1.75 9.22581C0.783437 9.22581 0 10.0201 0 11C0 11.9799 0.783437 12.7742 1.75 12.7742H26.25C27.2166 12.7742 28 11.9799 28 11C28 10.0201 27.2166 9.22581 26.25 9.22581H1.75ZM1.75 18.4516C0.783437 18.4516 0 19.2459 0 20.2258C0 21.2057 0.783437 22 1.75 22H26.25C27.2166 22 28 21.2057 28 20.2258C28 19.2459 27.2166 18.4516 26.25 18.4516H1.75Z"
                      fill={isDarkTheme ? '#ffffff' : '#292929'}
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        {isMobileSearchOpened && isTablet ? (
          <div
            className={styles['mobile-search-wrapper']}
            style={{
              backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
            }}
          >
            <MobileSearch
              onSubmit={() => {
                setIsMobileSearchOpened(false);
              }}
            />
          </div>
        ) : null}
      </header>
      {isTablet && isAuth && isMobileMenuOpened ? (
        <ClickAwayListener
          onClickAway={() => {
            setIsMobileMenuOpened((prev: boolean) => !prev);
            document.body.classList.remove('no-scroll');
          }}
        >
          <div className={styles['mobile-menu-wrapper']}>
            <MobileMenu
              onClick={() => {
                setIsMobileMenuOpened((prev: boolean) => !prev);
                document.body.classList.remove('no-scroll');
              }}
              onSignOut={() => {
                setIsMobileMenuOpened((prev: boolean) => !prev);
              }}
            />
          </div>
        </ClickAwayListener>
      ) : null}
      {isSignInFormOpened ? (
        <SignInForm
          onClickAway={() => {
            setIsSignInFormOpened((prev: boolean) => !prev);
            document.body.classList.remove('no-scroll');
          }}
          onClick={() => {
            setIsSignInFormOpened((prev: boolean) => !prev);
            setIsSignUpFormOpened((prev: boolean) => !prev);
            document.body.classList.add('no-scroll');
          }}
          onSuccessSubmit={() => {
            setIsSignInFormOpened((prev: boolean) => !prev);
            document.body.classList.remove('no-scroll');
          }}
        />
      ) : null}
      {isSignUpFormOpened ? (
        <SignUpForm
          onClickAway={() => {
            setIsSignUpFormOpened((prev: boolean) => !prev);
            document.body.classList.remove('no-scroll');
          }}
          onClick={() => {
            setIsSignUpFormOpened((prev: boolean) => !prev);
            setIsSignInFormOpened((prev: boolean) => !prev);
            document.body.classList.add('no-scroll');
          }}
          onSuccessSubmit={() => {
            setIsSignUpFormOpened((prev: boolean) => !prev);
            document.body.classList.remove('no-scroll');
          }}
        />
      ) : null}
    </>
  );
}

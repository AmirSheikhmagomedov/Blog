import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './SignInForm.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  checkAuth,
  signIn,
  deleteError,
  deleteMessage,
} from '../../redux/features/userSlice';

type Inputs = {
  username: string;
  password: string;
};

export default function SignInForm({
  onClickAway,
  onClick,
  onSuccessSubmit,
}: {
  onClickAway: () => void;
  onClick: () => void;
  onSuccessSubmit: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const { message, error } = useAppSelector((state) => state.user);

  const { isDarkTheme } = useContext(DarkThemeContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.user);

  const isAuth = useAppSelector(checkAuth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (message && user) {
      toast.success('You signed in', { toastId: '100' });
      onSuccessSubmit();
      dispatch(deleteMessage());
      setIsLoading(false);
    }
    if (error) {
      if (error.includes('Username')) {
        setError(
          'username',
          {
            type: 'custom',
            message: 'Username or password is incorrect',
          },
          { shouldFocus: true }
        );
        setError(
          'password',
          {
            type: 'custom',
            message: 'Username or password is incorrect',
          },
          { shouldFocus: true }
        );
        dispatch(deleteError());
      } else if (error.includes('found')) {
        setError(
          'username',
          {
            type: 'custom',
            message: 'User was not found',
          },
          { shouldFocus: true }
        );
        dispatch(deleteError());
      } else {
        toast.error(error, { toastId: '2356' });
        setTimeout(() => {
          dispatch(deleteError());
        }, 0);
      }
    }
  }, [isAuth, message, error, onSuccessSubmit, setError, dispatch]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        onClickAway();
        dispatch(deleteError());
        dispatch(deleteMessage());
      }}
    >
      <form
        onSubmit={handleSubmit(async ({ username, password }) => {
          if (Object.keys(errors).length === 0) {
            setIsLoading(true);
          }
          await dispatch(signIn({ username, password }));

          if (Object.keys(errors).length === 0) {
            setIsLoading(false);
          }

          navigate('/');
        })}
        className={
          isDarkTheme ? styles['signin-form-dark'] : styles['signin-form']
        }
      >
        <h2
          className={styles['signin-form__title']}
          style={{ marginBottom: isLoading ? '20px' : '' }}
        >
          Sign in
        </h2>
        {isLoading ? (
          <Spinner
            animation="border"
            role="status"
            style={{ marginBottom: '24px' }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : null}
        <div className={styles['signin-form__username-input-wrapper']}>
          <input
            className={
              isDarkTheme
                ? styles['signin-form__username-input-dark']
                : styles['signin-form__username-input']
            }
            style={{
              border: errors.username?.message ? '1px solid #F04F4F' : '',
            }}
            type="text"
            maxLength={20}
            placeholder="Username"
            {...register('username', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum length of username is 3',
              },
              pattern: {
                value: /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                message: 'Username is invalid',
              },
            })}
          />
          <p className={styles['signin-form__error']}>
            {errors.username?.message}
          </p>
        </div>
        <div className={styles['signin-form__password-input-wrapper']}>
          <input
            className={
              isDarkTheme
                ? styles['signin-form__password-input-dark']
                : styles['signin-form__password-input']
            }
            type="password"
            maxLength={20}
            placeholder="Password"
            style={{
              border: errors.password?.message ? '1px solid #F04F4F' : '',
            }}
            {...register('password', {
              required: 'This field is required',
              minLength: {
                value: 4,
                message: 'Minimum length of password is 4',
              },
            })}
          />
          <p className={styles['signin-form__error']}>
            {errors.password?.message}
          </p>
        </div>
        <button className={styles['signin-form__button']} type="submit">
          Sign in
        </button>
        <div className={styles['signin-form__signup-link']}>
          <p
            className={styles['signin-form__question']}
          >{`Don't have an account?`}</p>
          <button
            className={
              isDarkTheme
                ? styles['signin-form__create-button-dark']
                : styles['signin-form__create-button']
            }
            type="button"
            onClick={onClick}
          >
            Create one
          </button>
        </div>
      </form>
    </ClickAwayListener>
  );
}

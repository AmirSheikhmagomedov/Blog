import ClickAwayListener from 'react-click-away-listener';
import { useState, ChangeEvent, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './SignUpForm.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  signUp,
  checkAuth,
  deleteError,
  deleteMessage,
} from '../../redux/features/userSlice';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

type Inputs = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export default function SignUpForm({
  onClickAway,
  onClick,
  onSuccessSubmit,
}: {
  onClickAway: () => void;
  onClick: () => void;
  onSuccessSubmit: () => void;
}) {
  const [avatar, setAvatar] = useState<File>();
  const [preview, setPreview] = useState('');

  const { message, error } = useAppSelector((state) => state.user);
  const isAuth = useAppSelector(checkAuth);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (message && user) {
      toast.success('You signed up', { toastId: '456' });
      dispatch(deleteMessage());
      onSuccessSubmit();
      setIsLoading(false);
    }
    if (error) {
      if (error.includes('Username')) {
        setError(
          'username',
          {
            type: 'custom',
            message: 'Username is already taken',
          },
          { shouldFocus: true }
        );
        dispatch(deleteError());
      } else {
        toast.error(error, { toastId: '989' });
        setTimeout(() => {
          dispatch(deleteError());
        }, 0);
      }
    }
  }, [isAuth, message, error, onSuccessSubmit, setError, dispatch]);

  const { isDarkTheme } = useContext(DarkThemeContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        onClickAway();
        dispatch(deleteError());
        dispatch(deleteMessage());
      }}
    >
      <form
        className={styles['signup-form']}
        style={{ backgroundColor: isDarkTheme ? '#333333' : '' }}
        onSubmit={handleSubmit(
          async ({ firstName, lastName, username, password }) => {
            if (Object.keys(errors).length === 0) {
              setIsLoading(true);
            }

            const formData: any = new FormData();

            formData.append('firstName', capitalizeFirstLetter(firstName));
            formData.append('lastName', capitalizeFirstLetter(lastName));
            formData.append('username', username.replace(' ', ''));
            formData.append('password', password);
            formData.append('image', avatar);

            await dispatch(signUp(formData));

            if (Object.keys(errors).length === 0) {
              setIsLoading(false);
            }
          }
        )}
      >
        <h2 className={styles['signup-form__title']}>Sign up</h2>
        {isLoading ? (
          <Spinner
            animation="border"
            role="status"
            style={{ marginBottom: '24px' }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : null}
        {!preview ? (
          <div
            className={styles['signup-form__avatar-upload']}
            style={{ borderColor: isDarkTheme ? '#ffffff' : '' }}
          >
            <input
              className={styles['signup-form__avatar-upload-input']}
              type="file"
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg"
            />
            <svg
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.6667 0H1.33333C0.6 0 0 0.6 0 1.33333V13.3333C0 14.0667 0.6 14.6667 1.33333 14.6667H18.6667C19.4 14.6667 20 14.0667 20 13.3333V1.33333C20 0.6 19.4 0 18.6667 0ZM18.6667 1.33333V7.2C17.2667 5.93333 15 4.06667 13.5333 4.06667H13.4667C12.2667 4.06667 11.1333 5.26667 10 6.46667C9.26667 7.2 8.53333 7.93333 8.06667 8.2C7.6 8.4 6.53333 8.26667 5.66667 8.2C4.73333 8.13333 3.86667 8 3.2 8.2C2.73333 8.2 2 8.6 1.33333 8.93333V1.33333H18.6667ZM1.33333 13.3333V10.4667C2.13333 10 3.06667 9.46667 3.46667 9.4C3.93333 9.26667 4.73333 9.4 5.53333 9.46667C6.66667 9.6 7.8 9.66667 8.6 9.4C9.4 9.06667 10.2 8.26667 11 7.4C11.8667 6.53333 12.8667 5.46667 13.5333 5.4C14.5333 5.4 17 7.46667 18.6 9.06667V13.3333H1.33333Z"
                fill={isDarkTheme ? '#ffffff' : '#757575'}
              />
              <path
                d="M7.40016 8.60001C8.5335 8.60001 9.46683 7.66667 9.46683 6.53334C9.46683 5.40001 8.5335 4.46667 7.40016 4.46667C6.26683 4.46667 5.3335 5.40001 5.3335 6.53334C5.3335 7.66667 6.26683 8.60001 7.40016 8.60001ZM7.40016 5.80001C7.80016 5.80001 8.1335 6.13334 8.1335 6.53334C8.1335 6.93334 7.80016 7.26667 7.40016 7.26667C7.00016 7.26667 6.66683 6.93334 6.66683 6.53334C6.66683 6.13334 7.00016 5.80001 7.40016 5.80001Z"
                fill={isDarkTheme ? '#ffffff' : '#757575'}
              />
            </svg>
            <p style={{ color: isDarkTheme ? '#ffffff' : '' }}>Upload avatar</p>
          </div>
        ) : null}
        {preview ? (
          <div className={styles['signup-form__avatar-preview']}>
            <img src={preview} alt="" />
            <button
              className={styles['signup-form__preview-delete-button']}
              onClick={() => {
                setPreview('');
                setAvatar(undefined);
              }}
              type="button"
            >
              <svg
                width="16"
                height="23"
                viewBox="0 0 16 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.6 0H6.4C5.52 0 4.8 0.72 4.8 1.6V2.4H0.8C0.36 2.4 0 2.76 0 3.2C0 3.64 0.36 4 0.8 4H15.2C15.64 4 16 3.64 16 3.2C16 2.76 15.64 2.4 15.2 2.4H11.2V1.6C11.2 0.72 10.48 0 9.6 0ZM6.4 2.4V1.6H9.6V2.4H6.4Z"
                  fill={isDarkTheme ? '#9b9b9b' : '#757575'}
                />
                <path
                  d="M8.0002 19.2C8.4402 19.2 8.8002 18.84 8.8002 18.4V8.8C8.8002 8.36 8.4402 8 8.0002 8C7.5602 8 7.2002 8.36 7.2002 8.8V18.4C7.2002 18.84 7.5602 19.2 8.0002 19.2Z"
                  fill={isDarkTheme ? '#9b9b9b' : '#757575'}
                />
                <path
                  d="M11.1361 19.2H11.2C11.6081 19.2 11.96 18.888 12 18.4639L12.8 8.86392C12.84 8.42392 12.512 8.04001 12.072 8.00001C11.624 7.96001 11.2481 8.28804 11.2081 8.72805L10.4081 18.3281C10.3681 18.7681 10.6961 19.152 11.1361 19.192L11.1361 19.2Z"
                  fill={isDarkTheme ? '#9b9b9b' : '#757575'}
                />
                <path
                  d="M4.80006 19.2001H4.86399C5.30399 19.1601 5.63203 18.7761 5.59203 18.3362L4.79203 8.73616C4.76007 8.29616 4.37596 7.96007 3.92813 8.00812C3.48813 8.04812 3.16008 8.43205 3.20008 8.87203L4.00008 18.472C4.03204 18.8881 4.38401 19.2081 4.80008 19.2081L4.80006 19.2001Z"
                  fill={isDarkTheme ? '#9b9b9b' : '#757575'}
                />
                <path
                  d="M0.799882 4.80009C0.575955 4.80009 0.359881 4.89617 0.207927 5.06402C0.0559636 5.23206 -0.0159998 5.45598 0.00792705 5.68011L1.44793 20.2639C1.584 21.48 2.60793 22.4 3.83184 22.4H12.1678C13.3917 22.4 14.4159 21.48 14.5517 20.2561L15.9917 5.68007C16.0157 5.45614 15.9437 5.23203 15.7917 5.06398C15.6398 4.89594 15.4237 4.80005 15.1998 4.80005L0.799882 4.80009ZM12.9599 20.0883C12.9118 20.4964 12.576 20.8003 12.1679 20.8003H3.83193C3.42389 20.8003 3.07997 20.4964 3.03997 20.0964L1.68802 6.40037H14.3198L12.9678 20.0886L12.9599 20.0883Z"
                  fill={isDarkTheme ? '#9b9b9b' : '#757575'}
                />
              </svg>
            </button>
          </div>
        ) : null}
        <div className={styles['signup-form__first-name']}>
          <input
            className={
              isDarkTheme
                ? styles['signup-form__first-name-input-dark']
                : styles['signup-form__first-name-input']
            }
            type="text"
            placeholder="First Name"
            maxLength={20}
            style={{
              border: errors.firstName?.message ? '1px solid #F04F4F' : '',
            }}
            {...register('firstName', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum length of first name is 3',
              },
              pattern: {
                value: /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                message: 'First name is invalid',
              },
            })}
          />
          <p className={styles['signup-form__error']}>
            {errors.firstName?.message}
          </p>
        </div>
        <div className={styles['signup-form__last-name']}>
          <input
            className={
              isDarkTheme
                ? styles['signup-form__last-name-input-dark']
                : styles['signup-form__last-name-input']
            }
            type="text"
            placeholder="Last Name"
            maxLength={20}
            style={{
              border: errors.lastName?.message ? '1px solid #F04F4F' : '',
            }}
            {...register('lastName', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum length of last name is 3',
              },
              pattern: {
                value: /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                message: 'Last name is invalid',
              },
            })}
          />
          <p className={styles['signup-form__error']}>
            {errors.lastName?.message}
          </p>
        </div>
        <div className={styles['signup-form__username']}>
          <input
            className={
              isDarkTheme
                ? styles['signup-form__username-input-dark']
                : styles['signup-form__username-input']
            }
            type="text"
            placeholder="Username"
            style={{
              border: errors.username?.message ? '1px solid #F04F4F' : '',
            }}
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
          <p className={styles['signup-form__error']}>
            {errors.username?.message}
          </p>
        </div>
        <div className={styles['signup-form__password']}>
          <input
            className={
              isDarkTheme
                ? styles['signup-form__password-input-dark']
                : styles['signup-form__password-input']
            }
            type="password"
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
          <p className={styles['signup-form__error']}>
            {errors.password?.message}
          </p>
        </div>
        <button className={styles['signup-form__signup-button']} type="submit">
          Sign up
        </button>
        <div className={styles['signup-form__link']}>
          <p className={styles['signup-form__question']}>
            Already have an account?
          </p>
          <button
            className={
              isDarkTheme
                ? styles['signup-form__signin-button-dark']
                : styles['signup-form__signin-button']
            }
            type="button"
            onClick={onClick}
          >
            Sign in
          </button>
        </div>
      </form>
    </ClickAwayListener>
  );
}

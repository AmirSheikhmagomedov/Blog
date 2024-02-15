import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './Article.module.scss';

interface IArticleProps {
  firstName: string;
  lastName: string;
  username: string;
  userAvatar?: string;
  articleImage: string;
  time: string;
  category: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  readingTime: string;
  articleId: string;
}

export default function Article({
  firstName,
  lastName,
  username,
  userAvatar,
  articleImage,
  time,
  category,
  title,
  description,
  likes,
  comments,
  readingTime,
  articleId,
}: IArticleProps) {
  const { isDarkTheme } = useContext(DarkThemeContext);

  return (
    <article
      className={isDarkTheme ? styles['article-dark'] : styles['article']}
    >
      <Link className={styles['article__image']} to={`/article/${articleId}`}>
        <img
          src={`${import.meta.env.VITE_REACT_BACKEND_ASSETS}${articleImage}`}
          alt="Article image"
          crossOrigin="anonymous"
        />
      </Link>
      <div className={styles['article__content']}>
        <div className={styles['article__top']}>
          <Link
            className={styles['article__author']}
            to={`/profile/${username}`}
          >
            {!userAvatar ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0002 0C4.4858 0 0 4.48621 0 9.99939C0 15.5134 4.48621 19.9996 10.0002 19.9996C15.5142 19.9996 20 15.5134 20 9.99939C20.0002 4.4858 15.5142 0 10.0002 0ZM10.0002 3.85943C11.7913 3.85943 13.243 5.31159 13.243 7.10219C13.243 8.89328 11.7908 10.3459 10.0002 10.3459C8.20879 10.3459 6.75696 8.89332 6.75696 7.10219C6.75696 5.31127 8.20879 3.85943 10.0002 3.85943ZM5.40366 17.9049C5.50249 17.9624 5.60227 18.0183 5.70362 18.0716C5.60227 18.0183 5.50249 17.9625 5.40366 17.9049ZM10.0002 18.9805C7.25396 18.9805 4.79337 17.7398 3.14479 15.7914C3.60707 13.6225 5.53061 11.9651 7.8347 11.9651H12.1649C14.4798 11.9651 16.4086 13.6046 16.8605 15.7848C15.2122 17.7374 12.7493 18.9805 10.0002 18.9805ZM16.9013 16.0088C16.9008 16.0093 16.9008 16.0096 16.9005 16.0104C16.9008 16.0096 16.9008 16.0091 16.9013 16.0088Z"
                  fill={isDarkTheme ? '#ffffff' : '#292929'}
                />
              </svg>
            ) : (
              <img
                src={`${
                  import.meta.env.VITE_REACT_BACKEND_ASSETS
                }${userAvatar}`}
                alt="User avatar"
                crossOrigin="anonymous"
              />
            )}
            {`${firstName} ${lastName}`}
          </Link>
          <Link
            to={`/article/${articleId}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span
              style={{
                height: '22px',
                color: isDarkTheme ? '#9b9b9b' : '#757575',
              }}
            >
              .
            </span>
            <time
              className={styles['article__time']}
              style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
            >
              {time}
            </time>
            <span
              style={{
                height: '22px',
                color: isDarkTheme ? '#9b9b9b' : '#757575',
              }}
            >
              .
            </span>
          </Link>
          <Link
            className={
              isDarkTheme
                ? styles['article__category-dark']
                : styles['article__category']
            }
            to={`/category/${category.toLowerCase()}`}
          >
            {`${category.charAt(0).toUpperCase()}${category.slice(1)}`}
          </Link>
        </div>
        <Link to={`/article/${articleId}`}>
          <h2 className={styles['article__title']} style={{ fontWeight: 700 }}>
            {title}
          </h2>
          <p
            className={styles['article__description']}
            style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
          >
            {description}
          </p>
        </Link>
        <Link
          to={`/article/${articleId}`}
          className={styles['article__bottom']}
        >
          <div
            className={styles['article__likes']}
            style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.999 6.6825e-05C14.424 6.6825e-05 14.9989 0.950056 14.9989 2.49992C14.9489 4.37481 14.424 6.22475 13.6491 7.9246C14.7491 8.0247 15.874 7.99976 16.9989 7.99976C18.8738 7.99976 19.9987 8.77467 19.9987 10.2495C20.0236 10.8495 19.6987 11.3244 19.2237 11.6745L19.2487 11.6995C19.6487 12.6244 19.6236 13.5243 18.7236 14.1744L18.7486 14.1993C19.1486 15.1242 19.1235 16.0242 18.2235 16.6742L18.2484 16.6992C18.5234 17.4741 18.4734 17.1241 18.5234 17.7491C18.5234 19.1241 17.5236 19.9989 16.0236 19.9989H12.999C11.3491 19.9989 9.44923 19.8489 7.79933 19.5989C7.37437 19.5239 6.94942 19.4738 6.49936 19.3739L6.49953 19.4989C6.49953 19.7739 6.27458 19.9989 5.9996 19.9989H0.499926C0.224933 19.9989 0 19.7739 0 19.4989V7.49963C0 7.22464 0.224946 6.99971 0.499926 6.99971H5.9996C6.2746 6.99971 6.49953 7.22466 6.49953 7.49963V7.57462C7.59951 6.9247 8.39937 5.87481 9.19937 4.89968C9.39938 4.62469 9.59939 4.32476 9.79938 3.97478C10.0744 3.49977 11.0244 1.57483 11.2493 1.19995C11.7243 0.450124 12.2493 6.10352e-05 12.9992 6.10352e-05L12.999 6.6825e-05ZM0.999724 7.9996V18.999H5.49946L5.49929 7.9996H0.999724ZM12.999 1.00001C11.9992 1.00001 11.499 3.49986 9.99924 5.49974C9.07434 6.77463 7.94927 7.84965 6.64948 8.69956L6.49952 8.77454V18.324C8.62448 18.849 10.8242 18.924 12.9991 18.999H15.9989C16.9988 18.999 17.4989 18.4991 17.4989 17.7491C17.4989 16.9991 16.999 16.9991 16.999 16.4991C16.999 15.9992 17.9988 15.9992 17.9988 15.2492C17.9988 14.4992 17.4989 14.4992 17.4989 13.9993C17.4989 13.4994 18.4988 13.4994 18.4988 12.7494C18.4988 11.9994 17.9988 11.9994 17.9988 11.4994C17.9988 10.9995 18.9987 10.9995 18.9987 10.2495C18.9987 9.4995 18.4988 8.99957 16.9988 8.99957C13.4991 8.99957 11.9991 8.99957 12.499 7.99972C13.049 6.89974 13.999 4.50001 13.999 2.50004C13.999 1.49983 13.7741 0.999906 12.999 0.999906L12.999 1.00001Z"
                fill={isDarkTheme ? '#9b9b9b' : '#757575'}
              />
            </svg>
            {likes}
          </div>
          <div
            className={styles['article__comments']}
            style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6.10352e-05C4.48612 6.10352e-05 0 3.99888 0 8.91397C0 13.8291 4.48612 17.8279 10 17.8279C10.869 17.8283 11.7351 17.7276 12.5806 17.5275L16.206 19.8729C16.3677 19.9766 16.5613 20.0189 16.7515 19.9921C16.9418 19.9653 17.116 19.871 17.2428 19.7267C17.3695 19.5823 17.4403 19.3973 17.4423 19.2051L17.4909 14.8166C18.278 14.047 18.905 13.1292 19.3356 12.116C19.7663 11.1029 19.9921 10.0145 20 8.91365C20 3.99856 15.5139 6.10352e-05 10 6.10352e-05ZM16.554 14.1795L16.3822 14.3435L16.3373 18.6347L12.7763 16.3307L12.5394 16.3927C11.7104 16.6088 10.8568 16.7177 10 16.7168C5.09844 16.7168 1.11113 13.2165 1.11113 8.91402C1.11113 4.61151 5.09844 1.11162 10 1.11162C14.9016 1.11162 18.8889 4.61175 18.8889 8.91402C18.879 9.90454 18.667 10.8825 18.2653 11.7879C17.8639 12.6933 17.2815 13.5072 16.554 14.1795Z"
                fill={isDarkTheme ? '#9b9b9b' : '#757575'}
              />
            </svg>
            {comments}
          </div>
          <div
            className={styles['article__reading-time']}
            style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
          >
            {readingTime}
          </div>
        </Link>
      </div>
    </article>
  );
}

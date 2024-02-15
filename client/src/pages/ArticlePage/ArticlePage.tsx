import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ReactHelmet, { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from './ArticlePage.module.scss';
import profileImage from '../../assets/profile.jpg';
import axios from '../../utils/axios';
import formatDate from '../../utils/formatDate';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  clearState,
  decrementComment,
  decrementLikes,
  incrementComment,
  incrementLikes,
} from '../../redux/features/articleSlice';

interface IArticle {
  _id: string;
  authorUsername: string;
  authorFirstName: string;
  authorLastName: string;
  authorId: string;
  authorAvatar?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  readingTime: string;
  likes: number;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IComment {
  _id: string;
  authorUsername: string;
  authorId: string;
  articleId: string;
  authorFirstName: string;
  authorLastName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export default function ArticlePage() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const commentsRef = useRef<HTMLDivElement>(null);

  const { articleId } = useParams();

  const [article, setArticle] = useState<IArticle>();

  const [comments, setComments] = useState<IComment[]>([]);

  const [commentsCount, setCommentsCount] = useState<number>(0);

  const [likesCount, setLikesCount] = useState<number>(0);

  const [isMy, setIsMy] = useState<boolean>();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);

  const [commentValue, setCommentValue] = useState<string>('');

  const fetchArticle = async () => {
    try {
      const { data } = await axios.get(`/article/${articleId}`);

      setArticle(data.article);

      setIsMy(data.isMy);
      setIsLiked(data.isLiked);
      setCommentsCount(data.article.comments.length);
      setLikesCount(data.article.likes);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to get an article. Try again');
      navigate('/');
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/article/${articleId}/comments`);

      setComments(data);
    } catch (error) {
      toast.error('Failed to get article comments. Try again');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setIsCommentLoading(true);
      await axios.delete(
        `/article/${article?._id}/comments/delete/${commentId}`
      );

      setCommentsCount((prev: number) => prev - 1);

      setComments(comments?.filter((comment) => comment._id !== commentId));

      setIsCommentLoading(false);

      dispatch(decrementComment({ articleId, commentId }));

      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete a comment. Try again');
    }
  };

  const sendComment = async (text: string) => {
    try {
      setIsCommentLoading(true);
      const { data } = await axios.post(`/article/comment/${article?._id}`, {
        text,
      });

      setCommentsCount((prev: number) => prev + 1);

      setComments((prev: IComment[]) => [data.newComment, ...prev]);

      setIsCommentLoading(false);

      setCommentValue('');

      dispatch(incrementComment({ articleId, commentId: data.newComment._id }));
    } catch (error) {
      toast.error('Failed to send a comment. Try again');
    }
  };

  const likeArticle = async () => {
    try {
      if (!user) {
        toast.warn('You need to sign in first', { toastId: '2342' });
        return;
      }
      setIsButtonDisabled(true);
      await axios.post(`article/like/${articleId}`);

      setLikesCount((prev: number) => prev + 1);

      setIsLiked(true);
      setIsButtonDisabled(false);

      dispatch(incrementLikes(`${articleId}`));
    } catch (error) {
      toast.error('Failed to like an article. Try again', {
        toastId: '124590',
      });
    }
  };

  const unlikeArticle = async () => {
    try {
      if (!user) {
        toast.warn('You need to sign in first');
        return;
      }
      setIsButtonDisabled(true);
      await axios.post(`article/unlike/${articleId}`);

      setLikesCount((prev: number) => prev - 1);

      setIsLiked(false);

      setIsButtonDisabled(false);

      dispatch(decrementLikes(`${articleId}`));
    } catch (error) {
      toast.error('Failed to unlike an article. Try again', {
        toastId: '1246',
      });
    }
  };

  const deleteArticle = async () => {
    try {
      await axios.delete(`/article/${article?._id}`);

      navigate('/');

      dispatch(clearState());

      toast.success('Article deleted');
    } catch (error) {
      toast.error('Failed to delete an article. Try again');
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, []);

  useEffect(() => {
    document.title = `${article?.title || 'Article title'} - Blog App`;
  }, [article?.title]);

  return (
    <>
      <ReactHelmet
        link={[
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-${
              isDarkTheme ? 'dark' : 'light'
            }.min.css`,
          },
        ]}
      />
      <Helmet>
        <title>{`${article?.title || 'Article title'} - Blog App`}</title>
      </Helmet>
      <div className={styles['article-page']}>
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Link
              className={
                styles[
                  isDarkTheme
                    ? 'article-page__category-dark'
                    : 'article-page__category'
                ]
              }
              to={`/category/${article?.category}`}
            >
              {capitalizeFirstLetter(`${article?.category}`)}
            </Link>
            <h1 className={styles['article-page__title']}>{article?.title}</h1>
            <p className={styles['article-page__descirption']}>
              {article?.description}
            </p>
            <div className={styles['article-page__article-info']}>
              <div className={styles['article-page__profile']}>
                <div
                  className={styles['article-page__profile-avatar']}
                  style={{
                    border: !article?.authorAvatar
                      ? isDarkTheme
                        ? '1px solid #757575'
                        : '1px solid #dcdcdc'
                      : '0px',
                  }}
                >
                  <img
                    src={
                      article?.authorAvatar
                        ? `${import.meta.env.VITE_REACT_BACKEND_ASSETS}${
                            article?.authorAvatar
                          }`
                        : profileImage
                    }
                    alt=""
                    style={{
                      filter:
                        isDarkTheme && !article?.authorAvatar
                          ? 'invert(0.8)'
                          : '',
                      transition: 'filter .3s ease 0s',
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
                <div className={styles['article-page__profile-right']}>
                  <Link
                    className={styles['article-page__profile-name']}
                    to={`/profile/${article?.authorUsername}`}
                  >
                    {`${article?.authorFirstName} ${article?.authorLastName}`}
                  </Link>
                  <div
                    className={styles['article-page__profile-date-and-time']}
                  >
                    <p style={{ color: isDarkTheme ? '#9b9b9b' : '' }}>
                      {formatDate(`${article?.createdAt}`)}
                    </p>
                    <span>.</span>
                    <p style={{ color: isDarkTheme ? '#9b9b9b' : '' }}>
                      {article?.readingTime}
                    </p>
                  </div>
                </div>
              </div>
              {!isMy ? (
                isLiked ? (
                  <button
                    className={
                      styles[
                        isDarkTheme
                          ? 'article-page__unlike-button-dark'
                          : 'article-page__unlike-button'
                      ]
                    }
                    type="button"
                    onClick={unlikeArticle}
                    disabled={isButtonDisabled}
                  >
                    Unlike
                  </button>
                ) : (
                  <button
                    className={
                      styles[
                        isDarkTheme
                          ? 'article-page__like-button-dark'
                          : 'article-page__like-button'
                      ]
                    }
                    type="button"
                    onClick={likeArticle}
                    disabled={isButtonDisabled}
                  >
                    Like
                  </button>
                )
              ) : null}
              {isMy ? (
                <div style={{ display: 'flex', gap: '36px' }}>
                  <Link
                    className={
                      styles[
                        isDarkTheme
                          ? 'article-page__edit-button-dark'
                          : 'article-page__edit-button'
                      ]
                    }
                    type="button"
                    to={`/article/${article?._id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className={
                      styles[
                        isDarkTheme ? 'delete-button-dark' : 'delete-button'
                      ]
                    }
                    type="button"
                    onClick={() => {
                      deleteArticle();
                    }}
                    style={{ marginLeft: '-24px' }}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
            <div className={styles['article-page__likes-and-comments']}>
              <div
                className={styles['article-page__likes']}
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
                {likesCount}
              </div>
              <button
                className={styles['article-page__comments']}
                style={{ color: isDarkTheme ? '#9b9b9b' : '' }}
                type="button"
                onClick={() =>
                  commentsRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }
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
                {commentsCount}
              </button>
            </div>
            <div className={styles['article-page__article-image']}>
              <img
                src={`${import.meta.env.VITE_REACT_BACKEND_ASSETS}${
                  article?.image
                }`}
                alt="Article image"
                crossOrigin="anonymous"
              />
            </div>
            <div className={styles['article-page__article-content']}>
              {parse(`${article?.content}`)}
            </div>
            <div
              className={styles['article-page__article-comments']}
              ref={commentsRef}
            >
              <h2 className={styles['article-page__article-comments-title']}>
                {`Comments (${commentsCount})`}
              </h2>
              <div
                className={
                  styles['article-page__article-comments-write-comment']
                }
              >
                <textarea
                  placeholder="Write a comment"
                  className={
                    styles[
                      isDarkTheme
                        ? 'article-page__article-comments-write-comment-input-dark'
                        : 'article-page__article-comments-write-comment-input'
                    ]
                  }
                  value={commentValue}
                  onChange={(e) => {
                    setCommentValue(e.target.value);
                  }}
                />
                <div style={{ display: 'flex', gap: '24px' }}>
                  <button
                    className={
                      styles[
                        isDarkTheme
                          ? 'article-page__article-comments-write-comment-button-dark'
                          : 'article-page__article-comments-write-comment-button'
                      ]
                    }
                    type="button"
                    onClick={() => {
                      if (!user) {
                        toast.warn('You need to sign in first', {
                          toastId: '1238',
                        });
                        return;
                      }
                      sendComment(commentValue);
                    }}
                    disabled={!commentValue}
                  >
                    Send
                  </button>
                  {isCommentLoading ? (
                    <div
                      style={{
                        display: 'inline-block',
                        transform: 'scale(0.8)',
                      }}
                    >
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={styles['article-page__article-comments-container']}
              >
                {comments.map((comment, index) => {
                  return (
                    <div
                      className={
                        styles['article-page__artilce-comments-comment']
                      }
                      key={index}
                    >
                      <div
                        className={
                          styles['article-page__artilce-comments-comment-info']
                        }
                      >
                        <Link
                          to={`/profile/${comment.authorUsername}`}
                          className={
                            styles[
                              'article-page__artilce-comments-comment-info-avatar'
                            ]
                          }
                          style={{
                            border: !comment?.authorAvatar
                              ? isDarkTheme
                                ? '1px solid #757575'
                                : '1px solid #dcdcdc'
                              : '',
                          }}
                        >
                          <img
                            src={
                              comment.authorAvatar
                                ? `${
                                    import.meta.env.VITE_REACT_BACKEND_ASSETS
                                  }${comment.authorAvatar}`
                                : profileImage
                            }
                            alt="Author avatar"
                            crossOrigin="anonymous"
                            style={{
                              filter:
                                isDarkTheme && !comment?.authorAvatar
                                  ? 'invert(0.8)'
                                  : '',
                              transition: 'filter .3s ease 0s',
                            }}
                          />
                        </Link>
                        <div
                          className={
                            styles[
                              'article-page__artilce-comments-comment-info-name-and-time'
                            ]
                          }
                        >
                          <Link
                            to={`/profile/${comment.authorUsername}`}
                            style={{ color: 'inherit' }}
                          >
                            {`${comment.authorFirstName} ${comment.authorLastName}`}
                          </Link>
                          <p
                            style={{
                              fontSize: '14px',
                              color: isDarkTheme ? '#9b9b9b' : '#757575',
                            }}
                          >
                            {formatDate(`${comment.createdAt}`)}
                          </p>
                        </div>
                        {comment.authorUsername === user?.username ? (
                          <button
                            type="button"
                            className={
                              styles[
                                'article-page__artilce-comments-comment-delete-button'
                              ]
                            }
                            title="Delete a comment"
                            onClick={() => {
                              deleteComment(comment._id);
                            }}
                          >
                            <svg
                              width="16"
                              height="23"
                              viewBox="0 0 16 23"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ transform: 'scale(0.8)' }}
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
                        ) : null}
                      </div>
                      <div
                        className={
                          styles['article-page__artilce-comments-comment-text']
                        }
                        style={{ lineHeight: '140%' }}
                      >
                        {comment.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

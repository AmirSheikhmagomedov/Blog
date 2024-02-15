import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/esm/Spinner';
import { Helmet } from 'react-helmet';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { InView } from 'react-intersection-observer';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import ProfileStats from '../../components/ProfileStats/ProfileStats';
import styles from './ProfilePage.module.scss';
import axios from '../../utils/axios';
import { signOut } from '../../redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import Article from '../../components/Article/Article';
import formatDate from '../../utils/formatDate';
import { clearState } from '../../redux/features/articleSlice';

interface IUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  myArticles?: string[];
  likedArticles?: string[];
  followers?: string[];
  following?: string[];
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

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

export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<IUser>();
  const [isMe, setIsMe] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followersNumber, setFollowersNumber] = useState<number>(0);
  const [userArticles, setUserArticles] = useState<IArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: isAuth } = useAppSelector((state) => state.user);
  const { isDarkTheme } = useContext(DarkThemeContext);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/user/${params.profileName}`);

      setUser(response.data.user);
      setIsMe(response.data.isMe);
      setFollowersNumber(response.data.user.followers.length);
      setIsFollowing(response.data.isFollowing);

      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    } catch (error) {
      if (error instanceof AxiosError) {
        navigate('/');
        if (error.response?.status === 404) {
          toast.error('User was not found', { toastId: 'custom-id' });
        }
        if (error.response?.status === 409)
          toast.error('Failed to view profile. Try again', { toastId: '009' });
      }
    }
  };

  const fetchArticles = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `/articles/${params.profileName}?page=${page}`
      );

      setUserArticles((prev: IArticle[]) => [...prev, ...data]);
    } catch (error) {
      toast.error('Failed to get user articles. Try again');
    }
  };

  useEffect(() => {
    if (
      !(currentPage * 5 === userArticles?.length) &&
      Number(userArticles?.length) % 5 === 0 &&
      userArticles.length
    )
      fetchArticles(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchUser();
    fetchArticles();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${user?.firstName} ${user?.lastName} - Blog App`}</title>
      </Helmet>
      {!isLoading ? (
        <ProfileStats
          avatarLink={
            user?.avatar
              ? `${import.meta.env.VITE_REACT_BACKEND_ASSETS}${user?.avatar}`
              : ''
          }
          firstName={user?.firstName ? user.firstName : 'Firstname'}
          lastName={user?.lastName ? user.lastName : 'Lastname'}
          username={user?.username ? user.username : 'username'}
          articlesNumber={
            user?.myArticles?.length ? user?.myArticles?.length : 0
          }
          followersNumber={followersNumber}
          isFollowing={isFollowing}
          isMe={isMe}
          onFollow={async () => {
            try {
              if (!isAuth) {
                toast.warn('You need to sign in first', {
                  toastId: 'custom-id-1234',
                });
                return;
              }

              setIsFollowing(true);

              setFollowersNumber((prev: number) => prev + 1);

              await axios.post(`/user/follow/${params.profileName}`);
            } catch (error) {
              toast.error('Failed to follow. Try again', { toastId: '204' });
              setIsFollowing(false);
              setFollowersNumber((prev: number) => prev - 1);
            }
          }}
          onUnfollow={async () => {
            try {
              setIsFollowing(false);

              setFollowersNumber((prev: number) => prev - 1);

              await axios.post(`/user/unfollow/${params.profileName}`);
            } catch (error) {
              toast.error('Failed to unfollow. Try again', { toastId: '203' });
              setIsFollowing(true);
              setFollowersNumber((prev: number) => prev + 1);
            }
          }}
          onDelete={async () => {
            try {
              await axios.delete(`/user/`);

              navigate('/');

              dispatch(signOut());
              dispatch(clearState());
              toast.success('You deleted an account', { toastId: '201' });
            } catch {
              toast.error('Failed to delete an account. Try again', {
                toastId: '202',
              });
            }
          }}
        />
      ) : null}
      {!isLoading ? (
        <div
          style={{
            maxWidth: '640px',
            height: '1px',
            margin: '0 auto',
            backgroundColor: isDarkTheme ? '#757575' : '#dcdcdc',
            marginBottom: '48px',
          }}
        />
      ) : null}
      {isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : null}
      {userArticles.length ? (
        <div className={styles['articles']}>
          {userArticles?.map(
            (
              {
                _id,
                authorUsername,
                authorFirstName,
                authorLastName,
                authorAvatar,
                title,
                description,
                category,
                image,
                readingTime,
                likes,
                comments,
                createdAt,
              },
              index,
              array
            ) => {
              if (index + 1 === array.length) {
                return (
                  <InView
                    triggerOnce
                    onChange={(inView) => {
                      if (inView) {
                        setCurrentPage((prev: number) => prev + 1);
                      }
                    }}
                    key={index}
                  >
                    <Article
                      firstName={authorFirstName}
                      lastName={authorLastName}
                      username={authorUsername}
                      userAvatar={authorAvatar}
                      articleImage={image}
                      time={formatDate(createdAt)}
                      category={category}
                      title={title}
                      description={description}
                      likes={likes}
                      comments={comments.length}
                      readingTime={readingTime}
                      articleId={_id}
                    />
                  </InView>
                );
              }
              return (
                <Article
                  key={index}
                  firstName={authorFirstName}
                  lastName={authorLastName}
                  username={authorUsername}
                  userAvatar={authorAvatar}
                  articleImage={image}
                  time={formatDate(createdAt)}
                  category={category}
                  title={title}
                  description={description}
                  likes={likes}
                  comments={comments.length}
                  readingTime={readingTime}
                  articleId={_id}
                />
              );
            }
          )}
        </div>
      ) : isLoading ? null : (
        <h3 style={{ textAlign: 'center' }}>{`${
          isMe ? 'You' : `${user?.firstName || 'User'}`
        } hasn't written the article yet ☹️`}</h3>
      )}
    </>
  );
}

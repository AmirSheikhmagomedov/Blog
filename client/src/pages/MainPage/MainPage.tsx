import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Cookies from 'js-cookie';
import { InView } from 'react-intersection-observer';
import Article from '../../components/Article/Article';
import ArticleNav from '../../components/ArticleNav/ArticleNav';
import styles from './MainPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  fetchAllArticles,
  fetchFollowingArticles,
  fetchMyArticles,
} from '../../redux/features/articleSlice';
import formatDate from '../../utils/formatDate';

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [followingCurrentPage, setFollowingCurrentPage] = useState(1);
  const [myArticlesCurrentPage, setMyArticlesCurrentPage] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!Cookies.get('token')) setActiveTab(0);
  }, []);

  const {
    allArticles,
    followingArticles,
    myArticles,
    isLoading,
    lastFollowingArticlesResponse,
    lastAllArticlesResponse,
    lastMyArticlesResponse,
  } = useAppSelector((state) => state.article);

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) setActiveTab(0);
  }, [user]);

  useEffect(() => {
    if (
      activeTab === 0 &&
      !(currentPage * 5 === allArticles?.length) &&
      Number(allArticles?.length) % 5 === 0 &&
      lastAllArticlesResponse.length
    )
      dispatch(fetchAllArticles(currentPage));
    if (
      activeTab === 1 &&
      !(followingCurrentPage * 5 === followingArticles?.length) &&
      Number(followingArticles?.length) % 5 === 0 &&
      lastFollowingArticlesResponse.length
    )
      dispatch(fetchFollowingArticles(followingCurrentPage));
    if (
      activeTab === 2 &&
      !(myArticlesCurrentPage * 5 === myArticles?.length) &&
      Number(myArticles?.length) % 5 === 0 &&
      lastMyArticlesResponse.length
    )
      dispatch(fetchMyArticles(myArticlesCurrentPage));
  }, [
    dispatch,
    activeTab,
    currentPage,
    followingCurrentPage,
    myArticlesCurrentPage,
  ]);

  return (
    <>
      <ArticleNav
        activeTab={activeTab}
        onChange={(number: number) => {
          setActiveTab(number);
        }}
      />
      {activeTab === 0 ? (
        allArticles?.length ? (
          <div className={styles['articles']}>
            {allArticles?.map(
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
        ) : !isLoading ? (
          <h2 className={styles['articles__empty-message']}>
            There are no articles ☹️
          </h2>
        ) : null
      ) : null}
      {activeTab === 1 ? (
        followingArticles?.length ? (
          <div className={styles['articles']}>
            {followingArticles?.map(
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
                        if (inView)
                          setFollowingCurrentPage((prev: number) => prev + 1);
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
        ) : !isLoading ? (
          <h2 className={styles['articles__empty-message']}>
            There are no following articles ☹️
          </h2>
        ) : null
      ) : null}
      {activeTab === 2 ? (
        myArticles?.length ? (
          <div className={styles['articles']}>
            {myArticles?.map(
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
                        if (inView)
                          setMyArticlesCurrentPage((prev: number) => prev + 1);
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
                        comments={comments?.length}
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
        ) : !isLoading ? (
          <h2
            className={styles['articles__empty-message']}
          >{`You haven't written an article yet ☹️`}</h2>
        ) : null
      ) : null}
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : null}
    </>
  );
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import { InView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import styles from './SearchPage.module.scss';
import axios from '../../utils/axios';
import Article from '../../components/Article/Article';
import formatDate from '../../utils/formatDate';

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

export default function SearchPage() {
  const [search] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>();
  const query = search.get('query');
  const navigate = useNavigate();

  const [articles, setArticles] = useState<IArticle[]>([]);

  const fetchArticles = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `/articles/search?query=${query}&page=${page}`
      );

      setIsLoading(false);

      setArticles((prev: IArticle[]) => [...prev, ...data.articles]);
      setCount(data.count);
    } catch (error) {
      navigate('/');
      toast.error('Failed to search articles. Try again', { toastId: '009' });
    }
  };

  useEffect(() => {
    setArticles([]);
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (
      !(currentPage * 5 === articles?.length) &&
      Number(articles?.length) % 5 === 0 &&
      articles.length
    )
      fetchArticles(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [query]);

  return (
    <>
      <Helmet>
        <title>Search - Blog App</title>
      </Helmet>
      <div className={styles['search-page']} style={{ paddingTop: '26px' }}>
        {count === 0 && !articles.length ? (
          <h2 style={{ textAlign: 'center' }}>
            There are no articles for the query {`"${query}"`} ☹️
          </h2>
        ) : (
          <h2>
            Found <b>{count}</b> {count === 1 ? 'article' : 'articles'} for the
            query {`"${query}"`}
          </h2>
        )}
        {isLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : null}
        {articles.length ? (
          <div className={styles['articles']}>
            {articles?.map(
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
        ) : null}
      </div>
    </>
  );
}

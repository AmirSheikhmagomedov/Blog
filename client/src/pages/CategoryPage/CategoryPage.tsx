import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { InView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import styles from './CategoryPage.module.scss';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
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

export default function CategoryPage() {
  const { categoryName } = useParams();

  const [articles, setArticles] = useState<IArticle[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchArticles = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `/articles/category/${categoryName}?page=${page}`
      );

      setArticles((prev: IArticle[]) => [...prev, ...data]);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to get articles. Try again');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (
      !(currentPage * 5 === articles?.length) &&
      Number(articles?.length) % 5 === 0 &&
      articles.length
    )
      fetchArticles(currentPage);
  }, [currentPage]);

  return (
    <>
      <Helmet>
        <title>{`${categoryName?.charAt(0).toUpperCase()}${
          categoryName?.slice(1) || 'Category'
        } - Blog App`}</title>
      </Helmet>
      <div className={styles['category-page']}>
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '72px' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : null}
        {!isLoading && articles.length ? (
          <h1
            style={{
              fontWeight: 700,
              textAlign: 'center',
              marginTop: '72px',
              fontSize: '48px',
              marginBottom: '72px',
            }}
          >
            {capitalizeFirstLetter(`${categoryName}`)}
          </h1>
        ) : null}
        {articles.length ? (
          <div className={styles['category-page__articles']}>
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
        ) : isLoading ? null : (
          <h1 style={{ textAlign: 'center', marginTop: '72px' }}>
            There are no articles with such category ☹️
          </h1>
        )}
      </div>
    </>
  );
}

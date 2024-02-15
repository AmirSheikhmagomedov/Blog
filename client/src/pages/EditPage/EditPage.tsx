import { useContext, useState, ChangeEvent, useEffect } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useNavigate, useParams } from 'react-router-dom';
import hljs from 'highlight.js';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import ReactHelmet, { Helmet } from 'react-helmet';
import { DarkThemeContext } from '../../context/DarkThemeProvider';
import styles from '../WritePage/WritePage.module.scss';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import axios from '../../utils/axios';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearState } from '../../redux/features/articleSlice';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['code-block'],
    ['clean'],
  ],
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'code-block',
  'clean',
];

const categories = [
  'Art',
  'Books',
  'Business',
  'Entertainment',
  'Food',
  'Health',
  'Life',
  'Magazine',
  'Politics',
  'Real Estate',
  'Science',
  'Sport',
  'Style',
  'Tech',
  'Travel',
  'World',
];

hljs.configure({
  languages: [
    'javascript',
    'python',
    'c',
    'c++',
    'java',
    'HTML',
    'css',
    'matlab',
  ],
});

export default function EditPage() {
  const { isDarkTheme } = useContext(DarkThemeContext);

  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState('');
  const [articleTitleValue, setArticleTitleValue] = useState('');
  const [articleDescriptionValue, setArticleDescriptionValue] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleTitleCount, setArticleTitleCount] = useState<number>(80);
  const [articleDescriptionCount, setArticleDescriptionCount] =
    useState<number>(160);

  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { articleId } = useParams();

  const { user } = useAppSelector((state) => state.user);

  const isMyArticle = user?.myArticles?.find(
    (article) => article === articleId
  );

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fetchArticle = async () => {
    try {
      if (!isMyArticle) {
        navigate('/');
        toast.error(`You can't edit other people's articles`);
        return;
      }
      const { data } = await axios.get(`/article/${articleId}`);

      setArticleTitleValue(data.article.title);
      setArticleDescriptionValue(data.article.description);
      setSelectedCategory(data.article.category);
      setArticleContent(data.article.content);
      setPreview(
        `${import.meta.env.VITE_REACT_BACKEND_ASSETS}${data.article?.image}`
      );
    } catch (error) {
      toast.error('Failed to edit an article. Try again', { toastId: '9972' });
      navigate('/');
    }
  };

  const editArticle = async () => {
    try {
      if (
        !articleTitleValue ||
        !articleDescriptionValue ||
        !selectedCategory ||
        !articleContent ||
        (!image && !preview)
      ) {
        toast.error('You need to provide all article information', {
          toastId: '339',
        });
        return;
      }

      if (articleTitleValue.length < 12) {
        toast.error('Minimum length of title is 12');
        return;
      }

      if (articleDescriptionValue.length < 24) {
        toast.error('Minimum length of description is 24');
        return;
      }

      const data: any = new FormData();
      data.append('title', articleTitleValue);
      data.append('description', articleDescriptionValue);
      data.append('category', selectedCategory);
      data.append('content', articleContent);
      if (image) data.append('image', image);

      await axios.patch(`/article/${articleId}`, data);

      navigate('/', {});

      dispatch(clearState());

      toast.success('Article edited');
    } catch (error) {
      toast.error('Failed to edit an article. Try again', { toastId: '560' });
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  return (
    <>
      <ReactHelmet
        link={[
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css`,
          },
        ]}
      />
      <Helmet>
        <title>Edit an article - Blog App</title>
      </Helmet>
      {!user ? (
        <h1 style={{ textAlign: 'center' }}>
          You need to sign in to write an article
        </h1>
      ) : null}

      {user ? (
        <div className={styles['write-page']}>
          <h1 className={styles['write-page__title']}>Edit article</h1>
          {!preview ? (
            <div
              className={styles['write-page__upload-image']}
              style={{ border: isDarkTheme ? '1px dashed #b8b6b6' : '' }}
            >
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.4 0H1.6C0.72 0 0 0.72 0 1.6V16C0 16.88 0.72 17.6 1.6 17.6H22.4C23.28 17.6 24 16.88 24 16V1.6C24 0.72 23.28 0 22.4 0ZM22.4 1.6V8.64C20.72 7.12 18 4.88 16.24 4.88H16.16C14.72 4.88 13.36 6.32 12 7.76C11.12 8.64 10.24 9.52 9.68 9.84C9.12 10.08 7.84 9.92 6.8 9.84C5.68 9.76 4.64 9.6 3.84 9.84C3.28 9.84 2.4 10.32 1.6 10.72V1.6H22.4ZM1.6 16V12.56C2.56 12 3.68 11.36 4.16 11.28C4.72 11.12 5.68 11.28 6.64 11.36C8 11.52 9.36 11.6 10.32 11.28C11.28 10.88 12.24 9.92 13.2 8.88C14.24 7.84 15.44 6.56 16.24 6.48C17.44 6.48 20.4 8.96 22.32 10.88V16H1.6Z"
                  fill="#757575"
                />
                <path
                  d="M8.87966 10.3201C10.2397 10.3201 11.3597 9.20011 11.3597 7.84011C11.3597 6.48011 10.2397 5.36011 8.87966 5.36011C7.51966 5.36011 6.39966 6.48011 6.39966 7.84011C6.39966 9.20011 7.51966 10.3201 8.87966 10.3201ZM8.87966 6.96011C9.35966 6.96011 9.75966 7.36011 9.75966 7.84011C9.75966 8.32011 9.35966 8.72011 8.87966 8.72011C8.39966 8.72011 7.99966 8.32011 7.99966 7.84011C7.99966 7.36011 8.39966 6.96011 8.87966 6.96011Z"
                  fill="#757575"
                />
              </svg>

              <input
                className={styles['write-page__upload-image-input']}
                type="file"
                onChange={handleFileChange}
                accept=".png, .jpg, .jpeg"
              />
              <p
                style={{
                  color: isDarkTheme ? '#9b9b9b' : '',
                  fontSize: '16px',
                  paddingTop: '4px',
                }}
              >
                Upload article image
              </p>
            </div>
          ) : null}
          {preview ? (
            <div className={styles['write-page__image-preview']}>
              <img src={preview} alt="" crossOrigin="anonymous" />
              <button
                className={styles['write-page-delete-button']}
                onClick={() => {
                  setPreview('');
                  setImage(undefined);
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
          <div className={styles['write-page__article-title']}>
            <input
              type="text"
              className={
                styles[
                  isDarkTheme
                    ? 'write-page__article-title-input-dark'
                    : 'write-page__article-title-input'
                ]
              }
              placeholder="Article title"
              maxLength={80}
              value={articleTitleValue}
              onChange={(e) => {
                setArticleTitleValue(e.target.value);
                if (articleTitleCount >= 0)
                  setArticleTitleCount(80 - e.target.value.length);
              }}
            />
            <p
              className={styles['write-page__characters-left']}
              style={{ color: isDarkTheme ? '#9b9b9b' : '#757575' }}
            >
              {articleTitleCount}{' '}
              {articleTitleCount === 1 ? 'character' : 'characters'} left
            </p>
          </div>
          <div className={styles['write-page__article-description']}>
            <textarea
              className={
                styles[
                  isDarkTheme
                    ? 'write-page__article-description-input-dark'
                    : 'write-page__article-description-input'
                ]
              }
              placeholder="Article description"
              value={articleDescriptionValue}
              maxLength={160}
              onChange={(e) => {
                setArticleDescriptionValue(e.target.value);
                if (articleDescriptionCount >= 0)
                  setArticleDescriptionCount(160 - e.target.value.length);
              }}
            />
            <p
              className={styles['write-page__characters-left']}
              style={{ color: isDarkTheme ? '#9b9b9b' : '#757575' }}
            >
              {articleDescriptionCount}{' '}
              {articleDescriptionCount === 1 ? 'character' : 'characters'} left
            </p>
          </div>
          <div className={styles['write-page__category']}>
            <button
              className={styles['write-page__category-button']}
              style={{ border: isDarkTheme ? '1px solid #868686' : '' }}
              type="button"
              onClick={() => {
                setIsCategoryOpen((prev: boolean) => !prev);
              }}
            >
              {selectedCategory ? (
                <p style={{ color: isDarkTheme ? '#ffffff' : '#292929' }}>
                  {capitalizeFirstLetter(selectedCategory)}
                </p>
              ) : (
                <p style={{ color: isDarkTheme ? '#9b9b9b' : '' }}>
                  Choose category
                </p>
              )}
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
            </button>
            {isCategoryOpen ? (
              <ClickAwayListener
                onClickAway={() => {
                  setIsCategoryOpen(false);
                }}
              >
                <div
                  className={
                    styles[
                      isDarkTheme
                        ? 'write-page__options-dark'
                        : 'write-page__options'
                    ]
                  }
                  style={{ border: isDarkTheme ? '1px solid #757575' : '' }}
                >
                  {categories.map((category: string, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        styles[
                          isDarkTheme
                            ? 'write-page__option-dark'
                            : 'write-page__option'
                        ]
                      }
                      onClick={() => {
                        setSelectedCategory(category.toLowerCase());
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </ClickAwayListener>
            ) : null}
          </div>
          <ReactQuill
            theme="snow"
            value={articleContent}
            onChange={setArticleContent}
            modules={modules}
            formats={formats}
            style={{
              width: '700px',
              height: '400px',
              marginBottom: '100px',
            }}
          />
          <button
            className={
              styles[
                isDarkTheme
                  ? 'write-page__create-button-dark'
                  : 'write-page__create-button'
              ]
            }
            type="button"
            onClick={editArticle}
          >
            Edit an article
          </button>
        </div>
      ) : null}
    </>
  );
}

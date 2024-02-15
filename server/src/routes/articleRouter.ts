import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.js'

import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getFollowingArticles,
  getMyArticles,
  getOneArticle,
  likeArticle,
  unlikeArticle,
  commentArticle,
  getArticleComments,
  deleteComment,
  editArticle,
  searchArticle,
  getUserArticles,
  getArticlesByCategory,
} from '../controllers/articleController.js'

export const articleRouter = Router()

articleRouter.route('/article').post(isAuth, createArticle)
articleRouter.route('/article/:articleId').patch(isAuth, editArticle)
articleRouter.route('/article/:articleId').delete(isAuth, deleteArticle)
articleRouter.route('/article/:articleId').get(getOneArticle)
articleRouter.route('/articles/category/:category').get(getArticlesByCategory)
articleRouter.route('/articles').get(getAllArticles)
articleRouter.route('/articles/search').get(searchArticle)
articleRouter.route('/articles/following').get(isAuth, getFollowingArticles)
articleRouter.route('/articles/my').get(isAuth, getMyArticles)
articleRouter.route('/articles/:username').get(getUserArticles)
articleRouter.route('/article/like/:articleId').post(isAuth, likeArticle)
articleRouter.route('/article/unlike/:articleId').post(isAuth, unlikeArticle)
articleRouter.route('/article/comment/:articleId').post(isAuth, commentArticle)
articleRouter.route('/article/:articleId/comments').get(getArticleComments)
articleRouter.route('/article/:articleId/comments/delete/:commentId').delete(isAuth, deleteComment)

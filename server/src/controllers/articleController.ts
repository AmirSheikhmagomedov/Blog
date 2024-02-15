import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import User from '../models/User.js'
import Article from '../models/Article.js'
import Comment from '../models/Comment.js'
import readingTime from 'reading-time'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, description, content, category } = req.body

    if (!title || !description || !content || !category) return res.status(400).json({ error: 'Data is incomplete' })

    const me = await User.findById(req.userId)

    let imageName = ''

    if (req.files) {
      const image = req.files.image as UploadedFile

      imageName = `${image.name.split('.')[0]}_${Date.now().toString()}.${image.name.split('.')[1]}`

      image.mv(path.join(__dirname, '..', '..', 'public/assets', imageName))
    }

    const newArticle = new Article({
      authorUsername: me?.username,
      authorFirstName: me?.firstName,
      authorLastName: me?.lastName,
      authorId: me?._id,
      authorAvatar: me?.avatar || '',
      title,
      description,
      content,
      category,
      readingTime: readingTime(content).text,
      image: imageName,
    })

    await newArticle.save()

    await User.findByIdAndUpdate(req.userId, {
      $push: { myArticles: newArticle._id },
    })

    res.status(201).json({ message: 'Article created' })
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: 'Failed to create an article. Try again' })
  }
}

export const editArticle = async (req: Request, res: Response) => {
  try {
    const { title, description, content, category } = req.body

    if (!title || !description || !content || !category) return res.status(400).json({ error: 'Data is incomplete' })

    const { articleId } = req.params

    const foundArticle = await Article.findById(articleId)

    let imageName = ''

    if (req.files) {
      if (foundArticle?.image) fs.unlinkSync(path.join(__dirname, '..', '..', 'public/assets', foundArticle.image))

      const image = req.files.image as UploadedFile

      imageName = `${image.name.split('.')[0]}_${Date.now().toString()}.${image.name.split('.')[1]}`

      image.mv(path.join(__dirname, '..', '..', 'public/assets', imageName))
    }

    if (foundArticle) {
      foundArticle.title = title
      foundArticle.description = description
      foundArticle.content = content
      foundArticle.category = category
      foundArticle.readingTime = readingTime(content).text
      foundArticle.image = imageName ? imageName : foundArticle.image
    }

    await foundArticle?.save()

    res.status(200).json({ message: 'Article edited' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to edit an article. Try again' })
  }
}

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params

    const deletedArticle = await Article.findByIdAndDelete(articleId)

    if (!deletedArticle) return res.status(404).json({ error: 'Article was not found' })

    if (deletedArticle?.image) {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'public/assets', deletedArticle.image))
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { myArticles: deletedArticle._id },
    })

    res.status(200).json({ message: 'Article deleted' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to delete an article. Try again' })
  }
}

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const foundArticles = await Article.find()
      .sort('-createdAt')
      .limit(5)
      .skip((Number(req.query.page) - 1) * 5)

    res.status(200).json(foundArticles)
  } catch (error) {
    res.status(409).json({ error: 'Failed to get articles. Try again' })
  }
}

export const searchArticle = async (req: Request, res: Response) => {
  try {
    const foundArticles = await Article.find({ title: new RegExp(`${req.query.query}`, 'ig') })
      .sort('-createdAt')
      .limit(5)
      .skip((Number(req.query.page) - 1) * 5)

    const articlesCount = (await Article.find({ title: new RegExp(`${req.query.query}`, 'ig') })).length

    res.status(200).json({ articles: foundArticles, count: articlesCount })
  } catch (error) {
    res.status(409).json({ error: 'Failed to search articles. Try again' })
  }
}

export const getUserArticles = async (req: Request, res: Response) => {
  try {
    const foundArticles = await Article.find({ authorUsername: req.params.username })
      .sort('-createdAt')
      .limit(5)
      .skip((Number(req.query.page) - 1) * 5)

    res.status(200).json(foundArticles)
  } catch (error) {
    res.status(409).json({ error: 'Failed to get user articles. Try again' })
  }
}

export const getFollowingArticles = async (req: Request, res: Response) => {
  try {
    const me = await User.findById(req.userId)

    const page = Number(req.query.page)

    let articles

    if (me?.following)
      articles = await Promise.all(
        me.following.map((followingId) => {
          return Article.find({ authorId: followingId })
        }),
      )

    const flattedArticles = articles
      ?.flat(1)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
      .slice((page - 1) * 5, page * 5)

    res.status(200).json(flattedArticles)
  } catch (error) {
    res.status(409).json({ error: 'Failed to get following articles. Try again' })
  }
}

export const getMyArticles = async (req: Request, res: Response) => {
  try {
    const foundArticles = await Article.find({ authorId: req.userId })
      .sort('-createdAt')
      .limit(5)
      .skip((Number(req.query.page) - 1) * 5)

    res.status(200).json(foundArticles)
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: 'Failed to get your articles. Try again' })
  }
}

export const getOneArticle = async (req: Request, res: Response) => {
  try {
    const foundArticle = await Article.findById(req.params.articleId)

    if (!foundArticle) return res.status(404).json({ error: 'Article does not exist' })

    let isMy = false
    let isLiked = false

    if (req.cookies.token) {
      const tokenId = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).id

      console.log(tokenId)

      isMy = foundArticle.authorId == tokenId

      const me = await User.findById(tokenId)

      if (me?.likedArticles)
        isLiked = me?.likedArticles.some((articleId) => String(articleId) === String(foundArticle._id))
    }

    res.status(200).json({ article: foundArticle, isMy: isMy, isLiked: isLiked })
  } catch (error) {
    console.log(error)
    res.status(409).json({ error: 'Failed to get an article. Try again' })
  }
}

export const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const foundArticles = await Article.find({ category: req.params.category })
      .sort('-createdAt')
      .limit(5)
      .skip((Number(req.query.page) - 1) * 5)

    res.status(200).json(foundArticles)
  } catch (error) {
    res.status(409).json({ error: 'Failed to get articles. Try again' })
  }
}

export const likeArticle = async (req: Request, res: Response) => {
  try {
    const me = await User.findById(req.userId)

    const isLiked = me?.likedArticles.some((articleId) => articleId.toString() == req.params.articleId)

    if (isLiked) return res.status(409).json({ error: 'You cannot like article twice' })

    const foundArticle = await Article.findByIdAndUpdate(req.params.articleId, {
      $inc: { likes: 1 },
    })

    if (!foundArticle) return res.status(404).json({ error: 'Article was not found' })

    await User.findByIdAndUpdate(req.userId, {
      $push: { likedArticles: foundArticle._id },
    })

    res.status(200).json({ message: 'Liked' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to like an article. Try again' })
  }
}

export const unlikeArticle = async (req: Request, res: Response) => {
  try {
    const me = await User.findById(req.userId)

    const isLiked = me?.likedArticles.some((articleId) => articleId.toString() == req.params.articleId)

    if (!isLiked) return res.status(409).json({ error: 'You cannot unlike article twice' })

    const foundArticle = await Article.findByIdAndUpdate(req.params.articleId, {
      $inc: { likes: -1 },
    })

    if (!foundArticle) return res.status(404).json({ error: 'Article was not found' })

    await User.findByIdAndUpdate(req.userId, {
      $pull: { likedArticles: foundArticle._id },
    })

    res.status(200).json({ message: 'Unliked' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to unlike an article. Try again' })
  }
}

export const commentArticle = async (req: Request, res: Response) => {
  try {
    const { text } = req.body

    if (!text) return res.status(400).json({ error: 'Data is incomplete' })

    const me = await User.findById(req.userId)

    const newComment = new Comment({
      authorUsername: me?.username,
      authorId: me?._id,
      articleId: req.params.articleId,
      authorFirstName: me?.firstName,
      authorLastName: me?.lastName,
      authorAvatar: me?.avatar || '',
      text,
    })

    await newComment.save()

    await Article.findByIdAndUpdate(req.params.articleId, {
      $push: { comments: newComment._id },
    })

    res.status(201).json({ newComment, message: 'Commented' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to comment an article. Try again' })
  }
}

export const getArticleComments = async (req: Request, res: Response) => {
  try {
    const foundArticle = await Article.findById(req.params.articleId)

    let articleComments

    if (foundArticle?.comments) {
      articleComments = await Promise.all(foundArticle.comments.map((commentId) => Comment.findById(commentId)))
    }

    res.status(200).json(articleComments?.reverse())
  } catch (error) {
    res.status(409).json({ error: 'Failed to get article comments. Try again' })
  }
}

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId)

    await Article.findByIdAndUpdate(req.params.articleId, { $pull: { comments: deletedComment?._id } })

    res.status(200).json({ message: 'Deleted' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to delete comment. Try again' })
  }
}

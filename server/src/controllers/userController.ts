import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { UploadedFile } from 'express-fileupload'
import fs from 'fs'
import Article from '../models/Article.js'
import Comment from '../models/Comment.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const signUp = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password } = req.body

    if (!firstName || !lastName || !username || !password) return res.status(400).json({ error: 'Data is incomplete' })

    const isUsed = await User.findOne({ username })

    if (isUsed) return res.status(409).json({ error: 'Username is already taken' })

    let imageName = ''

    if (req.files) {
      const image = req.files.image as UploadedFile

      imageName = `${image.name.split('.')[0]}_${Date.now().toString()}.${image.name.split('.')[1]}`

      image.mv(path.join(__dirname, '..', '..', 'public/assets', imageName))
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hash,
      avatar: imageName,
    })

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '30d' },
    )

    await newUser.save()

    res.cookie('token', token, {
      maxAge: 170710920000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    const userClone = JSON.parse(JSON.stringify(newUser))

    delete userClone.password

    res.status(201).json({ user: userClone, message: 'You signed up' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to sign up. Try again' })
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const foundUser = await User.findOne({ username })

    if (!foundUser) return res.status(404).json({ error: 'User was not found' })

    const isMatch = await bcrypt.compare(password, foundUser.password)

    if (!isMatch) return res.status(409).json({ error: 'Username or password is incorrect' })

    const token = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '30d' },
    )

    res.cookie('token', token, {
      maxAge: 170710920000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    const userClone = JSON.parse(JSON.stringify(foundUser))

    delete userClone.password

    res.status(200).json({ user: userClone, message: 'You signed in' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to sign in. Try again' })
  }
}

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' })

    res.status(200).json({ message: 'You signed out' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to sign out. Try again' })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findById(req.userId)

    if (!foundUser) return res.status(404).json({ message: 'User was not found' })

    const token = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '30d' },
    )

    res.cookie('token', token, {
      maxAge: 170710920000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    res.status(200).json(foundUser)
  } catch (error) {
    res.status(409).json({ error: 'Failed to get profile' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    if (!username) return res.status(400).json({ error: 'Data is incomplete' })

    const foundUser = await User.findOne({ username })

    if (!foundUser) return res.status(404).json({ error: 'User was not found' })

    let isMe = false
    let isFollowing = false

    if (req.cookies.token) {
      const tokenId = JSON.parse(Buffer.from(req.cookies.token.split('.')[1], 'base64').toString()).id

      isMe = foundUser._id == tokenId
      isFollowing = foundUser.followers.some((followerId) => followerId == tokenId)
    }

    const userClone = JSON.parse(JSON.stringify(foundUser))

    delete userClone.password

    res.status(200).json({ user: userClone, isMe, isFollowing })
  } catch (error) {
    res.status(409).json({ error: 'Failed to view profile. Try again' })
  }
}

export const followUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const me = await User.findById(req.userId)

    const foundUser = await User.findOne({ username })

    if (foundUser) if (!foundUser) return res.status(404).json({ error: 'User was not found' })

    await User.findOneAndUpdate(
      { username },
      {
        $push: { followers: me?._id },
      },
    )

    await User.findByIdAndUpdate(req.userId, {
      $push: { following: foundUser?._id },
    })

    res.status(200).json({ message: 'Followed' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to follow. Try again' })
  }
}

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const me = await User.findById(req.userId)

    const foundUser = await User.findOneAndUpdate(
      { username },
      {
        $pull: { followers: me?._id },
      },
    )

    if (!foundUser) return res.status(404).json({ error: 'User was not found' })

    await User.findByIdAndUpdate(req.userId, {
      $pull: { following: foundUser._id },
    })

    res.status(200).json({ message: 'Unfolllowed' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to unfollow. Try again' })
  }
}

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username } = req.body

    if (!firstName || !lastName || !username) return res.status(400).json({ error: 'Data is incomplete' })

    const foundUser = await User.findById(req.userId)

    if (foundUser?.username !== username) {
      const isUsed = await User.findOne({ username: username })

      if (isUsed) return res.status(409).json({ error: 'Username is already taken' })
    }

    if (!foundUser) return res.status(404).json({ error: 'User was not found' })

    let imageName = ''

    if (req.files) {
      if (foundUser?.avatar) fs.unlinkSync(path.join(__dirname, '..', '..', 'public/assets', foundUser.avatar))

      const image = req.files.image as UploadedFile

      imageName = `${image.name.split('.')[0]}_${Date.now().toString()}.${image.name.split('.')[1]}`

      image.mv(path.join(__dirname, '..', '..', 'public/assets', imageName))
    }

    if (!req.files) {
      if (foundUser?.avatar) fs.unlinkSync(path.join(__dirname, '..', '..', 'public/assets', foundUser.avatar))
    }

    await Article.updateOne(
      { authorUsername: foundUser.username },
      {
        $set: { authorUsername: username, authorAvatar: imageName ? imageName : '' },
      },
    )

    await Comment.updateOne(
      { authorUsername: foundUser.username },
      {
        $set: { authorUsername: username, authorAvatar: imageName ? imageName : '' },
      },
    )

    if (foundUser) {
      foundUser.firstName = firstName
      foundUser.lastName = lastName
      foundUser.username = username
      foundUser.avatar = imageName
    }

    console.log(foundUser.username)

    await foundUser.save()

    res.status(200).json({ message: 'Profile edited' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to edit profile. Try again' })
  }
}

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId)

    if (!deletedUser) return res.status(404).json({ error: 'User was not found' })

    if (deletedUser.avatar) {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'public/assets', deletedUser.avatar))
    }

    if (deletedUser.myArticles) {
      deletedUser.myArticles.map(async (articleId) => await Article.findByIdAndDelete(articleId))
    }

    res.status(200).json({ message: 'Profile deleted' })
  } catch (error) {
    res.status(409).json({ error: 'Failed to delete. Try again' })
  }
}

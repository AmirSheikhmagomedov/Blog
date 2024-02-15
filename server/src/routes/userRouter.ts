import { Router } from 'express'
import {
  signUp,
  signIn,
  signOut,
  getProfile,
  followUser,
  unfollowUser,
  deleteProfile,
  getMe,
  editProfile,
} from '../controllers/userController.js'
import { isAuth } from '../middlewares/isAuth.js'

export const userRouter = Router()

userRouter.route('/signup').post(signUp)
userRouter.route('/signin').post(signIn)
userRouter.route('/signout').get(isAuth, signOut)
userRouter.route('/me').get(isAuth, getMe)
userRouter.route('/:username').get(getProfile)
userRouter.route('/follow/:username').post(isAuth, followUser)
userRouter.route('/unfollow/:username').post(isAuth, unfollowUser)
userRouter.route('/').delete(isAuth, deleteProfile)
userRouter.route('/').patch(isAuth, editProfile)

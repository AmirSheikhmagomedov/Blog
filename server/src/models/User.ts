import { Schema, Types, model } from 'mongoose'

interface IUser {
  firstName: string
  lastName: string
  username: string
  password: string
  avatar: string
  myArticles: [Types.ObjectId]
  likedArticles: [Types.ObjectId]
  followers: [Types.ObjectId]
  following: [Types.ObjectId]
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      max: 16,
      min: 3,
    },
    lastName: {
      type: String,
      required: true,
      max: 16,
      min: 4,
    },
    username: {
      type: String,
      required: true,
      max: 16,
      min: 4,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
      max: 20,
    },
    avatar: {
      type: String,
      default: '',
    },
    myArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    likedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
)

export default model('User', UserSchema)

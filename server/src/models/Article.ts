import { Schema, model, Types } from 'mongoose'

export interface IArticle {
  authorUsername: string
  authorFirstName: string
  authorLastName: string
  authorId: Types.ObjectId
  authorAvatar: string
  title: string
  description: string
  content: string
  category: string
  image: string
  readingTime: string
  likes: number
  comments: [Types.ObjectId]
  createdAt: string
}

const ArticleSchema = new Schema<IArticle>(
  {
    authorUsername: {
      type: String,
      required: true,
    },
    authorFirstName: {
      type: String,
      required: true,
    },
    authorLastName: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      max: 80,
      min: 12,
    },
    description: {
      type: String,
      required: true,
      max: 160,
      min: 24,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    readingTime: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
)

export default model('Article', ArticleSchema)

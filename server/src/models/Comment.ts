import { Schema, Types, model } from 'mongoose'

export interface IComment {
  authorUsername: string
  authorId: Types.ObjectId
  articleId: Types.ObjectId
  authorFirstName: string
  authorLastName: string
  authorAvatar: string
  text: string
  createdAt: string
}

const CommentSchema = new Schema<IComment>(
  {
    authorUsername: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    authorAvatar: {
      type: String,
    },

    authorFirstName: {
      type: String,
      required: true,
    },
    authorLastName: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      min: 4,
    },
  },
  { timestamps: true },
)

export default model('Comment', CommentSchema)

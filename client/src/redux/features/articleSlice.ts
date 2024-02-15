import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface Article {
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

interface IArticleState {
  allArticles: Article[] | null;
  followingArticles: Article[] | null;
  myArticles: Article[] | null;
  lastAllArticlesResponse: Article[] | [] | number[];
  lastFollowingArticlesResponse: Article[] | [] | number[];
  lastMyArticlesResponse: Article[] | [] | number[];
  isLoading: boolean | null;
  message: string;
  error: string;
}

export const fetchAllArticles = createAsyncThunk(
  'article/fetchAllArticles',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/articles?page=${page}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchFollowingArticles = createAsyncThunk(
  'article/fetchFollowingArticles',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/articles/following?page=${page}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchMyArticles = createAsyncThunk(
  'article/fetchMyArticles',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/articles/my?page=${page}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const initialState: IArticleState = {
  allArticles: [],
  followingArticles: [],
  myArticles: [],
  lastAllArticlesResponse: [1],
  lastFollowingArticlesResponse: [1],
  lastMyArticlesResponse: [1],
  isLoading: false,
  message: '',
  error: '',
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearState: (state) => {
      state.allArticles = [];
      state.followingArticles = [];
      state.myArticles = [];
    },
    incrementLikes: (state, action: PayloadAction<string>) => {
      if (state.allArticles) {
        const objIndex = state.allArticles.findIndex(
          (obj) => obj._id === action.payload
        );
        if (state.allArticles[objIndex]) state.allArticles[objIndex].likes += 1;
      }

      if (state.followingArticles) {
        const objIndex = state.followingArticles.findIndex(
          (obj) => obj._id === action.payload
        );
        if (state.followingArticles[objIndex])
          state.followingArticles[objIndex].likes += 1;
      }
    },
    decrementLikes: (state, action: PayloadAction<string>) => {
      if (state.allArticles) {
        const objIndex = state.allArticles.findIndex(
          (obj) => obj._id === action.payload
        );
        if (state.allArticles[objIndex]) state.allArticles[objIndex].likes -= 1;
      }

      if (state.followingArticles) {
        const objIndex = state.followingArticles.findIndex(
          (obj) => obj._id === action.payload
        );
        if (state.followingArticles[objIndex])
          state.followingArticles[objIndex].likes -= 1;
      }
    },
    incrementComment: (state, action) => {
      if (state.allArticles) {
        const objIndex = state.allArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.allArticles[objIndex])
          state.allArticles[objIndex].comments.push(action.payload.commentId);
      }
      if (state.followingArticles) {
        const objIndex = state.followingArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.followingArticles[objIndex])
          state.followingArticles[objIndex].comments.push(
            action.payload.commentId
          );
      }
      if (state.myArticles) {
        const objIndex = state.myArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.myArticles[objIndex])
          state.myArticles[objIndex].comments.push(action.payload.commentId);
      }
    },
    decrementComment: (state, action) => {
      if (state.allArticles) {
        const objIndex = state.allArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.allArticles[objIndex])
          state.allArticles[objIndex].comments = state.allArticles[
            objIndex
          ].comments.filter(
            (commentId) => commentId !== action.payload.commentId
          );
      }
      if (state.followingArticles) {
        const objIndex = state.followingArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.followingArticles[objIndex])
          state.followingArticles[objIndex].comments = state.followingArticles[
            objIndex
          ].comments.filter(
            (commentId) => commentId !== action.payload.commentId
          );
      }
      if (state.myArticles) {
        const objIndex = state.myArticles.findIndex(
          (obj) => obj._id === action.payload.articleId
        );
        if (state.myArticles[objIndex])
          state.myArticles[objIndex].comments = state.myArticles[
            objIndex
          ].comments.filter(
            (commentId) => commentId !== action.payload.commentId
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastAllArticlesResponse = action.payload;
        if (action.payload.length) state.allArticles?.push(...action.payload);
        state.error = '';
      })
      .addCase(
        fetchAllArticles.rejected.type,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(fetchFollowingArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFollowingArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFollowingArticlesResponse = action.payload;
        if (action.payload.length)
          state.followingArticles?.push(...action.payload);
        state.error = '';
      })
      .addCase(
        fetchFollowingArticles.rejected.type,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(fetchMyArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastMyArticlesResponse = action.payload;
        if (action.payload.length) state.myArticles?.push(...action.payload);
        state.error = '';
      })
      .addCase(
        fetchMyArticles.rejected.type,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearState,
  incrementLikes,
  decrementLikes,
  incrementComment,
  decrementComment,
} = articleSlice.actions;

export default articleSlice.reducer;

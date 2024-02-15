import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

import axios from '../../utils/axios';

export interface User {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  myArticles?: string[];
  likedArticles?: string[];
  followers?: string[];
  following?: string[];
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Response {
  user: User;
  message: string;
}

export interface SignUpBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  image: File;
}

export interface SignInBody {
  username: string;
  password: string;
}

interface IUserState {
  user: User | null;
  isLoading: boolean | null;
  message: string | null;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isLoading: false,
  message: '',
  error: '',
};

export const signUp = createAsyncThunk(
  'user/signUp',
  async (params: SignUpBody, { rejectWithValue }) => {
    try {
      const response = await axios.post('/user/signup', params);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const signIn = createAsyncThunk(
  'user/signIn',
  async (params: SignInBody, { rejectWithValue }) => {
    try {
      const response = await axios.post('/user/signin', params);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getMe = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user/me');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.isLoading = null;
      state.message = 'You signed out';
      state.error = null;
    },
    deleteMessage: (state) => {
      state.message = null;
    },
    deleteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<Response>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.error = '';
      })
      .addCase(signUp.rejected.type, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<Response>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.error = '';
      })
      .addCase(signIn.rejected.type, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected.type, (state) => {
        state.isLoading = false;
      });
  },
});

export const checkAuth = (state: RootState) => Boolean(state.user.user);

export const { signOut, deleteMessage, deleteError } = userSlice.actions;

export default userSlice.reducer;

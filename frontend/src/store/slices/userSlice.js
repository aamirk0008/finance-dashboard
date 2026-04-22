import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersApi, updateRoleApi, updateStatusApi, deleteUserApi } from '../../api/userApi';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await getUsersApi(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const updateRole = createAsyncThunk('users/updateRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await updateRoleApi(id, role);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update role');
  }
});

export const updateStatus = createAsyncThunk('users/updateStatus', async ({ id, isActive }, { rejectWithValue }) => {
  try {
    const res = await updateStatusApi(id, isActive);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    pagination: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u._id !== action.payload);
      });
  }
});

export default userSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSummaryApi, getCategoriesApi, getTrendsApi, getRatioApi } from '../../api/dashboardApi';

export const fetchSummary = createAsyncThunk('dashboard/summary', async (_, { rejectWithValue }) => {
  try {
    const res = await getSummaryApi();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchCategories = createAsyncThunk('dashboard/categories', async (_, { rejectWithValue }) => {
  try {
    const res = await getCategoriesApi();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchTrends = createAsyncThunk('dashboard/trends', async (year, { rejectWithValue }) => {
  try {
    const res = await getTrendsApi(year);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchRatio = createAsyncThunk('dashboard/ratio', async (_, { rejectWithValue }) => {
  try {
    const res = await getRatioApi();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    categories: [],
    trends: null,
    ratio: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchSummary.pending, pending)
      .addCase(fetchSummary.fulfilled, (state, action) => { state.loading = false; state.summary = action.payload; })
      .addCase(fetchSummary.rejected, rejected)

      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected, rejected)

      .addCase(fetchTrends.pending, pending)
      .addCase(fetchTrends.fulfilled, (state, action) => { state.loading = false; state.trends = action.payload; })
      .addCase(fetchTrends.rejected, rejected)

      .addCase(fetchRatio.pending, pending)
      .addCase(fetchRatio.fulfilled, (state, action) => { state.loading = false; state.ratio = action.payload; })
      .addCase(fetchRatio.rejected, rejected);
  }
});

export default dashboardSlice.reducer;
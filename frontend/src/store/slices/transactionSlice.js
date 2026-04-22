import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTransactionsApi, createTransactionApi, updateTransactionApi, deleteTransactionApi } from '../../api/transactionApi';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await getTransactionsApi(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
  }
});

export const createTransaction = createAsyncThunk('transactions/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createTransactionApi(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create transaction');
  }
});

export const updateTransaction = createAsyncThunk('transactions/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateTransactionApi(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update transaction');
  }
});

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteTransactionApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete transaction');
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    pagination: null,
    filters: { type: '', category: '', startDate: '', endDate: '', page: 1, limit: 10 },
    loading: false,
    error: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { type: '', category: '', startDate: '', endDate: '', page: 1, limit: 10 };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  }
});

export const { setFilters, setPage, clearFilters } = transactionSlice.actions;
export default transactionSlice.reducer;
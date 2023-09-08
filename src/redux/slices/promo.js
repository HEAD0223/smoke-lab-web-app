import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPromos = createAsyncThunk('promo/fetchPromos', async () => {
	const { data } = await axios.get('/promo');
	return data;
});

const initialState = {
	promos: {
		items: [],
		status: 'loading',
	},
};

const promosSlice = createSlice({
	name: 'promos',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPromos.pending]: (state) => {
			state.promos.status = 'loading';
		},
		[fetchPromos.fulfilled]: (state, action) => {
			state.promos.items = action.payload;
			state.promos.status = 'loaded';
		},
		[fetchPromos.rejected]: (state) => {
			state.promos.items = [];
			state.promos.status = 'error';
		},
	},
});

export const promosReducer = promosSlice.reducer;

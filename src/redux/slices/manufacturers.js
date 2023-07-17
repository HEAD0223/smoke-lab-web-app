import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchManufacturers = createAsyncThunk('manufacturer/fetchManufacturers', async () => {
	const { data } = await axios.get('/manufacturer');
	return data;
});

const initialState = {
	manufacturers: {
		items: [],
		status: 'loading',
	},
};

const manufacturersSlice = createSlice({
	name: 'manufacturers',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchManufacturers.pending]: (state) => {
			state.manufacturers.status = 'loading';
		},
		[fetchManufacturers.fulfilled]: (state, action) => {
			state.manufacturers.items = action.payload;
			state.manufacturers.status = 'loaded';
		},
		[fetchManufacturers.rejected]: (state) => {
			state.manufacturers.items = [];
			state.manufacturers.status = 'error';
		},
	},
});

export const manufacturersReducer = manufacturersSlice.reducer;

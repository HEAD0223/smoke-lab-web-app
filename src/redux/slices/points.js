import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPoints = createAsyncThunk('points/fetchPoints', async (user_id) => {
	console.log(user_id);
	const { data } = await axios.post('/points', user_id);
	return data;
});

const initialState = {
	points: {
		items: [],
		status: 'loading',
	},
};

const pointsSlice = createSlice({
	name: 'points',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPoints.pending]: (state) => {
			state.points.status = 'loading';
		},
		[fetchPoints.fulfilled]: (state, action) => {
			state.points.items = action.payload;
			state.points.status = 'loaded';
		},
		[fetchPoints.rejected]: (state) => {
			state.points.items = [];
			state.points.status = 'error';
		},
	},
});

export const pointsReducer = pointsSlice.reducer;

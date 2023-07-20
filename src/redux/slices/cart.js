import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const sendDataToServer = createAsyncThunk('order/sendDataToServer', async (data) => {
	try {
		const response = await axios.post('/send-data', data);
		return response.data;
	} catch (error) {
		throw error;
	}
});

const initialState = {
	order: {
		status: 'sending',
	},
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {},
	extraReducers: {
		[sendDataToServer.pending]: (state) => {
			state.order.status = 'sending';
		},
		[sendDataToServer.fulfilled]: (state) => {
			state.order.status = 'sent';
		},
		[sendDataToServer.rejected]: (state) => {
			state.order.status = 'error';
		},
	},
});

export const orderReducer = orderSlice.reducer;

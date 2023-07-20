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
	extraReducers: (builder) => {
		builder
			.addCase(sendDataToServer.pending, (state) => {
				state.order.status = 'sending';
			})
			.addCase(sendDataToServer.fulfilled, (state) => {
				state.order.status = 'sent';
			})
			.addCase(sendDataToServer.rejected, (state) => {
				state.order.status = 'error';
			});
	},
});

export const orderReducer = orderSlice.reducer;

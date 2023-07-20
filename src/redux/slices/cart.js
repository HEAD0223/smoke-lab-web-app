import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const sendDataToServer = createAsyncThunk('cart/sendDataToServer', async (data) => {
	try {
		const response = await axios.post('/send-data', data);
		return response.data;
	} catch (error) {
		throw error;
	}
});

const initialState = {
	cart: {
		status: 'sending',
	},
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {},
	extraReducers: {
		[sendDataToServer.pending]: (state) => {
			state.cart.status = 'sending';
		},
		[sendDataToServer.fulfilled]: (state) => {
			state.cart.status = 'sent';
		},
		[sendDataToServer.rejected]: (state) => {
			state.cart.status = 'error';
		},
	},
});

export const cartReducer = cartSlice.reducer;

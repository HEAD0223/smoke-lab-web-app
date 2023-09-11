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
	cart: [],
	userInfo: {},
	order: {
		status: 'sending',
	},
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const { product, flavorName } = action.payload;

			const updatedCart = [...state.cart];
			const existingProductIndex = updatedCart.findIndex(
				(item) => item.product.code === product.code,
			);

			if (existingProductIndex !== -1) {
				// Product already exists in cart, update its flavors and quantities
				const existingProduct = updatedCart[existingProductIndex];
				const existingFlavorIndex = existingProduct.flavorsInCart.findIndex(
					(f) => f.flavour === flavorName,
				);

				if (existingFlavorIndex !== -1) {
					// Flavor already exists, update its quantity
					existingProduct.flavorsInCart[existingFlavorIndex].quantity += 1;
				} else {
					// Flavor does not exist, add it
					existingProduct.flavorsInCart.push({ flavour: flavorName, quantity: 1 });
				}
			} else {
				// Product does not exist in cart, add it with flavors and quantities
				updatedCart.push({
					product: { ...product },
					flavorsInCart: [{ flavour: flavorName, quantity: 1 }],
				});
			}

			state.cart = updatedCart;
		},
		removeFromCart: (state, action) => {
			const { product, flavorName } = action.payload;

			const updatedCart = state.cart.map((item) => {
				if (item.product.code === product.code) {
					// Find the product in the cart
					const updatedFlavors = item.flavorsInCart.map((flavor) => {
						if (flavor.flavour === flavorName) {
							// If the flavor exists in the payload, subtract its quantity from the current quantity
							flavor.quantity = Math.max(flavor.quantity - 1, 0);
						}
						return flavor;
					});

					// Filter out flavors with quantity 0
					const filteredFlavors = updatedFlavors.filter((flavor) => flavor.quantity > 0);

					return {
						...item,
						flavorsInCart: filteredFlavors,
					};
				}
				return item;
			});

			state.cart = updatedCart;
		},
		removeProductFromCart: (state, action) => {
			const { product } = action.payload;

			const updatedCart = state.cart.filter((item) => {
				return item.product.code !== product.code;
			});

			state.cart = updatedCart;
		},
		setUserInfo: (state, action) => {
			state.userInfo = action.payload.userInfo;
		},
	},
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

export const { addToCart, removeFromCart, removeProductFromCart, setUserInfo } = cartSlice.actions;

export const orderReducer = orderSlice.reducer;

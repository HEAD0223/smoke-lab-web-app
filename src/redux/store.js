import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './slices/cart';
import { manufacturersReducer } from './slices/manufacturers';
import { productsReducer } from './slices/products';

const store = configureStore({
	reducer: {
		products: productsReducer,
		manufacturers: manufacturersReducer,
		cart: cartReducer,
	},
});

export default store;

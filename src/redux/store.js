import { configureStore } from '@reduxjs/toolkit';
import { manufacturersReducer } from './slices/manufacturers';
import { productsReducer } from './slices/products';

const store = configureStore({
	reducer: {
		products: productsReducer,
		manufacturers: manufacturersReducer,
	},
});

export default store;

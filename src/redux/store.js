import { configureStore } from '@reduxjs/toolkit';
import { orderReducer } from './slices/cart';
import { manufacturersReducer } from './slices/manufacturers';
import { pointsReducer } from './slices/points';
import { productsReducer } from './slices/products';
import { promosReducer } from './slices/promo';

const store = configureStore({
	reducer: {
		products: productsReducer,
		manufacturers: manufacturersReducer,
		order: orderReducer,
		promos: promosReducer,
		points: pointsReducer,
	},
});

export default store;

import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Reducer function to handle cart-related actions
const cartReducer = (state, action) => {
	switch (action.type) {
		case 'ADD_TO_CART':
			const existingProduct = state.cart.find(
				(item) => item.code === action.payload.product.code,
			);
			if (existingProduct) {
				return {
					...state,
					cart: state.cart.map((item) =>
						item.code === action.payload.product.code
							? {
									...item,
									quantity: action.payload.quantity,
									flavorName: action.payload.flavorName,
							  }
							: item,
					),
				};
			} else {
				return {
					...state,
					cart: [
						...state.cart,
						{
							...action.payload.product,
							quantity: action.payload.quantity,
							flavorName: action.payload.flavorName,
						},
					],
				};
			}
		case 'REMOVE_FROM_CART':
			return {
				...state,
				cart: state.cart.map((item) =>
					item.code === action.payload.product.code
						? {
								...item,
								quantity: action.payload.quantity,
								flavorName: action.payload.flavorName,
						  }
						: item,
				),
			};
		case 'REMOVE_PRODUCT_FROM_CART':
			return {
				...state,
				cart: state.cart.filter((item) => item.code !== action.payload.product.code),
			};
		case 'SET_USER_INFO':
			return {
				...state,
				userInfo: action.payload.userInfo,
			};
		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const initialState = { cart: [], userInfo: {} };
	const [state, dispatchState] = useReducer(cartReducer, initialState);

	return (
		<CartContext.Provider value={{ cart: state.cart, userInfo: state.userInfo, dispatchState }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

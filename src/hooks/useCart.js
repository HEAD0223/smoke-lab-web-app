import React, { createContext, useContext } from 'react';

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
							? { ...item, quantity: item.quantity + action.payload.quantity }
							: item,
					),
				};
			} else {
				return {
					...state,
					cart: [
						...state.cart,
						{ ...action.payload.product, quantity: action.payload.quantity },
					],
				};
			}
		case 'REMOVE_FROM_CART':
			return {
				...state,
				cart: state.cart.map((item) =>
					item.code === action.payload.product.code
						? { ...item, quantity: Math.max(item.quantity - action.payload.quantity, 0) }
						: item,
				),
			};
		case 'REMOVE_PRODUCT_FROM_CART':
			return {
				...state,
				cart: state.cart.filter((item) => item.code !== action.payload.product.code),
			};
		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const initialState = { cart: [] };
	const [state, dispatch] = useReducer(cartReducer, initialState);

	return (
		<CartContext.Provider value={{ cart: state.cart, dispatch }}>{children}</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

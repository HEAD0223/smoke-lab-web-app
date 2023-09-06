import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Reducer function to handle cart-related actions
const cartReducer = (state, action) => {
	switch (action.type) {
		case 'ADD_TO_CART':
			const updatedAddCart = [...state.cart];
			const existingProductIndex = updatedAddCart.findIndex(
				(item) => item.product.code === action.payload.product.code,
			);

			if (existingProductIndex !== -1) {
				// Product already exists in cart, update its flavors and quantities
				const existingProduct = updatedAddCart[existingProductIndex];
				action.payload.inCart.forEach((flavorInfo) => {
					const existingFlavorIndex = existingProduct.inCart.findIndex(
						(f) => f.flavorName === flavorInfo.flavorName,
					);
					if (existingFlavorIndex !== -1) {
						// Flavor already exists, update its quantity
						existingProduct.inCart[existingFlavorIndex].quantity += 1; // Increase quantity by 1
					} else {
						// Flavor does not exist, add it
						existingProduct.inCart.push({ ...flavorInfo });
					}
				});
			} else {
				// Product does not exist in cart, add it with flavors and quantities
				updatedAddCart.push({
					product: { ...action.payload.product },
					inCart: action.payload.inCart.map((flavorInfo) => ({ ...flavorInfo })),
				});
			}

			return {
				...state,
				cart: updatedAddCart,
			};
		case 'REMOVE_FROM_CART':
			const updatedRemoveCart = state.cart
				.map((item) => {
					if (item.product.code === action.payload.product.code) {
						// Find the product in the cart
						const updatedFlavors = item.inCart
							.map((flavor) => {
								// Find the flavor to update by looping through the inCart array
								const matchingFlavor = action.payload.inCart.find(
									(cartFlavor) => cartFlavor.flavorName === flavor.flavorName,
								);
								if (matchingFlavor) {
									if (flavor.quantity > 1) {
										// If quantity > 1, decrease the quantity
										return { ...flavor, quantity: flavor.quantity - 1 };
									}
								}
								return flavor;
							})
							.filter(Boolean); // Remove null (flavors with quantity 0)

						// Check if there are flavors left for the product
						if (updatedFlavors.length > 0) {
							return {
								...item,
								inCart: updatedFlavors,
							};
						}
					}
					return item;
				})
				.filter((item) => item.inCart.length > 0); // Remove products with no flavors left

			return {
				...state,
				cart: updatedRemoveCart,
			};
		case 'REMOVE_PRODUCT_FROM_CART':
			const filteredCart = state.cart.filter((item) => {
				return item.product.code !== action.payload.product.code;
			});
			return {
				...state,
				cart: filteredCart,
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

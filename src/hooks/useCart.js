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
				action.payload.flavorsInCart.forEach((flavorInfo) => {
					const existingFlavorIndex = existingProduct.flavorsInCart.findIndex(
						(f) => f.flavour === flavorInfo.flavour,
					);
					if (existingFlavorIndex !== -1) {
						// Flavor already exists, update its quantity
						existingProduct.flavorsInCart[existingFlavorIndex].quantity += 1; // Increase quantity by 1
					} else {
						// Flavor does not exist, add it
						existingProduct.flavorsInCart.push({ ...flavorInfo });
					}
				});
			} else {
				// Product does not exist in cart, add it with flavors and quantities
				updatedAddCart.push({
					product: { ...action.payload.product },
					flavorsInCart: action.payload.flavorsInCart.map((flavorInfo) => ({ ...flavorInfo })),
				});
			}

			return {
				...state,
				cart: updatedAddCart,
			};
		case 'REMOVE_FROM_CART':
			console.log(state.cart);
			const updatedRemoveCart = state.cart.map((item) => {
				if (item.product.code === action.payload.product.code) {
					// Find the product in the cart
					const updatedFlavors = item.flavorsInCart.map((flavor) => {
						console.log('flavor: ', flavor);
						// Check if the flavor exists in the action.payload.flavorsInCart
						const matchingFlavor = action.payload.flavorsInCart.find(
							(cartFlavor) => cartFlavor.flavour === flavor.flavour,
						);

						console.log('matchingFlavor: ', matchingFlavor);

						if (matchingFlavor) {
							// If the flavor exists in the payload, subtract its quantity from the current quantity
							const newQuantity = flavor.quantity - matchingFlavor.quantity;

							console.log('flavor.quantity: ', flavor.quantity);
							console.log('matchingFlavor.quantity: ', matchingFlavor.quantity);
							console.log('newQuantity: ', newQuantity);

							// Ensure the quantity doesn't go below 0
							const updatedQuantity = Math.max(newQuantity, 0);

							console.log('updatedQuantity: ', updatedQuantity);

							// Return the updated flavor object with the new quantity
							return { ...flavor, quantity: updatedQuantity };
						} else {
							// Otherwise, return the original flavor
							return flavor;
						}
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

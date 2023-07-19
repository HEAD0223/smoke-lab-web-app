import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';
import { Filter } from '../Filter/Filter';
import { ProductCard } from '../ProductCard/ProductCard';

const useStyles = makeStyles((theme) => ({
	productList: {
		marginTop: theme.spacing(3),
		paddingLeft: theme.spacing(10),
		paddingRight: theme.spacing(10),
		marginBottom: theme.spacing(6),
		backgroundColor: theme.palette.bg_color.main,
		color: theme.palette.text_color.main,
	},
	filterContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
		padding: theme.spacing(2),
		backgroundColor: theme.palette.bg_color.main,
	},
}));

export const ProductList = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { tg } = useTelegram();
	const { cart, dispatch } = useCart();
	const [quantities, setQuantities] = useState({});

	const { products } = useSelector((state) => state.products);
	const isProductsLoading = products.status === 'loading' || products.status === 'error';
	const [selectedManufacturers, setSelectedManufacturers] = useState([]);

	// Function to filter products based on the selected manufacturers
	const filteredProducts = products.items.filter((product) => {
		if (selectedManufacturers.length === 0) return true; // Show all products if no manufacturer selected
		return selectedManufacturers.includes(product.manufacturer);
	});
	// Function to handle selection change in Filter component
	const handleManufacturerSelection = (selectedOptions) => {
		setSelectedManufacturers(selectedOptions);
	};

	const getTotalPrice = (items) => {
		return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
	};

	// Function to handle adding products to the cart
	const onAdd = (product, quantity) => {
		// Update the quantity in the local state
		setQuantities((prevQuantities) => ({
			...prevQuantities,
			[product.code]: quantity,
		}));
		// Update the quantity in the cart state using the dispatch function
		dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
	};

	// Function to handle removing products from the cart
	const onRemove = (product, quantity) => {
		// If the quantity is 0, remove the product from the local state
		if (quantity === 0) {
			setQuantities((prevQuantities) => ({
				...prevQuantities,
				[product.code]: undefined,
			}));
		} else {
			// Otherwise, update the quantity in the local state
			setQuantities((prevQuantities) => ({
				...prevQuantities,
				[product.code]: quantity,
			}));
		}

		// Update the quantity in the cart state using the dispatch function
		if (quantity === 0) {
			dispatch({ type: 'REMOVE_PRODUCT_FROM_CART', payload: { product } });
		} else {
			dispatch({ type: 'REMOVE_FROM_CART', payload: { product, quantity } });
		}
	};

	useEffect(() => {
		// Update the quantities state based on the products in the cart
		const newQuantities = {};
		cart.forEach((item) => {
			newQuantities[item.code] = item.quantity;
		});
		setQuantities(newQuantities);

		// This will log the updated cart value whenever it changes
		console.log('Updated Cart:', cart);

		// Hide or show the MainButton based on the cart items
		if (cart.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			const totalPrice = getTotalPrice(cart);
			tg.MainButton.setParams({
				text: `Buy ${totalPrice.toFixed(2)}`, // Use the totalPrice state here
			});
		}
	}, [cart]);

	const onSendData = useCallback(() => {
		console.log('Clicked');
		navigate('/cart');
	}, [cart, navigate]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	return (
		<>
			{isProductsLoading && <LinearProgress />}
			<div className={classes.filterContainer}>
				{/* Pass handleManufacturerSelection as a callback to Filter component */}
				<Filter onSelectManufacturers={handleManufacturerSelection} />
			</div>
			{/* Products */}
			<Grid container spacing={3} className={classes.productList}>
				{isProductsLoading
					? // Render skeleton if products are loading
					  Array.from({ length: 3 }).map((_, index) => (
							<Grid item xs={12} sm={6} md={4} lg={4} key={index}>
								<Skeleton variant="rectangular" height={300} animation="wave" />
							</Grid>
					  ))
					: // Render products when they are loaded
					  filteredProducts.map((item) => (
							<Grid item xs={12} sm={6} md={4} lg={4} key={item._id}>
								<ProductCard
									product={item}
									quantity={quantities[item.code] || 0}
									setQuantity={(value) =>
										setQuantities((prevQuantities) => ({
											...prevQuantities,
											[item.code]: value,
										}))
									}
									onAdd={onAdd}
									onRemove={onRemove}
								/>
							</Grid>
					  ))}
			</Grid>
		</>
	);
};

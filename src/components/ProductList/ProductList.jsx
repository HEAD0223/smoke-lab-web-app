import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
	const { tg } = useTelegram();
	const [cart, setCart] = useState([]);

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
		// Check if the product is already in the cart
		const existingProduct = cart.find((item) => item.code === product.code);

		if (existingProduct) {
			// If the product is already in the cart, update its quantity
			setCart((prevCart) =>
				prevCart.map((item) =>
					item.code === product.code ? { ...item, quantity: item.quantity + quantity } : item,
				),
			);
		} else {
			// If the product is not in the cart, add it with the given quantity
			setCart((prevCart) => [...prevCart, { ...product, quantity }]);
		}
	};

	// Function to handle removing products from the cart
	const onRemove = (product, quantity) => {
		// Check if the product is already in the cart
		const existingProduct = cart.find((item) => item.code === product.code);

		if (existingProduct) {
			// If the product is in the cart, update its quantity
			setCart((prevCart) =>
				prevCart.map((item) =>
					item.code === product.code
						? { ...item, quantity: Math.max(item.quantity - quantity, 0) }
						: item,
				),
			);
		}
	};

	useEffect(() => {
		// This will log the updated cart value whenever it changes
		console.log('Updated Cart:', cart);
	}, [cart]);

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
								<ProductCard product={item} onAdd={onAdd} onRemove={onRemove} />
							</Grid>
					  ))}
			</Grid>
		</>
	);
};

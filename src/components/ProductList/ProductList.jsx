import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
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

const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		const itemPrice = parseFloat(item.price);
		return (acc += itemPrice);
	}, 0);
};

export const ProductList = () => {
	const classes = useStyles();
	const { tg } = useTelegram();
	const [addedItems, setAddedItems] = useState([]);

	const { products } = useSelector((state) => state.products);
	const isProductsLoading = products.status === 'loading' || products.status === 'error';
	// State to store the selected manufacturers as an array
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

	// const onSendData = useCallback(() => {
	// 	const data = {
	// 		products: addedItems,
	// 		totalPrice: getTotalPrice(addedItems),
	// 	};
	// 	console.log('Data to be sent:', data);
	// }, [addedItems]);

	// useEffect(() => {
	// 	tg.onEvent('mainButtonClicked', onSendData);
	// 	return () => {
	// 		tg.offEvent('mainButtonClicked', onSendData);
	// 	};
	// }, [onSendData]);

	const onAdd = (product) => {
		setAddedItems((prevAddedItems) => {
			const alreadyAdded = prevAddedItems.find((item) => item.code === product.code);
			let newItems = [];

			console.log(alreadyAdded);
			console.log(newItems);

			if (alreadyAdded) {
				newItems = prevAddedItems.filter((item) => item.code !== product.code);
				console.log(newItems);
			} else {
				newItems = [...prevAddedItems, product];
				console.log(newItems);
			}

			if (newItems.length === 0) {
				tg.MainButton.hide();
			} else {
				tg.MainButton.show();
				tg.MainButton.setParams({
					text: `Buy ${getTotalPrice(newItems)}`,
				});
			}

			return newItems;
		});
	};

	const onRemove = (product) => {
		setAddedItems((prevAddedItems) => {
			const updatedItems = prevAddedItems.filter((item) => item.code !== product.code);

			console.log(updatedItems);

			if (updatedItems.length === 0) {
				tg.MainButton.hide();
			} else {
				tg.MainButton.show();
				tg.MainButton.setParams({
					text: `Buy ${getTotalPrice(updatedItems)}`,
				});
			}

			return updatedItems;
		});
	};

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

import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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

// const getTotalPrice = (items = []) => {
// 	return items.reduce((acc, item) => {
// 		return (acc += item.price);
// 	}, 0);
// };

export const ProductList = () => {
	const classes = useStyles();

	// const [addedItems, setAddedItems] = useState([]);

	// const { tg } = useTelegram();
	const { products } = useSelector((state) => state.products);
	const isProductsLoading = products.status === 'loading' || !products.status;
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
	// 		queryId,
	// 	};
	// 	// fetch('http://localhost:8000', {
	// 	// 	method: 'POST',
	// 	// 	headers: {
	// 	// 		'Content-Type': 'application/json',
	// 	// 	},
	// 	// 	body: JSON.stringify(data),
	// 	// });
	// }, []);

	// useEffect(() => {
	// 	tg.onEvent('mainButtonClicked', onSendData);

	// 	return () => {
	// 		tg.offEvent('mainButtonClicked', onSendData);
	// 	};
	// }, [onSendData]);

	// const onAdd = (product) => {
	// 	const alreadyAdded = addedItems.find((item) => item.id === product.id);
	// 	let newItems = [];

	// 	if (alreadyAdded) {
	// 		newItems = addedItems.filter((item) => item.id !== product.id);
	// 	} else {
	// 		newItems = [...addedItems, product];
	// 	}

	// 	setAddedItems(newItems);

	// 	if (newItems.length === 0) {
	// 		tg.MainButton.hide();
	// 	} else {
	// 		tg.MainButton.show();
	// 		tg.MainButton.setParams({
	// 			text: `Buy ${getTotalPrice(newItems)}`,
	// 		});
	// 	}
	// };

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
					  filteredProducts.map((product) => (
							<Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
								<ProductCard
									code={product.code}
									name={product.name}
									amount={product.amount}
									price={product.price}
									description={product.description}
									manufacturer={product.manufacturer}
									url={product.url}
								/>
							</Grid>
					  ))}
			</Grid>
		</>
	);
};

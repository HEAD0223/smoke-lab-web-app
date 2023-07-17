import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { Filter } from '../Filter/Filter';
import { ProductCard } from '../ProductCard/ProductCard';

const useStyles = makeStyles((theme) => ({
	body: {
		backgroundColor: theme.palette.bg_color.main,
		color: theme.palette.text_color.main,
	},
	productList: {
		marginTop: theme.spacing(3),
		paddingLeft: theme.spacing(10),
		paddingRight: theme.spacing(10),
		marginBottom: theme.spacing(6),
	},
	filterContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
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
	const isProductsLoading = products.status === 'loading';

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
		<div className={classes.body}>
			{isProductsLoading && <LinearProgress />}
			<div className={classes.filterContainer}>
				<Filter />
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
					  products.items.map((product) => (
							<Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
								<ProductCard
									name={product.name}
									price={product.amount}
									description={product.url}
								/>
							</Grid>
					  ))}
			</Grid>
		</div>
	);
};

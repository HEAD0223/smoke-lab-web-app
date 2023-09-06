import { Grid, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { ProductCard } from './ProductCard';

const useStyles = makeStyles((theme) => ({
	productList: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(6),
		backgroundColor: theme.palette.bg_color.main,
		color: theme.palette.text_color.main,
	},
}));

export const Chasers = ({ isProductsLoading, filteredAndSortedProducts, cart }) => {
	const classes = useStyles();

	return (
		<Grid container spacing={3} className={classes.productList}>
			{isProductsLoading
				? Array.from({ length: 4 }).map((_, index) => (
						<Grid item xs={6} sm={6} md={4} lg={4} key={index}>
							<Skeleton variant="rectangular" height={200} animation="wave" />
						</Grid>
				  ))
				: filteredAndSortedProducts.map((item) => (
						<Grid item xs={6} sm={6} md={4} lg={4} key={item._id}>
							<ProductCard product={item} cart={cart} />
						</Grid>
				  ))}
		</Grid>
	);
};

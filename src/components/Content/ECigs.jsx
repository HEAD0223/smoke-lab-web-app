import { Grid, Skeleton } from '@mui/material';
import React from 'react';
import { ProductCard } from './ProductCard';

export const ECigs = ({ isProductsLoading, filteredAndSortedProducts }) => {
	return (
		<Grid container spacing={3} paddingLeft={4} paddingRight={4} marginTop={-2} marginBottom={6}>
			{isProductsLoading
				? Array.from({ length: 4 }).map((_, index) => (
						<Grid item xs={6} sm={6} md={4} lg={4} key={index}>
							<Skeleton variant="rectangular" height={200} animation="wave" />
						</Grid>
				  ))
				: filteredAndSortedProducts.map((item) => (
						<Grid item xs={6} sm={6} md={4} lg={4} key={item._id}>
							<ProductCard product={item} />
						</Grid>
				  ))}
		</Grid>
	);
};

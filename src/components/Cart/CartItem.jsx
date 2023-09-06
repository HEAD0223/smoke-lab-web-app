import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

export const CartItem = ({ item }) => {
	console.log(item);
	const totalQuantity = item.flavorsInCart.reduce((total, flavor) => total + flavor.quantity, 0);
	const totalPrice = item.flavorsInCart.reduce(
		(total, flavor) => total + parseFloat(item.product.price) * flavor.quantity,
		0,
	);

	return (
		<div>
			<Card>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="h6">{item.product.name}</Typography>
							<Typography variant="body2">
								{totalQuantity} x {item.product.price} MDL
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="body1">{totalPrice} MDL</Typography>
						</Grid>
					</Grid>
					{item.flavorsInCart.map((flavor, index) => (
						<div key={index}>
							<Divider />
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Typography variant="h6">{flavor.flavour}</Typography>
									<Typography variant="body2">Quantity: {flavor.quantity}</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body1">
										{parseFloat(item.price) * flavor.quantity} {item.currency}
									</Typography>
								</Grid>
							</Grid>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
};
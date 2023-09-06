import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

export const CartItem = ({ item }) => {
	console.log(item);
	return (
		<div>
			<Card>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={3}>
							<img
								src={
									item.url
										? `data:image/png;base64,${item.url}`
										: 'https://source.unsplash.com/random'
								}
								alt={item.name}
								style={{ width: '100%' }}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="h6">{item.name}</Typography>
							<Typography variant="body2">
								{item.quantity} x {item.price} {item.currency}
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="body1">
								{parseFloat(item.price) * item.quantity} {item.currency}
							</Typography>
						</Grid>
					</Grid>
					{item.flavorsInCart.map((flavor, index) => (
						<div key={index}>
							<Divider />
							<Grid container spacing={2}>
								<Grid item xs={3}>
									{/* Flavor image */}
								</Grid>
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

import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

export const CartItem = ({ item }) => {
	const totalQuantity = item.flavorsInCart.reduce((total, flavor) => total + flavor.quantity, 0);
	const totalPrice = item.flavorsInCart.reduce(
		(total, flavor) => total + parseFloat(item.product.price) * flavor.quantity,
		0,
	);

	const filteredFlavours = item.product.flavours.filter((flavour) => {
		const foundFlavour = item.flavorsInCart.find(
			(cartFlavour) => cartFlavour.flavour === flavour.flavour,
		);
		return foundFlavour !== undefined;
	});

	return (
		<div>
			<Card>
				<CardContent>
					<Grid
						container
						spacing={2}
						justifyContent={'center'}
						alignItems={'center'}
						alignContent={'center'}
						marginBottom={'10px'}>
						<Grid item xs={6}>
							<img
								src={
									item.product.image
										? `data:image/png;base64,${item.product.image}`
										: 'https://source.unsplash.com/random'
								}
								alt={item.product.name}
								style={{ width: '100%' }}
							/>
						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2} flexWrap={'wrap'} justifyContent={'center'}>
								{filteredFlavours.map((flavor, index) => (
									<Grid item xs={4} key={index}>
										<img
											src={
												flavor.image
													? `data:image/png;base64,${flavor.image}`
													: 'https://source.unsplash.com/random'
											}
											alt={flavor.flavour}
											style={{ width: '100%' }}
										/>
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
					<Divider />
					<Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
						<Grid item xs={6} minWidth={'60%'}>
							<Typography variant="h6">{item.product.name}</Typography>
							<Typography variant="caption">
								{totalQuantity} x {item.product.price} MDL
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Typography variant="body2" textAlign={'center'}>
								{totalPrice} MDL
							</Typography>
						</Grid>
					</Grid>
					{item.flavorsInCart.map((flavor, index) => (
						<div key={index}>
							<Divider />
							<Grid
								container
								spacing={2}
								justifyContent={'space-between'}
								padding={'10px 0'}>
								<Grid item xs={2} display={'flex'} alignItems={'center'}>
									<DoneAllIcon />
								</Grid>
								<Grid item xs={6} display={'flex'} alignItems={'center'}>
									<Typography variant="body1">{flavor.flavour}</Typography>
									{/* <Typography variant="caption">x{flavor.quantity}</Typography> */}
								</Grid>
								<Grid item xs={1} display={'flex'} alignItems={'center'}>
									<Typography variant="caption">x{flavor.quantity}</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body2">
										{parseFloat(item.product.price) * flavor.quantity} MDL
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

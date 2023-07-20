import { Button, Skeleton, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';

const useStyles = makeStyles((theme) => ({
	cartContainer: {
		padding: theme.spacing(2),
	},
	headerContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing(2),
	},
	cartItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(2),
	},
	itemImage: {
		width: 80,
		height: 80,
		marginRight: theme.spacing(2),
	},
	itemName: {
		flexGrow: 1,
	},
	commentContainer: {
		marginTop: theme.spacing(4),
	},
}));

export const Cart = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { cart } = useCart();
	const { tg } = useTelegram();

	const getTotalPrice = (items) => {
		return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
	};

	const handleEditClick = () => {
		navigate('/');
		const totalPrice = getTotalPrice(cart);
		tg.MainButton.setParams({
			text: `Buy ${totalPrice.toFixed(2)}`,
		});
	};

	useEffect(() => {
		tg.MainButton.show();
		tg.MainButton.setParams({
			text: `Order`,
		});
	}, []);

	const onSendData = useCallback(() => {
		console.log('Clicked');
	}, []);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	return (
		<div className={classes.cartContainer}>
			<div className={classes.headerContainer}>
				<Typography variant="h4">Your Order</Typography>
				<Button variant="outlined" color="primary" onClick={handleEditClick}>
					Edit
				</Button>
			</div>
			{cart.length === 0 ? (
				// If the cart is empty and still loading, show the Skeleton
				<Skeleton variant="rectangular" height={300} animation="wave" />
			) : (
				// Otherwise, show the cart content
				cart.map((item) => (
					<div className={classes.cartItem} key={item.code}>
						<img
							src={
								item.url
									? `data:image/png;base64,${item.url}`
									: 'https://source.unsplash.com/random'
							}
							alt={item.name}
							className={classes.itemImage}
						/>
						<div className={classes.itemName}>
							<Typography variant="h6">{item.name}</Typography>
							<Typography variant="body2">
								{item.quantity} x {item.manufacturer}
							</Typography>
						</div>
						<Typography variant="body1">${parseFloat(item.price) * item.quantity}</Typography>
					</div>
				))
			)}
			<div className={classes.commentContainer}>
				<TextField
					multiline
					rows={4}
					variant="outlined"
					fullWidth
					placeholder="Add comment..."
				/>
				<Typography variant="body2" color="textSecondary">
					Any special requests, details, final wishes etc.
				</Typography>
			</div>
		</div>
	);
};

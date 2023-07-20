import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Skeleton,
	TextField,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
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
		color: theme.palette.hint_color.main,
	},
}));

export const Cart = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { cart } = useCart();
	const { tg } = useTelegram();

	// State to manage the modal open/close status and form fields data
	const [modalOpen, setModalOpen] = useState(false);
	const isDataSending = 'sent';
	const [userInfo, setUserInfo] = useState({
		name: '',
		phone: '',
		address: '',
		comment: '',
	});

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
		console.log('User Name:', userInfo.name);
		console.log('User Phone:', userInfo.phone);
		console.log('User Address:', userInfo.address);
		console.log('User Comment:', userInfo.comment);

		// Check if all user information fields are filled
		if (userInfo.name && userInfo.phone && userInfo.address && userInfo.comment) {
			setModalOpen(true);
			console.log('User Info:', userInfo);
		} else {
			alert('Please fill out all the required fields.');
		}
	}, [userInfo]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	// Function to handle input changes for user information
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUserInfo((prevUserInfo) => ({
			...prevUserInfo,
			[name]: value,
		}));
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	return (
		<div className={classes.cartContainer}>
			<div className={classes.headerContainer}>
				<Typography variant="h4">Your Order</Typography>
				<Button variant="outlined" onClick={handleEditClick}>
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
				{/* Form fields to collect user information */}
				<TextField
					name="name"
					label="Name"
					value={userInfo.name}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="phone"
					label="Phone"
					value={userInfo.phone}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="address"
					label="Address"
					value={userInfo.address}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="comment"
					label="Comment"
					value={userInfo.comment}
					onChange={handleInputChange}
					multiline
					rows={4}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
			</div>
			{/* Modal */}
			<Dialog open={modalOpen} onClose={handleModalClose}>
				<DialogTitle>Order Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{isDataSending && <CircularProgress />}
						{isDataSending === 'sent' && (
							<>
								<LocalShippingIcon />
								Your Products Were Sent
							</>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

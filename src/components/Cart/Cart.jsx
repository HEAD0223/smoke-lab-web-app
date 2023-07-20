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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';
import { sendDataToServer } from '../../redux/slices/cart';

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
	circularProgressContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	circularProgress: {
		color: theme.palette.button_color.main,
	},
	commentContainer: {
		marginTop: theme.spacing(4),
		color: theme.palette.hint_color.main,
	},
	iconContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	icon: {
		fontSize: 48,
		marginBottom: theme.spacing(1),
	},
}));

export const Cart = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { cart } = useCart();
	const { tg, user } = useTelegram();
	const dispatch = useDispatch();

	// State to manage the modal open/close status and form fields data
	const [modalOpen, setModalOpen] = useState(false);
	const { order } = useSelector((state) => state.order);
	const isDataSending = order.status === 'sending' || order.status === 'error';
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
		// Check if all user information fields are filled
		if (userInfo.name && userInfo.phone && userInfo.address && userInfo.comment) {
			tg.MainButton.hide();
			setModalOpen(true);
			// Combine cart and user information
			const combinedData = {
				user_id: user.id,
				username: user.username,
				created_at: Date.now(),
				status: '⌛️',
				items: cart,
				info: {
					name: userInfo.name,
					phone: userInfo.phone,
					address: userInfo.address,
					comment: userInfo.comment,
				},
			};
			dispatch(sendDataToServer(combinedData));
		} else {
			alert('Please fill out all the required fields.');
		}
	}, [userInfo]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		if (order.status === 'sent') {
			const timer = setTimeout(() => {
				tg.close();
			}, 3000); // Wait for 5 seconds before closing the web app

			return () => {
				clearTimeout(timer);
			};
		}

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData, order.status]);

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
						<div className={classes.circularProgressContainer}>
							{isDataSending && <CircularProgress className={classes.circularProgress} />}
						</div>
						{order.status === 'sent' && (
							<div className={classes.iconContainer}>
								<LocalShippingIcon className={classes.icon} />
								<Typography variant="body1">Your Products Were Sent</Typography>
							</div>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

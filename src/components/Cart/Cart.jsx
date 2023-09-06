import ErrorIcon from '@mui/icons-material/Error';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Grid,
	Skeleton,
	TextField,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';
import { sendDataToServer } from '../../redux/slices/cart';
import { CartItem } from './CartItem';

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
	headerTitle: {
		fontSize: `1.125rem !important`,
		margin: `6px !important`,
	},
	headerButton: {
		fontSize: `0.675rem !important`,
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
	modalTitle: {
		textAlign: 'center',
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
		textAlign: 'center',
	},
	icon: {
		fontSize: `3.5rem !important`,
		marginBottom: theme.spacing(1),
	},
}));

export const Cart = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { cart, userInfo, dispatchState } = useCart();
	const { tg, user } = useTelegram();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [modalOpen, setModalOpen] = useState(false);
	const { order } = useSelector((state) => state.order);
	const isDataSending = order.status === 'sending';

	const getTotalPrice = (items) => {
		return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
	};

	const handleEditClick = () => {
		navigate('/');
		const totalPrice = getTotalPrice(cart);
		tg.MainButton.setParams({
			text: `${t('tg_buy')}${totalPrice}`,
		});
	};

	useEffect(() => {
		console.log(cart);
		tg.MainButton.show();
		tg.MainButton.setParams({
			text: `${t('tg_order')}`,
		});
	}, []);

	const onSendData = useCallback(() => {
		// Check if all user information fields are filled
		if (userInfo.name && userInfo.phone && userInfo.address) {
			tg.MainButton.hide();
			setModalOpen(true);
			// Combine cart and user information
			const combinedData = {
				user_id: user.id,
				username: user.username || 'None',
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
			alert(`${t('cart_decline')}`);
		}
	}, [userInfo]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		if (order.status === 'sent') {
			const timer = setTimeout(() => {
				tg.close();
			}, 3000); // Wait for X seconds before closing the web app

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
		dispatchState({
			type: 'SET_USER_INFO',
			payload: { userInfo: { ...userInfo, [name]: value } },
		}); // Dispatch the updated userInfo
	};

	const handleModalClose = () => {
		tg.MainButton.show();
		setModalOpen(false);
	};

	return (
		<div className={classes.cartContainer}>
			<div className={classes.headerContainer}>
				<Typography variant="h4" className={classes.headerTitle}>
					{t('cart_title')}
				</Typography>
				<Button variant="outlined" className={classes.headerButton} onClick={handleEditClick}>
					{t('cart_btn')}
				</Button>
			</div>
			{cart.length === 0
				? // If the cart is empty and still loading, show the Skeleton
				  Array.from({ length: 3 }).map((_, index) => (
						<Grid item xs={6} sm={6} md={4} lg={4} key={index}>
							<Skeleton variant="rectangular" height={100} animation="wave" />
							<Divider />
						</Grid>
				  ))
				: // Otherwise, show the cart content
				  cart.map((item) => (
						<div className={classes.cartItem} key={item.code}>
							<CartItem item={item} />
						</div>
				  ))}
			<div className={classes.commentContainer}>
				{/* Form fields to collect user information */}
				<TextField
					name="name"
					label={t('form_name')}
					value={userInfo.name}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="phone"
					label={t('form_phone')}
					value={userInfo.phone}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="address"
					label={t('form_address')}
					value={userInfo.address}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				<TextField
					name="comment"
					label={t('form_comment')}
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
				<DialogTitle className={classes.modalTitle}>{t('cart_order')}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div className={classes.circularProgressContainer}>
							{isDataSending && <CircularProgress className={classes.circularProgress} />}
						</div>
						{order.status === 'sent' && (
							<div className={classes.iconContainer}>
								<LocalShippingIcon className={classes.icon} />
								<Typography variant="body1">{t('cart_success')}</Typography>
							</div>
						)}
						{order.status === 'error' && (
							<div className={classes.iconContainer}>
								<ErrorIcon className={classes.icon} />
								<Typography variant="body1">{t('cart_error')}</Typography>
							</div>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

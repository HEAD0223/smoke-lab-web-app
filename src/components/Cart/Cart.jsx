import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
	Button,
	Card,
	CardContent,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	InputAdornment,
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
import { fetchPoints } from '../../redux/slices/points';
import { fetchPromos } from '../../redux/slices/promo';
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
	const { promos } = useSelector((state) => state.promos);
	const { points } = useSelector((state) => state.points);
	const isDataSending = order.status === 'sending';
	const [promoCode, setPromoCode] = useState('');
	const [isPromoValid, setIsPromoValid] = useState(false);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [usePoints, setUsePoints] = useState(false);

	useEffect(() => {
		dispatch(fetchPromos());
		dispatch(fetchPoints(user.id));
		tg.MainButton.show();
		tg.MainButton.setParams({
			text: `${t('tg_order')}`,
		});
	}, []);

	const getTotalPrice = (cart) => {
		return cart.reduce((total, cartItem) => {
			const itemPrice = parseFloat(cartItem.product.price);

			// Calculate the total price for each flavor in the item
			const flavorTotal = cartItem.flavorsInCart.reduce((flavorTotal, flavor) => {
				return flavorTotal + itemPrice * flavor.quantity;
			}, 0);

			return total + flavorTotal;
		}, 0);
	};

	const calculateTotalPrice = () => {
		const totalPrice = getTotalPrice(cart);
		if (usePoints) {
			const maxPoints = totalPrice * 0.5;
			const newTotalPrice = Math.max(totalPrice - points.items, totalPrice - maxPoints);
			return newTotalPrice;
		}
		return totalPrice;
	};

	const handleEditClick = () => {
		navigate('/');
		const totalPrice = getTotalPrice(cart);
		tg.MainButton.setParams({
			text: `${t('tg_buy')}${totalPrice}`,
		});
	};

	useEffect(() => {
		const total = cart.reduce((total, item) => {
			return (
				total +
				item.flavorsInCart.reduce((flavorTotal, flavor) => {
					return flavorTotal + flavor.quantity;
				}, 0)
			);
		}, 0);
		setTotalQuantity(total);
	}, [cart]);

	const onSendData = useCallback(() => {
		if (userInfo.name && userInfo.phone && userInfo.address) {
			tg.MainButton.hide();
			setModalOpen(true);

			if (usePoints) {
				pointsSpent = getTotalPrice(cart) - calculateTotalPrice();
			}

			const combinedData = {
				user_id: user.id,
				username: user.username || 'None',
				created_at: Date.now(),
				status: '⌛️',
				items: cart,
				info: {
					promo: isPromoValid ? promoCode : '',
					points: pointsSpent,
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
			}, 3000);

			return () => {
				clearTimeout(timer);
			};
		}

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData, order.status]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		dispatchState({
			type: 'SET_USER_INFO',
			payload: { userInfo: { ...userInfo, [name]: value } },
		});
	};

	const handlePromoCodeChange = (event) => {
		const enteredCode = event.target.value;
		setPromoCode(enteredCode);

		const isCodeValid = promos.items.some(
			(promo) => promo.promoName === enteredCode && promo.usage > 0,
		);
		setIsPromoValid(isCodeValid);
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
			{cart.length === 0 ? (
				// If the cart is empty and still loading, show the Skeleton
				Array.from({ length: 3 }).map((_, index) => (
					<Grid item xs={6} sm={6} md={4} lg={4} key={index}>
						<Skeleton variant="rectangular" height={100} animation="wave" />
						<Divider />
					</Grid>
				))
			) : (
				// Otherwise, show the cart content
				<div>
					{cart.map((item) => (
						<div className={classes.cartItem} key={item.code}>
							<CartItem item={item} />
						</div>
					))}
					<Card>
						<CardContent style={{ paddingBottom: '16px' }}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: 12,
								}}>
								<Typography variant="h6">{t('cart_total')}</Typography>
								<Typography variant="body1">
									{calculateTotalPrice()}
									{t('currency')}
								</Typography>
							</div>
							<Divider />
							{totalQuantity > 3 && (
								<div>
									<Typography variant="body1" textAlign={'center'} margin={'10px 0'}>
										{t('cart_gift')}
									</Typography>
									<Divider />
								</div>
							)}
							<div>
								<TextField
									name="promocode"
									label={t('cart_promo')}
									value={promoCode}
									onChange={handlePromoCodeChange}
									color="primary"
									variant="outlined"
									fullWidth
									margin="normal"
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{isPromoValid ? (
													<CheckIcon style={{ color: 'green' }} />
												) : (
													<CloseIcon style={{ color: 'red' }} />
												)}
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<FormControlLabel
									control={
										<Checkbox
											checked={usePoints}
											onChange={(e) => setUsePoints(e.target.checked)}
											name="usePoints"
											color="primary"
										/>
									}
									label={t('cart_points')}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
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

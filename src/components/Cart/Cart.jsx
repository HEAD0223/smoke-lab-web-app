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
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { sendDataToServer, setUserInfo } from '../../redux/slices/cart';
import { fetchPoints } from '../../redux/slices/points';
import { fetchPromos } from '../../redux/slices/promo';
import { CartItem } from './CartItem';

export const Cart = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, userInfo } = useSelector((state) => state.order);
	const { tg, user } = useTelegram();
	const { t } = useTranslation();
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

			let pointsSpent = 0;
			if (usePoints) {
				pointsSpent = getTotalPrice(cart) - calculateTotalPrice();
			}

			const combinedData = {
				user_id: user.id,
				username: user.username || 'None',
				created_at: Date.now(),
				status: '⌛️',
				cart: cart,
				info: {
					promo: isPromoValid ? promoCode : '',
					points: pointsSpent,
					name: userInfo.name,
					phone: userInfo.phone,
					address: userInfo.address,
					comment: userInfo.comment,
				},
			};
			console.log(combinedData);
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
		dispatch(setUserInfo({ userInfo: { ...userInfo, [name]: value } }));
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
		<div style={{ padding: 16 }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 16,
				}}>
				<Typography variant="h4" fontSize={18} margin={1}>
					{t('cart_title')}
				</Typography>
				<Button variant="outlined" size="small" onClick={handleEditClick} color="success">
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
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 16,
							}}
							key={item.code}>
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
									sx={{
										'& label.Mui-focused': {
											color: 'var(--tg-theme-button-color)',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'var(--tg-theme-button-color)',
										},
									}}
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
											sx={{
												color: 'var(--tg-theme-button-text-color)',
												'&.Mui-checked': {
													color: 'var(--tg-theme-button-color)',
												},
											}}
										/>
									}
									label={t('cart_points')}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
			<div style={{ marginTop: 32 }}>
				{/* Form fields to collect user information */}
				<TextField
					name="name"
					label={t('form_name')}
					value={userInfo.name}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
					sx={{
						'& label': {
							color: 'var(--tg-theme-button-text-color)',
						},
						'& label.Mui-focused': {
							color: 'var(--tg-theme-button-color)',
						},
						'& .MuiOutlinedInput-root': {
							'& input': {
								color: 'var(--tg-theme-text-color)',
							},
							'& fieldset': {
								borderColor: 'var(--tg-theme-button-text-color)',
							},
							'&:hover fieldset': {
								borderColor: 'var(--tg-theme-hint-color)',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'var(--tg-theme-button-color)',
							},
						},
					}}
				/>
				<TextField
					name="phone"
					label={t('form_phone')}
					value={userInfo.phone}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
					sx={{
						'& label': {
							color: 'var(--tg-theme-button-text-color)',
						},
						'& label.Mui-focused': {
							color: 'var(--tg-theme-button-color)',
						},
						'& .MuiOutlinedInput-root': {
							'& input': {
								color: 'var(--tg-theme-text-color)',
							},
							'& fieldset': {
								borderColor: 'var(--tg-theme-button-text-color)',
							},
							'&:hover fieldset': {
								borderColor: 'var(--tg-theme-hint-color)',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'var(--tg-theme-button-color)',
							},
						},
					}}
				/>
				<TextField
					name="address"
					label={t('form_address')}
					value={userInfo.address}
					onChange={handleInputChange}
					variant="outlined"
					fullWidth
					margin="normal"
					sx={{
						'& label': {
							color: 'var(--tg-theme-button-text-color)',
						},
						'& label.Mui-focused': {
							color: 'var(--tg-theme-button-color)',
						},
						'& .MuiOutlinedInput-root': {
							'& input': {
								color: 'var(--tg-theme-text-color)',
							},
							'& fieldset': {
								borderColor: 'var(--tg-theme-button-text-color)',
							},
							'&:hover fieldset': {
								borderColor: 'var(--tg-theme-hint-color)',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'var(--tg-theme-button-color)',
							},
						},
					}}
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
					sx={{
						'& label': {
							color: 'var(--tg-theme-button-text-color)',
						},
						'& label.Mui-focused': {
							color: 'var(--tg-theme-button-color)',
						},
						'& .MuiOutlinedInput-root': {
							'& input': {
								color: 'var(--tg-theme-text-color)',
							},
							'& fieldset': {
								borderColor: 'var(--tg-theme-button-text-color)',
							},
							'&:hover fieldset': {
								borderColor: 'var(--tg-theme-hint-color)',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'var(--tg-theme-button-color)',
							},
						},
					}}
				/>
			</div>

			{/* Modal */}
			<Dialog open={modalOpen} onClose={handleModalClose}>
				<DialogTitle textAlign={'center'}>{t('cart_order')}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{isDataSending && (
								<CircularProgress style={{ color: 'var(--tg-theme-button-color)' }} />
							)}
						</div>
						{order.status === 'sent' && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexDirection: 'column',
									textAlign: 'center',
								}}>
								<LocalShippingIcon fontSize="56px" style={{ marginBottom: 8 }} />
								<Typography variant="body1">{t('cart_success')}</Typography>
							</div>
						)}
						{order.status === 'error' && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexDirection: 'column',
									textAlign: 'center',
								}}>
								<ErrorIcon fontSize="56px" style={{ marginBottom: 8 }} />
								<Typography variant="body1">{t('cart_error')}</Typography>
							</div>
						)}
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

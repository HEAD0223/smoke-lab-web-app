import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Badge, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useCart } from '../../hooks/useCart';

const useStyles = makeStyles((theme) => ({
	carousel: {
		maxWidth: '80%',
		margin: '0 auto',
	},
	productDetails: {
		marginTop: theme.spacing(4),
	},
	productImage: {
		maxWidth: '400px',
		maxHeight: '400px',
		margin: '0 auto',
		display: 'block',
	},
	flavorCircle: {
		width: 48,
		height: 48,
		borderRadius: '50%',
		margin: '0 8px',
		cursor: 'pointer',
	},
	quantityButtons: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: theme.spacing(2),
	},
	quantityButtonRemove: {
		margin: `${theme.spacing(0)} ${theme.spacing(1)} !important`,
		backgroundColor: theme.palette.error.main,
		color: theme.palette.button_text_color.main,
		padding: `${theme.spacing(0.5)} ${theme.spacing(1)} !important`,
		minWidth: `${theme.spacing(5)} !important`,
	},
	quantityButtonAdd: {
		margin: `${theme.spacing(0)} ${theme.spacing(1)} !important`,
		backgroundColor: theme.palette.button_color.main,
		color: theme.palette.button_text_color.main,
		padding: `${theme.spacing(0.5)} ${theme.spacing(1)} !important`,
		minWidth: `${theme.spacing(5)} !important`,
	},
}));

export const ProductItem = () => {
	const { code } = useParams();
	const classes = useStyles();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { state } = useLocation();
	const product = state.productData;
	const { cart, dispatchState } = useCart();

	const [selectedFlavor, setSelectedFlavor] = useState(null);
	const [selectedFlavors, setSelectedFlavors] = useState([]);
	const [quantity, setQuantity] = useState(0);

	const goBackToList = () => {
		navigate('/');
	};

	const totalAmount = product.flavours.reduce((total, flavour) => {
		return total + parseInt(flavour.amount, 10);
	}, 0);
	const allImages = [product.image, ...product.flavours.map((flavour) => flavour.image)];

	const handleFlavorClick = (flavorIndex) => {
		setSelectedFlavor(flavorIndex);
	};

	const onAdd = (product, newQuantity, flavorName) => {
		console.log(cart);
		setQuantity(newQuantity);
		dispatchState({
			type: 'ADD_TO_CART',
			payload: { product, quantity: newQuantity, flavorName },
		});
	};
	const onRemove = (product, newQuantity, flavorName) => {
		if (newQuantity === 0) {
			setQuantity(0);
		} else {
			setQuantity(newQuantity);
		}
		if (newQuantity === 0) {
			dispatchState({ type: 'REMOVE_PRODUCT_FROM_CART', payload: { product } });
		} else {
			dispatchState({
				type: 'REMOVE_FROM_CART',
				payload: { product, quantity: newQuantity, flavorName },
			});
		}
	};

	useEffect(() => {
		console.log(cart);
	}, []);

	const onAddHandler = () => {
		if (quantity < totalAmount && selectedFlavor !== null) {
			const flavor = product.flavours[selectedFlavor];
			const updatedSelectedFlavors = [...selectedFlavors];
			const existingFlavorIndex = updatedSelectedFlavors.findIndex(
				(f) => f.flavour === flavor.flavour,
			);

			if (existingFlavorIndex !== -1) {
				updatedSelectedFlavors[existingFlavorIndex].quantity += 1;
			} else {
				updatedSelectedFlavors.push({ flavour: flavor.flavour, quantity: 1 });
			}

			setQuantity(quantity + 1);
			setSelectedFlavors(updatedSelectedFlavors);
			onAdd(product, quantity + 1, flavor.flavour);
		}
	};
	const onRemoveHandler = () => {
		if (quantity > 0 && selectedFlavor !== null) {
			const flavor = product.flavours[selectedFlavor];
			const updatedSelectedFlavors = [...selectedFlavors];
			const existingFlavorIndex = updatedSelectedFlavors.findIndex(
				(f) => f.flavour === flavor.flavour,
			);

			if (existingFlavorIndex !== -1) {
				if (updatedSelectedFlavors[existingFlavorIndex].quantity === 1) {
					updatedSelectedFlavors.splice(existingFlavorIndex, 1);
				} else {
					updatedSelectedFlavors[existingFlavorIndex].quantity -= 1;
				}
				setQuantity(quantity - 1);
				setSelectedFlavors(updatedSelectedFlavors);
				onRemove(product, quantity - 1, flavor.flavour);
			}
		}
	};

	const renderSelectedFlavors = () => {
		return selectedFlavors.map((sf, index) => (
			<div key={index}>
				{sf.flavour}: {sf.quantity}
			</div>
		));
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
			}}>
			<Button variant="text" color="primary" style={{ margin: '20px' }} onClick={goBackToList}>
				{t('back_button')}
			</Button>
			<Carousel
				showStatus={false}
				showIndicators={false}
				showArrows={false}
				infiniteLoop={true}
				swipeable={true}
				autoPlay={true}
				selectedItem={selectedFlavor !== null ? selectedFlavor + 1 : 0}
				className={classes.carousel}>
				{allImages.map((image, index) => (
					<div key={index} className={classes.productImage}>
						<img
							src={`data:image/png;base64,${image}` || 'https://source.unsplash.com/random'}
							alt={`Image ${index + 1}`}
						/>
					</div>
				))}
			</Carousel>
			<div className={classes.productDetails}>
				<Typography variant="h4" align="center">
					{product.name}
				</Typography>
				<Typography variant="h5" align="center" marginBottom={2}>
					{product.price} MDL
				</Typography>
				<Typography variant="h6" align="center" marginBottom={6}>
					{t('modal_amount')}
					{totalAmount}
				</Typography>
				{selectedFlavor !== null && (
					<>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-around',
								flexWrap: 'wrap',
							}}>
							<Typography variant="h6">
								{product.flavours[selectedFlavor].flavour}
							</Typography>
							<Typography variant="h6">
								{t('modal_flavour_amount')} {product.flavours[selectedFlavor].amount}
							</Typography>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								marginTop: 12,
							}}>
							<div style={{ marginBottom: 12, marginTop: 8 }}>{renderSelectedFlavors()}</div>
							<Badge
								badgeContent={quantity || 0}
								color="primary"
								style={{ margin: '20px' }}
							/>
							<div>
								{quantity === 0 ? (
									<Button variant="contained" onClick={onAddHandler}>
										{t('card_add')}
									</Button>
								) : (
									<div className={classes.quantityButtons}>
										<Button
											variant="contained"
											className={classes.quantityButtonRemove}
											onClick={onRemoveHandler}>
											<RemoveIcon />
										</Button>
										<Button
											variant="contained"
											className={classes.quantityButtonAdd}
											onClick={onAddHandler}>
											<AddIcon />
										</Button>
									</div>
								)}
							</div>
						</div>
					</>
				)}
				<div
					style={{
						padding: '20px 0',
						marginBottom: 20,
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						gap: 10,
					}}>
					{product.flavours.map((flavour, index) => (
						<Tooltip key={index} title={flavour.flavour} arrow>
							<IconButton
								className={classes.flavorCircle}
								style={{
									background: `linear-gradient(to bottom, ${flavour.gradient1}, ${flavour.gradient2})`,
									border: selectedFlavor === index ? '2px solid #333' : 'none',
								}}
								onClick={() => handleFlavorClick(index)}
								disabled={flavour.amount === 0}></IconButton>
						</Tooltip>
					))}
				</div>
				<Typography variant="h6" align="center" marginTop={4}>
					{t('description')}
				</Typography>
				<Typography variant="body1" align="center" marginBottom={2}>
					{product.description}
				</Typography>
				<Typography variant="subtitle2" align="center" marginTop={2}>
					{t('modal_sku')}
					{code}
				</Typography>
				<Typography variant="subtitle2" align="center">
					{t('modal_manufacturer')}
					{product.manufacturer}
				</Typography>
				{product.volume !== 'None' ? (
					<Typography variant="subtitle2" align="center">
						{t('modal_volume')}: {product.volume}
					</Typography>
				) : null}
			</div>
		</div>
	);
};

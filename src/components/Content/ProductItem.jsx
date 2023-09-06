import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
	Button,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';

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
	listItem: {
		border: `1px solid ${theme.palette.grey[300]}`,
		borderRadius: theme.shape.borderRadius,
		marginBottom: theme.spacing(2),
		padding: theme.spacing(1),
		minWidth: 150,
		margin: '0 auto',
		transition: 'box-shadow 0.3s ease-in-out',
	},
	selectedListItem: {
		boxShadow: `0px 0px 8px 2px ${theme.palette.primary.main}`,
	},
}));

export const ProductItem = () => {
	const { code } = useParams();
	const classes = useStyles();
	const { tg } = useTelegram();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { state } = useLocation();
	const product = state.productData;
	const { cart, dispatchState } = useCart();

	const [selectedFlavor, setSelectedFlavor] = useState(null);
	const [selectedFlavorName, setSelectedFlavorName] = useState(null);
	const [selectedFlavors, setSelectedFlavors] = useState([]);

	useEffect(() => {
		tg.MainButton.hide();
		const productFlavorsInCart = cart.find((item) => item.product.code === product.code);
		if (productFlavorsInCart) {
			console.log(productFlavorsInCart.flavorsInCart);
			setSelectedFlavors(productFlavorsInCart.flavorsInCart);
		}
	}, [tg]);

	const goBackToList = () => {
		navigate('/');
	};

	const totalAmount = product.flavours.reduce((total, flavour) => {
		return total + parseInt(flavour.amount, 10);
	}, 0);
	const allImages = [product.image, ...product.flavours.map((flavour) => flavour.image)];

	const handleFlavorClick = (flavorIndex) => {
		setSelectedFlavor(flavorIndex);
		setSelectedFlavorName(product.flavours[flavorIndex].flavour);
	};

	const onAdd = (product, flavorsInCart) => {
		dispatchState({
			type: 'ADD_TO_CART',
			payload: { product, flavorsInCart },
		});
	};
	const onRemove = (product, flavorsInCart) => {
		const newQuantity = flavorsInCart.reduce((total, flavor) => total + flavor.quantity, 0);

		if (newQuantity === 0) {
			dispatchState({ type: 'REMOVE_PRODUCT_FROM_CART', payload: { product } });
		} else {
			dispatchState({
				type: 'REMOVE_FROM_CART',
				payload: { product, flavorsInCart },
			});
		}
	};

	const onAddHandler = () => {
		if (selectedFlavor !== null) {
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

			setSelectedFlavors(updatedSelectedFlavors);
			onAdd(product, [{ flavour: flavor.flavour, quantity: 1 }]);
		}
	};
	const onRemoveHandler = () => {
		if (selectedFlavor !== null) {
			const flavor = product.flavours[selectedFlavor];
			const updatedSelectedFlavors = [...selectedFlavors];
			const existingFlavorIndex = updatedSelectedFlavors.findIndex(
				(f) => f.flavour === flavor.flavour,
			);

			if (
				existingFlavorIndex !== -1 &&
				updatedSelectedFlavors[existingFlavorIndex].quantity > 0
			) {
				updatedSelectedFlavors[existingFlavorIndex].quantity -= 1;
			}

			setSelectedFlavors(updatedSelectedFlavors);
			onRemove(product, [{ flavour: flavor.flavour, quantity: 1 }]);
		}
	};

	const renderSelectedFlavors = () => {
		return (
			<List>
				{selectedFlavors.map((sf, index) => (
					<Paper
						key={index}
						className={`${classes.listItem} ${
							selectedFlavorName === sf.flavour ? classes.selectedListItem : ''
						}`}
						elevation={3}>
						<ListItem key={index} style={{ width: '90%', margin: '0 auto' }}>
							<ListItemText>
								<Typography variant="h6" align="center">
									{sf.flavour}
								</Typography>
								<Typography variant="subtitle1" align="center">
									{t('quantity')}
									{sf.quantity}
								</Typography>
							</ListItemText>
						</ListItem>
					</Paper>
				))}
			</List>
		);
	};

	const renderFlavors = () => {
		return (
			<List>
				{product.flavours.map((flavour, index) => (
					<ListItem key={index}>
						<ListItemText>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									flexWrap: 'wrap',
								}}>
								<Typography variant="h6" maxWidth={'80%'}>
									{flavour.flavour}
								</Typography>
								<Typography variant="h6">x{flavour.amount}</Typography>
							</div>
						</ListItemText>
					</ListItem>
				))}
			</List>
		);
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
					{product.price}
					{t('currency')}
				</Typography>
				<Typography variant="h6" align="center" marginBottom={2}>
					x{totalAmount}
				</Typography>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						marginTop: 35,
					}}>
					{selectedFlavors.some(
						(sf) => sf.flavour === selectedFlavorName && sf.quantity > 0,
					) ? (
						<div style={{ display: 'flex', gap: 20 }}>
							<Button size="small" variant="contained" onClick={onRemoveHandler}>
								<RemoveIcon />
							</Button>
							<Button size="small" variant="contained" onClick={onAddHandler}>
								<AddIcon />
							</Button>
						</div>
					) : (
						<Button
							size="small"
							variant="contained"
							onClick={onAddHandler}
							disabled={selectedFlavor === null}>
							{t('card_add')}
						</Button>
					)}
				</div>
				<div
					style={{
						padding: '20px 0',
						margin: '10px 0',
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
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						margin: '0 20px',
					}}>
					{renderSelectedFlavors()}
				</div>
				<Typography variant="h6" align="center" marginTop={2}>
					{t('description')}
				</Typography>
				<Typography variant="body1" align="center" marginBottom={2}>
					{product.description}
				</Typography>
				<Typography variant="subtitle2" align="center" marginTop={2}>
					{t('sku')}
					{code}
				</Typography>
				<Typography variant="subtitle2" align="center">
					{t('manufacturer')}
					{product.manufacturer}
				</Typography>
				{product.volume !== 'None' ? (
					<Typography variant="subtitle2" align="center">
						{t('volume')}: {product.volume}
					</Typography>
				) : null}
				<div style={{ marginTop: 12 }}>{renderFlavors()}</div>
			</div>
		</div>
	);
};

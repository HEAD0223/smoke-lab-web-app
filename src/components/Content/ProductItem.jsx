import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
}));

export const ProductItem = () => {
	const { code } = useParams();
	const classes = useStyles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { state } = useLocation();
	const product = state.productData;
	const [selectedFlavor, setSelectedFlavor] = useState(null);

	const totalAmount = product.flavours.reduce((total, flavour) => {
		return total + parseInt(flavour.amount, 10);
	}, 0);
	const allImages = [product.image, ...product.flavours.map((flavour) => flavour.image)];

	const goBackToList = () => {
		navigate('/');
	};

	const handleFlavorClick = (flavorIndex) => {
		setSelectedFlavor(flavorIndex);
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
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-around',
							flexWrap: 'wrap',
						}}>
						<Typography variant="h6">{product.flavours[selectedFlavor].flavour}</Typography>
						<Typography variant="h6">
							{t('modal_flavour_amount')} {product.flavours[selectedFlavor].amount}
						</Typography>
					</div>
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
				<Typography variant="h6" marginTop={2}>
					{t('description')}
				</Typography>
				<Typography variant="body1" marginBottom={2}>
					{product.description}
				</Typography>
				<Typography variant="subtitle2" marginTop={2}>
					{t('modal_sku')}
					{code}
				</Typography>
				<Typography variant="subtitle2">
					{t('modal_manufacturer')}
					{product.manufacturer}
				</Typography>
				{product.volume !== 'None' ? (
					<Typography variant="subtitle2">
						{t('modal_volume')}: {product.volume}
					</Typography>
				) : null}
			</div>
		</div>
	);
};

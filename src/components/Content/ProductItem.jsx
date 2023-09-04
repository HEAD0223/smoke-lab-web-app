import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import { useLocation, useParams } from 'react-router-dom';

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
}));

export const ProductItem = () => {
	const { code } = useParams();
	const classes = useStyles();
	const { t } = useTranslation();
	const { state } = useLocation();
	const product = state.productData;
	console.log(state);
	console.log(product);

	const allImages = [product.image, ...product.flavours.map((flavour) => flavour.image)];

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
			}}>
			<Button variant="text" color="primary" style={{ margin: '20px' }}>
				{t('back_button')}
			</Button>
			<Carousel
				showStatus={false}
				showIndicators={false}
				showArrows={false}
				infiniteLoop={true}
				swipeable={true}
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
				<Typography variant="h4">{product.name}</Typography>
				<Typography variant="subtitle1">
					{t('modal_sku')}: {code}
				</Typography>
				<Typography variant="subtitle1">
					{t('modal_amount')}: {product.amount}
				</Typography>
				<Typography variant="subtitle1">
					{t('modal_price')}: {product.price}
				</Typography>
				<Typography variant="body1">{product.description}</Typography>
				<Typography variant="subtitle1">
					{t('modal_manufacturer')}: {product.manufacturer}
				</Typography>
				<Typography variant="subtitle1">
					{t('modal_volume')}: {product.volume}
				</Typography>
			</div>
		</div>
	);
};

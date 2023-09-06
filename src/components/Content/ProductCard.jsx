import { Badge, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	productCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		backgroundColor: theme.palette.hint_color.main,
		color: theme.palette.text_color.main,
	},
	productImageContainer: {
		position: 'relative',
		height: 120,
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	productImage: {
		height: '100%',
		width: '100%',
		backgroundSize: 'cover',
	},
	badgeContainer: {
		position: 'absolute',
		top: 'auto',
		right: 15,
		bottom: -25,
	},
	badgeBody: {
		color: theme.palette.button_text_color.main,
		'& span': {
			backgroundColor: theme.palette.button_color.main,
		},
	},
	productName: {
		marginBottom: theme.spacing(0.5),
		fontSize: `1rem !important`,
	},
	productPrice: {
		fontSize: `0.75rem !important`,
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-around',
		textAlign: 'center',
		minHeight: 135,
		padding: `10px !important`,
		width: `100%`,
	},
}));

export const ProductCard = ({ product, cart }) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Decode the base64 image data and create a data Image
	const imageSrc = product.image
		? `data:image/png;base64,${product.image}`
		: 'https://source.unsplash.com/random';

	const amountInStock = product.flavours.reduce((total, flavour) => {
		return total + parseInt(flavour.amount, 10);
	}, 0);

	const handleProductClick = () => {
		navigate(`/item/${product.code}`, { state: { productData: product } });
	};

	const cartItem = cart.find((item) => item.product.code === product.code);
	const totalQuantity = cartItem
		? cartItem.flavorsInCart.reduce((total, flavor) => total + flavor.quantity, 0)
		: 0;

	return (
		<Card className={classes.productCard}>
			<div className={classes.productImageContainer}>
				<CardMedia className={classes.productImage} image={imageSrc} title={product.name} />
				{totalQuantity > 0 && (
					<div className={classes.badgeContainer}>
						<Badge badgeContent={totalQuantity} className={classes.badgeBody} />
					</div>
				)}
			</div>
			<CardContent className={classes.cardContent} onClick={handleProductClick}>
				<div>
					{amountInStock === 0 && (
						<Chip
							label={t('card_chip')}
							color="secondary"
							size="small"
							style={{ marginBottom: 4 }}
						/>
					)}
					<Typography variant="h6" className={classes.productName}>
						{product.name}
					</Typography>
					<Typography variant="subtitle1" className={classes.productPrice}>
						{product.price}
						{t('currency')}
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
};

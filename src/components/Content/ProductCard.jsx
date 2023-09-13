import { Badge, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { cart } = useSelector((state) => state.order);

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
		<Card
			onClick={handleProductClick}
			style={{
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				height: '100%',
				backgroundColor: 'var(--tg-theme-hint-color)',
			}}>
			<div
				style={{
					position: 'relative',
					height: 120,
					width: '100%',
				}}>
				<CardMedia
					image={imageSrc}
					title={product.name}
					style={{ height: '100%', width: '100%', backgroundSize: 'cover' }}
				/>
				{totalQuantity > 0 && (
					<div style={{ position: 'absolute', top: 'auto', right: 15, bottom: -25 }}>
						<Badge
							badgeContent={totalQuantity}
							sx={{
								color: 'var(--tg-theme-button-text-color)',
								'& span': { backgroundColor: 'var(--tg-theme-button-color)' },
							}}
						/>
					</div>
				)}
			</div>
			<CardContent
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-around',
					textAlign: 'center',
					minHeight: 135,
					padding: 10,
					width: `100%`,
				}}>
				<div style={{ color: 'var(--tg-theme-text-color)' }}>
					{amountInStock === 0 && (
						<Chip
							label={t('card_chip')}
							color="error"
							size="small"
							style={{ marginBottom: 4 }}
						/>
					)}
					<Typography color={'inherit'} variant="h6" fontSize={16}>
						{product.name}
					</Typography>
					<Typography color={'inherit'} variant="subtitle1" fontSize={12}>
						{product.price}
						{t('currency')}
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
};

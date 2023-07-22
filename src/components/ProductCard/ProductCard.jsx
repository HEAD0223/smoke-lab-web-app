import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Badge, Button, Card, CardContent, CardMedia, Chip, Link, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTelegram } from '../../hooks/useTelegram';
import { ProductModal } from '../ProductModal/ProductModal';

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
		height: 150,
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
	chipContainer: {
		position: 'absolute',
		top: theme.spacing(0.5),
		left: theme.spacing(0.5),
	},
	chipBody: {
		fontSize: `0.6125rem !important`,
		height: `${theme.spacing(2)} !important`,
		borderRadius: `${theme.spacing(1)} !important`,
		'& span': {
			paddingLeft: `${theme.spacing(0.5)} !important`,
			paddingRight: `${theme.spacing(0.5)} !important`,
		},
	},
	productName: {
		marginBottom: theme.spacing(0.5),
		fontSize: `1rem !important`,
	},
	productPrice: {
		fontSize: `0.75rem !important`,
	},
	linkText: {
		color: theme.palette.info.main,
		fontSize: `0.675rem !important`,
	},
	addButton: {
		fontSize: `0.675rem !important`,
		alignSelf: 'flex-end',
		backgroundColor: theme.palette.button_color.main,
		color: theme.palette.button_text_color.main,
		borderRadius: `${theme.spacing(1)} !important`,
		padding: `${theme.spacing(0.5)} ${theme.spacing(1)} !important`,
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		minHeight: 135,
		padding: `${theme.spacing(1.5)} !important`,
		paddingTop: `0px !important`,
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

export const ProductCard = ({ product, quantity = 0, setQuantity, onAdd, onRemove }) => {
	const classes = useStyles();
	const { tg } = useTelegram();
	const { t } = useTranslation();
	const [openModal, setOpenModal] = useState(false);

	const handleModalOpen = () => {
		tg.MainButton.hide();
		setOpenModal(true);
	};
	const handleModalClose = () => {
		tg.MainButton.show();
		setOpenModal(false);
	};

	// Decode the base64 image data and create a data URL
	const imageSrc = product.url
		? `data:image/png;base64,${product.url}`
		: 'https://source.unsplash.com/random';

	const amountInStock = parseInt(product.amount, 10);

	const onAddHandler = () => {
		if (quantity < amountInStock) {
			setQuantity((prevQuantity) => prevQuantity + 1);
			onAdd(product, quantity + 1);
		}
	};
	const onRemoveHandler = () => {
		setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
		onRemove(product, quantity - 1);
	};

	return (
		<Card className={classes.productCard}>
			<div className={classes.productImageContainer}>
				<CardMedia className={classes.productImage} image={imageSrc} title={product.name} />
				{quantity > 0 && (
					<div className={classes.badgeContainer}>
						<Badge badgeContent={quantity} className={classes.badgeBody} />
					</div>
				)}
				{amountInStock === 0 && (
					<div className={classes.chipContainer}>
						<Chip
							label={t('card_chip')}
							color="secondary"
							size="small"
							className={classes.chipBody}
						/>
					</div>
				)}
			</div>
			<CardContent className={classes.cardContent}>
				<div>
					<div>
						<Typography variant="h6" className={classes.productName}>
							{product.name}
						</Typography>
						<Typography variant="subtitle1" className={classes.productPrice}>
							{product.price}
							{t('currency')}
						</Typography>
					</div>
					<div>
						<Link
							component="button"
							variant="body2"
							className={classes.linkText}
							onClick={handleModalOpen}>
							{t('card_modal')}
						</Link>
						<ProductModal
							open={openModal}
							onClose={handleModalClose}
							code={product.code}
							name={product.name}
							amount={product.amount}
							price={product.price}
							description={product.description}
							manufacturer={product.manufacturer}
							url={product.url}
						/>
					</div>
				</div>
				{quantity === 0 ? (
					<Button variant="contained" className={classes.addButton} onClick={onAddHandler}>
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
			</CardContent>
		</Card>
	);
};

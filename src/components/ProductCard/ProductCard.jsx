import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Badge, Button, Card, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
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
		height: 200,
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
		backgroundColor: theme.palette.button_color.main,
		color: theme.palette.button_text_color.main,
	},
	productName: {
		marginBottom: theme.spacing(0.5), // Increase the spacing as needed
	},
	linkText: {
		color: theme.palette.info.main,
	},
	addButton: {
		alignSelf: 'flex-end',
		backgroundColor: theme.palette.button_color.main,
		color: theme.palette.button_text_color.main,
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
		minHeight: 200, // Adjust the height as needed
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
	},
	quantityButtonAdd: {
		margin: `${theme.spacing(0)} ${theme.spacing(1)} !important`,
		backgroundColor: theme.palette.button_color.main,
		color: theme.palette.button_text_color.main,
	},
}));

export const ProductCard = ({ name, price, description }) => {
	const classes = useStyles();
	const [quantity, setQuantity] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	const handleAdd = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};
	const handleRemove = () => {
		setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
	};

	const handleModalOpen = () => {
		setOpenModal(true);
	};
	const handleModalClose = () => {
		setOpenModal(false);
	};

	return (
		<Card className={classes.productCard}>
			<div className={classes.productImageContainer}>
				<CardMedia
					className={classes.productImage}
					image="https://source.unsplash.com/random"
					title={name}
				/>
				{quantity > 0 && (
					<div className={classes.badgeContainer}>
						<Badge badgeContent={quantity} className={classes.badgeBody} />
					</div>
				)}
			</div>
			<CardContent className={classes.cardContent}>
				<div>
					<Typography variant="h6" className={classes.productName}>
						{name}
					</Typography>
					<Typography variant="subtitle1">Price: {price}</Typography>
				</div>
				<div>
					<Link
						component="button"
						variant="body2"
						className={classes.linkText}
						onClick={handleModalOpen}>
						See more
					</Link>
					<ProductModal
						open={openModal}
						onClose={handleModalClose}
						name={name}
						price={price}
						description={description}
					/>
				</div>
				{quantity === 0 ? (
					<Button
						variant="contained"
						className={classes.addButton}
						startIcon={<AddIcon />}
						onClick={handleAdd}>
						Add
					</Button>
				) : (
					<div className={classes.quantityButtons}>
						<Button
							variant="contained"
							className={classes.quantityButtonRemove}
							onClick={handleRemove}>
							<RemoveIcon />
						</Button>
						<Button
							variant="contained"
							className={classes.quantityButtonAdd}
							onClick={handleAdd}>
							<AddIcon />
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

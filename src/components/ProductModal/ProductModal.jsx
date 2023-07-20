import { Box, Modal, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	modalContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 30,
	},
	modalContent: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[20],
		padding: theme.spacing(4),
		outline: 'none',
		borderRadius: theme.spacing(2),
		maxWidth: 400,
		width: '100%',
	},
	productImage: {
		width: '100%',
		height: 'auto',
		borderRadius: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
}));

export const ProductModal = ({
	open,
	onClose,
	code,
	name,
	amount,
	price,
	description,
	manufacturer,
	url,
}) => {
	const classes = useStyles();

	// Decode the base64 image data and create a data URL
	const imageSrc = url ? `data:image/png;base64,${url}` : 'https://source.unsplash.com/random';

	return (
		<Modal open={open} onClose={onClose} className={classes.modalContainer}>
			<Paper className={classes.modalContent}>
				<Box display="flex" flexDirection="column" alignItems="center">
					<img src={imageSrc} alt={name} className={classes.productImage} />
					<Typography variant="h6">{name}</Typography>
					<Typography variant="subtitle1">Price: {price}</Typography>
					<Typography variant="subtitle1">SKU: {code}</Typography>
					<Typography variant="subtitle1">Amount: {amount}</Typography>
					<Typography variant="body1">{description}</Typography>
					<Typography variant="subtitle1">Manufacturer: {manufacturer}</Typography>
				</Box>
			</Paper>
		</Modal>
	);
};

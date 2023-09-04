import { Box, Modal, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
	modalContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 50,
	},
	modalContent: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `${theme.shadows[20]} !important`,
		padding: theme.spacing(0.5),
		outline: 'none',
		borderRadius: `${theme.spacing(1)} !important`,
		maxWidth: 400,
		width: '100%',
	},
	productImage: {
		width: 'auto',
		height: '200px',
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
	image,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();

	// Decode the base64 image data and create a data Image
	const imageSrc = image ? `data:image/png;base64,${image}` : 'https://source.unsplash.com/random';

	return (
		<Modal open={open} onClose={onClose} className={classes.modalContainer}>
			<Paper className={classes.modalContent}>
				<Box display="flex" flexDirection="column" alignItems="center">
					<img src={imageSrc} alt={name} className={classes.productImage} />
					<Typography variant="h6">{name}</Typography>
					<Typography variant="subtitle1">
						{t('modal_price')}
						{price}
						{t('currency')}
					</Typography>
					<Typography variant="subtitle1">
						{t('modal_sku')}
						{code}
					</Typography>
					<Typography variant="subtitle1">
						{t('modal_amount')}
						{amount}
					</Typography>
					<Typography variant="body1">{description}</Typography>
					<Typography variant="subtitle1">
						{t('modal_manufacturer')}
						{manufacturer}
					</Typography>
				</Box>
			</Paper>
		</Modal>
	);
};

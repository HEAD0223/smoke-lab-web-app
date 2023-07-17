import { Modal, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	modalContent: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: theme.palette.hint_color.main,
		color: theme.palette.text_color.main,
		boxShadow: theme.shadows[20],
		padding: theme.spacing(4),
		outline: 'none',
	},
}));

export const ProductModal = ({ open, onClose, name, price, description }) => {
	const classes = useStyles();

	return (
		<Modal open={open} onClose={onClose}>
			<div className={classes.modalContent}>
				<Typography variant="h6">{name}</Typography>
				<Typography variant="subtitle1">Price: {price}</Typography>
				<Typography variant="body1">{description}</Typography>
			</div>
		</Modal>
	);
};

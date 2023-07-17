import { AppBar, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';

const useStyles = makeStyles((theme) => ({
	appBar: {
		backgroundColor: theme.palette.bg_color,
		color: theme.palette.text_color,
	},
	logo: {
		marginRight: theme.spacing(2),
	},
	username: {
		flexGrow: 1,
	},
}));

export const Header = () => {
	const classes = useStyles();
	const { user } = useTelegram();

	return (
		<AppBar position="static" className={classes.appBar}>
			<Toolbar>
				<div className={classes.logo}>
					<Typography variant="h6">Logo</Typography>
				</div>
				<div className={classes.username}>
					<Typography variant="h6" align="right">
						Username
					</Typography>
				</div>
			</Toolbar>
		</AppBar>
	);
};

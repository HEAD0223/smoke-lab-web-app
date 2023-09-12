import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';

export const Header = () => {
	const { user } = useTelegram();

	return (
		<AppBar
			position="static"
			style={{
				backgroundColor: 'var(--tg-theme-button-color)',
				color: 'var(--tg-theme-button-text-color)',
			}}>
			<Toolbar>
				<div style={{ marginRight: 16 }}>
					<Typography variant="h6">Logo</Typography>
				</div>
				<div style={{ flexGrow: 1 }}>
					<Typography variant="h6" align="right">
						{user?.username}
					</Typography>
				</div>
			</Toolbar>
		</AppBar>
	);
};

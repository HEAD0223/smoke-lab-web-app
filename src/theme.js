import { createTheme } from '@mui/material/styles';
import { useTelegram } from './hooks/useTelegram';

const { user } = useTelegram();

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			main: '#90caf9',
		},
		secondary: {
			main: '#ce93d8',
		},
		error: {
			main: '#f44336',
		},
		warning: {
			main: '#ffa726',
		},
		info: {
			main: '#29b6f6',
		},
		success: {
			main: '#66bb6a',
		},
		bg_color: {
			main: user?.bg_color,
		},
		text_color: {
			main: user?.text_color,
		},
		hint_color: {
			main: user?.hint_color,
		},
		link_color: {
			main: user?.link_color,
		},
		button_color: {
			main: user?.button_color,
		},
		button_text_color: {
			main: user?.button_text_color,
		},
		secondary_bg_color: {
			main: user?.secondary_bg_color,
		},
	},
});

export default theme;

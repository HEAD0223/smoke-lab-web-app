import { createTheme } from '@mui/material/styles';
import { useTelegram } from './hooks/useTelegram';

const { themeParams } = useTelegram();

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			main: themeParams?.bg_color,
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
			main: themeParams?.bg_color,
		},
		text_color: {
			main: themeParams?.text_color,
		},
		hint_color: {
			main: themeParams?.hint_color,
		},
		link_color: {
			main: themeParams?.link_color,
		},
		button_color: {
			main: themeParams?.button_color,
		},
		button_text_color: {
			main: themeParams?.button_text_color,
		},
		secondary_bg_color: {
			main: themeParams?.secondary_bg_color,
		},
	},
});

export default theme;

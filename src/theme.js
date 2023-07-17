import { createTheme } from '@mui/material/styles';
import { useTelegram } from './hooks/useTelegram';

const { themeParams } = useTelegram();

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
			main: themeParams?.bg_color + ' !important',
		},
		text_color: {
			main: themeParams?.text_color + ' !important',
		},
		hint_color: {
			main: themeParams?.hint_color + ' !important',
		},
		link_color: {
			main: themeParams?.link_color + ' !important',
		},
		button_color: {
			main: themeParams?.button_color + ' !important',
		},
		button_text_color: {
			main: themeParams?.button_text_color + ' !important',
		},
		secondary_bg_color: {
			main: themeParams?.secondary_bg_color + ' !important',
		},
	},
});

export default theme;

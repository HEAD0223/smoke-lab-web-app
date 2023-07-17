import { createTheme } from '@mui/material/styles';
import { useTelegram } from './hooks/useTelegram';

const { themeParams } = useTelegram();

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			main: '#90caf9 !important',
		},
		secondary: {
			main: '#ce93d8 !important',
		},
		error: {
			main: '#f44336 !important',
		},
		warning: {
			main: '#ffa726 !important',
		},
		info: {
			main: '#29b6f6 !important',
		},
		success: {
			main: '#66bb6a !important',
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

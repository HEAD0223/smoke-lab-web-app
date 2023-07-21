import { CssBaseline, ThemeProvider } from '@mui/material';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { useTelegram } from './hooks/useTelegram';
import store from './redux/store';
import theme from './theme';

const { user } = useTelegram();
const userLanguageCode = user?.language_code;

// Localisation
i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(HttpApi)
	.init({
		debug: true,
		supportedLngs: ['en', 'ru', 'ro'],
		fallbackLng: 'en',
		lng: userLanguageCode,
		backend: {
			loadPath: '/assets/locales/{{lng}}/translation.json',
		},
	});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<Provider store={store}>
				<CssBaseline />
				<App />
			</Provider>
		</BrowserRouter>
	</ThemeProvider>,
);

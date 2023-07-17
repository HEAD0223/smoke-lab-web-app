import { CssBaseline, ThemeProvider } from '@mui/material';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';
import theme from './theme';

// Localisation
i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(LanguageDetector)
	.use(HttpApi)
	.init({
		supportedLngs: ['en', 'ru', 'ro'],
		fallbackLng: 'en',
		detection: {
			order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
			caches: ['cookie'],
		},
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

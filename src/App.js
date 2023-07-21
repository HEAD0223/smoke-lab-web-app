import { makeStyles } from '@mui/styles';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Cart } from './components/Cart/Cart';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
import { CartProvider } from './hooks/useCart';
import { useTelegram } from './hooks/useTelegram';
import { fetchManufacturers } from './redux/slices/manufacturers';
import { fetchProducts } from './redux/slices/products';

const useStyles = makeStyles((theme) => ({
	body: {
		backgroundColor: theme.palette.bg_color.main,
		color: theme.palette.text_color.main,
	},
}));

function App() {
	const classes = useStyles();
	const { tg, user } = useTelegram();
	const dispatch = useDispatch();

	useEffect(() => {
		const setLanguageCookie = (languageCode) => {
			Cookies.set('lng', languageCode, { expires: 1 }); // Expires in 1 day
		};

		tg.ready();

		const userLanguageCode = user?.language_code;
		if (userLanguageCode) {
			setLanguageCookie(userLanguageCode);
		}

		dispatch(fetchManufacturers());
		dispatch(fetchProducts());
	}, [dispatch, tg, user?.language_code]);

	return (
		<div className={classes.body}>
			<CartProvider>
				<Header />
				<Routes>
					<Route index element={<ProductList />} />
					<Route path="/cart" element={<Cart />} />
				</Routes>
			</CartProvider>
		</div>
	);
}

export default App;

import { makeStyles } from '@mui/styles';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Cart } from './components/Cart/Cart';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
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
		tg.ready();
		const languageCode = user?.language_code;
		// Set the language code as a cookie with an expiration date
		Cookies.set('lng', languageCode, { expires: 7 }); // Expires in 7 days
		dispatch(fetchManufacturers());
		dispatch(fetchProducts());
	}, []);

	return (
		<div className={classes.body}>
			<Header />
			<Routes>
				<Route index element={<ProductList />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/form" element={<Form />} />
			</Routes>
		</div>
	);
}

export default App;

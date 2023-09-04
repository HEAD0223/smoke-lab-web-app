import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Cart } from './components/Cart/Cart';
import { ProductItem } from './components/Content/ProductItem';
import { ProductList } from './components/Content/ProductList';
import { Header } from './components/Utils/Header';
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
	const { tg } = useTelegram();
	const dispatch = useDispatch();

	useEffect(() => {
		tg.ready();
		dispatch(fetchManufacturers());
		dispatch(fetchProducts());
	}, [dispatch, tg]);

	return (
		<div className={classes.body}>
			<CartProvider>
				<Header />
				<Routes>
					<Route index element={<ProductList />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/item/:code" element={<ProductItem />} />
				</Routes>
			</CartProvider>
		</div>
	);
}

export default App;

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Cart } from './components/Cart/Cart';
import { ProductItem } from './components/Content/ProductItem';
import { ProductList } from './components/Content/ProductList';
import { Header } from './components/Utils/Header';
import { useTelegram } from './hooks/useTelegram';
import { fetchManufacturers } from './redux/slices/manufacturers';
import { fetchProducts } from './redux/slices/products';

function App() {
	const { tg } = useTelegram();
	const dispatch = useDispatch();

	useEffect(() => {
		tg.ready();
		dispatch(fetchManufacturers());
		dispatch(fetchProducts());
	}, [dispatch, tg]);

	return (
		<div
			style={{
				backgroundColor: 'var(--tg-theme-bg-color)',
				color: 'var(--tg-theme-text-color)',
			}}>
			<Header />
			<Routes>
				<Route index element={<ProductList />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/item/:code" element={<ProductItem />} />
			</Routes>
		</div>
	);
}

export default App;

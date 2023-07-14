import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
import { useTelegram } from './hooks/useTelegram';
import { fetchProducts } from './redux/slices/products';

function App() {
	const { tg, user } = useTelegram();
	const dispatch = useDispatch();

	useEffect(() => {
		tg.ready();
		const languageCode = user?.language_code;
		// Set the language code as a cookie with an expiration date
		Cookies.set('i18next', languageCode, { expires: 7 }); // Expires in 7 days
		dispatch(fetchProducts());
	}, []);

	return (
		<div>
			<Header />
			<Routes>
				<Route index element={<ProductList />} />
				<Route path="form" element={<Form />} />
			</Routes>
		</div>
	);
}

export default App;

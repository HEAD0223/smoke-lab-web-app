import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { ProductList } from './components/ProductList/ProductList';
import { getProducts } from './db/Stock';
import { useTelegram } from './hooks/useTelegram';

function App() {
	const { tg } = useTelegram();

	useEffect(() => {
		tg.ready();
		getProducts();
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

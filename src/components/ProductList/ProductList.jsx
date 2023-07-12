import React, { useState } from 'react';
import { ProductItem } from '../ProductItem/ProductItem';
import './ProductList.css';

const products = [
	{ id: '1', title: 'Product 1', price: 5000, description: 'Blue, Warm' },
	{ id: '2', title: 'Product 2', price: 12000, description: 'Green, Cold' },
	{ id: '3', title: 'Product 3', price: 5500, description: 'Red, Warm' },
	{ id: '4', title: 'Product 4', price: 222, description: 'Black, Cold' },
	{ id: '5', title: 'Product 5', price: 7000, description: 'White, Warm' },
	{ id: '6', title: 'Product 6', price: 600, description: 'Yellow, Cold' },
	{ id: '7', title: 'Product 7', price: 8800, description: 'Pink, Warm' },
	{ id: '8', title: 'Product 8', price: 25000, description: 'Purple, Cold' },
];

const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return (acc += item.price);
	}, 0);
};

export const ProductList = () => {
	const [addedItems, setAddedItems] = useState([]);

	const onAdd = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems = [];

		if (alreadyAdded) {
			newItems = addedItems.filter((item) => item.id !== product.id);
		} else {
			newItems = [...addedItems, product];
		}

		setAddedItems(newItems);

		if (newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Buy ${getTotalPrice(newItems)}`,
			});
		}
	};

	return (
		<div className={'list'}>
			{products.map((item) => (
				<ProductItem product={item} onAdd={onAdd} className={'item'} />
			))}
		</div>
	);
};

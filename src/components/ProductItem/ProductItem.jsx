import React from 'react';
import { Button } from '../Button/Button';
import './ProductItem.css';

export const ProductItem = ({ product, className, onAdd }) => {
	const onAddHandler = () => {
		onAdd(product);
	};

	return (
		<div className={'product ' + className}>
			<div className={'img'}></div>
			<div className={'title'}>{product.name}</div>
			<div className={'description'}>{product.url}</div>
			<div className={'price'}>
				<span>
					Cost: <b>{product.amount}</b>
				</span>
			</div>
			<Button className={'add-btn'} onClick={onAddHandler}>
				Add to Cart
			</Button>
		</div>
	);
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import './ProductItem.css';

export const ProductItem = ({ product, className, onAdd }) => {
	// Translation
	const { t } = useTranslation();

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
				{t('add_to_cart')}
			</Button>
		</div>
	);
};

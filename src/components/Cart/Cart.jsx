import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export const Cart = () => {
	const navigate = useNavigate();
	const { cart, setCart } = useCart();

	const handleEditClick = () => {
		navigate('/');
	};

	return (
		<div>
			<h2>Cart</h2>
			{cart.map((item) => (
				<div key={item.code}>
					<p>Name: {item.name}</p>
					<p>Quantity: {item.quantity}</p>
					<p>Price: {item.price}</p>
				</div>
			))}

			{/* Add your comment input here */}
			<button onClick={handleEditClick}>Edit</button>
		</div>
	);
};

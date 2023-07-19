import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Cart = () => {
	const location = useLocation();
	const { cart } = location.state;
	const navigate = useNavigate();

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

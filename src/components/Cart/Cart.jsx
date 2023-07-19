import React from 'react';

export const Cart = () => {
	const location = useLocation();
	const { cart } = location.state;

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
		</div>
	);
};

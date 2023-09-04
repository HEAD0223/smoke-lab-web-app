import { LinearProgress, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTelegram } from '../../hooks/useTelegram';
import { Filters } from '../Utils/Filters';
import { Chasers } from './Chasers';
import { ESigs } from './ESigs';

const useStyles = makeStyles((theme) => ({
	filterContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: theme.spacing(4),
		backgroundColor: theme.palette.bg_color.main,
	},
}));

export const ProductList = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { tg } = useTelegram();
	const { t } = useTranslation();
	const { cart, dispatchState } = useCart();
	const [quantities, setQuantities] = useState({});

	const { products } = useSelector((state) => state.products);
	const isProductsLoading = products.status === 'loading' || products.status === 'error';
	const { manufacturers } = useSelector((state) => state.manufacturers);
	const isManufacturersLoading =
		manufacturers.status === 'loading' || manufacturers.status === 'error';
	const [selectedManufacturers, setSelectedManufacturers] = useState([]);
	const [searchText, setSearchText] = useState('');

	const [selectedTab, setSelectedTab] = useState(0);
	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const getTotalPrice = (items) => {
		return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
	};

	const filteredProducts = [...products.items]; // Make a copy of the original array
	// Filter products based on selected manufacturers and search text
	const filteredAndSortedProducts = filteredProducts
		.filter((product) => {
			if (
				selectedManufacturers.length === 0 ||
				selectedManufacturers.includes(product.manufacturer)
			) {
				// Check if the manufacturer is selected or no manufacturers are selected
				if (searchText === '') {
					return true; // Show all products if no search text
				}
				return product.name.toLowerCase().includes(searchText.toLowerCase()); // Filter by product name
			}
			return false;
		})
		.sort((a, b) => b.amount - a.amount); // Sort the products in descending order based on the amount

	const esigsProducts = filteredAndSortedProducts.filter((product) => product.volume === 'None');
	const chasersProducts = filteredAndSortedProducts.filter((product) => product.volume !== 'None');
	// Function to handle selection change in Filter component
	const handleManufacturerSelection = (selectedOptions) => {
		setSelectedManufacturers(selectedOptions);
	};

	// Function to filter products by name
	const onSearchByName = (text) => {
		setSearchText(text);
	};

	// Function to handle adding products to the cart
	const onAdd = (product, quantity) => {
		// Update the quantity in the local state
		setQuantities((prevQuantities) => ({
			...prevQuantities,
			[product.code]: quantity,
		}));
		// Update the quantity in the cart state using the dispatch function
		dispatchState({ type: 'ADD_TO_CART', payload: { product, quantity } });
	};
	// Function to handle removing products from the cart
	const onRemove = (product, quantity) => {
		// If the quantity is 0, remove the product from the local state
		if (quantity === 0) {
			setQuantities((prevQuantities) => ({
				...prevQuantities,
				[product.code]: undefined,
			}));
		} else {
			// Otherwise, update the quantity in the local state
			setQuantities((prevQuantities) => ({
				...prevQuantities,
				[product.code]: quantity,
			}));
		}

		// Update the quantity in the cart state using the dispatch function
		if (quantity === 0) {
			dispatchState({ type: 'REMOVE_PRODUCT_FROM_CART', payload: { product } });
		} else {
			dispatchState({ type: 'REMOVE_FROM_CART', payload: { product, quantity } });
		}
	};

	useEffect(() => {
		// Update the quantities state based on the products in the cart
		const newQuantities = {};
		cart.forEach((item) => {
			newQuantities[item.code] = item.quantity;
		});
		setQuantities(newQuantities);

		// Hide or show the MainButton based on the cart items
		if (cart.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			const totalPrice = getTotalPrice(cart);
			tg.MainButton.setParams({
				text: `${t('tg_buy')}${totalPrice}`,
			});
		}
	}, [cart, tg]);

	const onSendData = useCallback(() => {
		navigate('/cart');
		tg.MainButton.setParams({
			text: `${t('tg_order')}`,
		});
	}, [cart, navigate]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	return (
		<>
			{isProductsLoading && <LinearProgress />}
			<div className={classes.filterContainer}>
				{/* Pass handleManufacturerSelection as a callback to Filter component */}
				<Filters
					manufacturers={manufacturers.items}
					isManufacturersLoading={isManufacturersLoading}
					onSelectManufacturers={handleManufacturerSelection}
					onSearchByName={onSearchByName}
					searchText={searchText}
					setSearchText={setSearchText}
				/>
			</div>
			{/* Tabs */}
			<Tabs
				style={{ marginBottom: 16 }}
				value={selectedTab}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				centered>
				<Tab label="e-Sigs" />
				<Tab label="Chasers" />
			</Tabs>
			{/* Products */}
			{selectedTab === 0 && (
				<ESigs
					isProductsLoading={isProductsLoading}
					filteredAndSortedProducts={esigsProducts}
					quantities={quantities}
					setQuantities={setQuantities}
					onAdd={onAdd}
					onRemove={onRemove}
				/>
			)}
			{selectedTab === 1 && (
				<Chasers
					isProductsLoading={isProductsLoading}
					filteredAndSortedProducts={chasersProducts}
					quantities={quantities}
					setQuantities={setQuantities}
					onAdd={onAdd}
					onRemove={onRemove}
				/>
			)}
		</>
	);
};

import { LinearProgress, Tab, Tabs } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { Filters } from '../Utils/Filters';
import { ECigs } from './ECigs';
import { Liquid } from './Liquid';

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

	const { cart } = useSelector((state) => state.order);
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

	const getTotalPrice = (cart) => {
		return cart.reduce((total, cartItem) => {
			const itemPrice = parseFloat(cartItem.product.price);

			// Calculate the total price for each flavor in the item
			const flavorTotal = cartItem.flavorsInCart.reduce((flavorTotal, flavor) => {
				return flavorTotal + itemPrice * flavor.quantity;
			}, 0);

			return total + flavorTotal;
		}, 0);
	};

	const filteredProducts = [...products.items];
	const calculateTotalAmount = (product) => {
		return product.flavours.reduce((total, flavour) => {
			return total + parseInt(flavour.amount, 10);
		}, 0);
	};
	// Filter products based on selected manufacturers and search text
	const filteredAndSortedProducts = filteredProducts
		.filter((product) => {
			if (
				selectedManufacturers.length === 0 ||
				selectedManufacturers.includes(product.manufacturer)
			) {
				if (searchText === '') {
					return true;
				}
				return product.name.toLowerCase().includes(searchText.toLowerCase());
			}
			return false;
		})
		.sort((a, b) => {
			const totalAmountA = calculateTotalAmount(a);
			const totalAmountB = calculateTotalAmount(b);

			if (totalAmountA === 0 && totalAmountB !== 0) {
				return 1;
			} else if (totalAmountA !== 0 && totalAmountB === 0) {
				return -1;
			} else {
				return totalAmountB - totalAmountA;
			}
		});

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

	useEffect(() => {
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
			<div style={{ backgroundColor: 'var(--tg-color-scheme)' }}>--tg-color-scheme</div>
			<div style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>--tg-theme-bg-color</div>
			<div style={{ backgroundColor: 'var(--tg-theme-button-color)' }}>
				--tg-theme-button-color
			</div>
			<div style={{ backgroundColor: 'var(--tg-theme-button-text-color)' }}>
				--tg-theme-button-text-color
			</div>
			<div style={{ backgroundColor: 'var(--tg-theme-hint-color)' }}>--tg-theme-hint-color</div>
			<div style={{ backgroundColor: 'var(--tg-theme-link-color)' }}>--tg-theme-link-color</div>
			<div style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
				--tg-theme-secondary-bg-color
			</div>
			<div style={{ backgroundColor: 'var(--tg-theme-text-color)' }}>--tg-theme-text-color</div>

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
				<Tab label={t('tabECigs')} />
				<Tab label={t('tabLiquid')} />
			</Tabs>
			{/* Products */}
			{selectedTab === 0 && (
				<ECigs
					isProductsLoading={isProductsLoading}
					filteredAndSortedProducts={esigsProducts}
				/>
			)}
			{selectedTab === 1 && (
				<Liquid
					isProductsLoading={isProductsLoading}
					filteredAndSortedProducts={chasersProducts}
				/>
			)}
		</>
	);
};

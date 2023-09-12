import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Filters = ({
	manufacturers,
	isManufacturersLoading,
	onSelectManufacturers,
	onSearchByName,
	searchText,
	setSearchText,
}) => {
	const { t } = useTranslation();
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		// Notify the parent component of changes to selected manufacturers
		onSelectManufacturers(selectedOptions);
	}, [selectedOptions, onSelectManufacturers]);

	const handleManufacturerCheckboxChange = (manufacturerName) => {
		setSelectedOptions((prevSelectedOptions) => {
			if (prevSelectedOptions.includes(manufacturerName)) {
				// If the manufacturer is already selected, remove it
				return prevSelectedOptions.filter((name) => name !== manufacturerName);
			} else {
				// If the manufacturer is not selected, add it
				return [...prevSelectedOptions, manufacturerName];
			}
		});
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 16,
				width: 300,
				marginBottom: 16,
			}}>
			{isManufacturersLoading ? (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<CircularProgress style={{ color: 'var(--tg-theme-button-color)' }} />
				</div>
			) : (
				<>
					<TextField
						label={t('search')}
						variant="outlined"
						value={searchText}
						style={{ color: 'var(--tg-theme-text-color)' }}
						onChange={(e) => {
							setSearchText(e.target.value);
							onSearchByName(e.target.value);
						}}
					/>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							width: '100%',
							gap: 8,
						}}>
						{manufacturers.map((manufacturer) => (
							<div key={manufacturer.name}>
								<label>
									<input
										type="checkbox"
										value={manufacturer.name}
										checked={selectedOptions.includes(manufacturer.name)}
										onChange={() => handleManufacturerCheckboxChange(manufacturer.name)}
										style={{ marginRight: 6 }}
									/>
									{manufacturer.name}
								</label>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

import { Checkbox, CircularProgress, FormControlLabel, FormGroup, TextField } from '@mui/material';
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
						sx={{
							'& label': {
								color: 'var(--tg-theme-button-text-color)',
							},
							'& label.Mui-focused': {
								color: 'var(--tg-theme-button-color)',
							},
							'& .MuiOutlinedInput-root': {
								'& input': {
									color: 'var(--tg-theme-text-color)',
								},
								'& fieldset': {
									borderColor: 'var(--tg-theme-button-text-color)',
								},
								'&:hover fieldset': {
									borderColor: 'var(--tg-theme-hint-color)',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'var(--tg-theme-button-color)',
								},
							},
						}}
						onChange={(e) => {
							setSearchText(e.target.value);
							onSearchByName(e.target.value);
						}}
					/>
					<FormGroup row>
						{manufacturers.map((manufacturer) => (
							<div key={manufacturer.name}>
								<FormControlLabel
									control={
										<Checkbox
											sx={{
												color: 'var(--tg-theme-button-text-color)',
												'&.Mui-checked': {
													color: 'var(--tg-theme-button-color)',
												},
											}}
										/>
									}
									value={manufacturer.name}
									checked={selectedOptions.includes(manufacturer.name)}
									onChange={() => handleManufacturerCheckboxChange(manufacturer.name)}
									label={manufacturer.name}
								/>
							</div>
						))}
					</FormGroup>
				</>
			)}
		</div>
	);
};

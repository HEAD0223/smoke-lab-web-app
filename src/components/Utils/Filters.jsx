import { CircularProgress, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Filters.css';

const useStyles = makeStyles((theme) => ({
	filterContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: theme.spacing(2),
		marginBottom: theme.spacing(2),
		width: 300,
	},
	circularProgressContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	circularProgress: {
		color: theme.palette.button_color.main,
	},
	checkboxContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '100%',
		gap: theme.spacing(1),
	},
}));

export const Filters = ({
	manufacturers,
	isManufacturersLoading,
	onSelectManufacturers,
	onSearchByName,
	searchText,
	setSearchText,
}) => {
	const classes = useStyles();
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
		<div className={classes.filterContainer}>
			{isManufacturersLoading ? (
				<div className={classes.circularProgressContainer}>
					<CircularProgress className={classes.circularProgress} />
				</div>
			) : (
				<>
					<TextField
						label={t('search')}
						variant="outlined"
						value={searchText}
						onChange={(e) => {
							setSearchText(e.target.value);
							onSearchByName(e.target.value);
						}}
					/>
					<div className={classes.checkboxContainer}>
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

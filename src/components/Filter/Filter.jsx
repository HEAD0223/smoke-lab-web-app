import { Autocomplete, Checkbox, CircularProgress, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTelegram } from '../../hooks/useTelegram';
import './Filter.css';

const useStyles = makeStyles((theme) => ({
	filterContainer: {
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
}));

export const Filter = ({ onSelectManufacturers }) => {
	const classes = useStyles();
	const { tg } = useTelegram();
	const { t } = useTranslation();

	const { manufacturers } = useSelector((state) => state.manufacturers);
	const isManufacturersLoading =
		manufacturers.status === 'loading' || manufacturers.status === 'error';
	const [selectedOptions, setSelectedOptions] = useState([]);

	// Create the options array dynamically from the manufacturers in Redux state
	const options = manufacturers.items.map((manufacturer) => manufacturer.name);

	const handleOptionChange = (event, value) => {
		tg.impactOccurred(medium);
		setSelectedOptions(value);
		// Pass the selected manufacturers back to the parent component
		onSelectManufacturers(value);
	};

	return (
		<div className={classes.filterContainer}>
			{isManufacturersLoading ? (
				// Display a CircularProgress while manufacturers are loading
				<div className={classes.circularProgressContainer}>
					<CircularProgress className={classes.circularProgress} />
				</div>
			) : (
				// Render the Autocomplete component when manufacturers are loaded
				<Autocomplete
					multiple
					options={options}
					value={selectedOptions}
					onChange={handleOptionChange}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							label={t('filter_label')}
							placeholder={t('filter_placeholder')}
						/>
					)}
					renderOption={(props, option) => (
						<li {...props}>
							<Checkbox checked={selectedOptions.includes(option)} />
							{option}
						</li>
					)}
				/>
			)}
		</div>
	);
};

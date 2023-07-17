import { Autocomplete, Checkbox, CircularProgress, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Filter.css';

const useStyles = makeStyles((theme) => ({
	filterContainer: {
		marginBottom: theme.spacing(2),
		width: 300,
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
	const { manufacturers } = useSelector((state) => state.manufacturers);
	const isManufacturersLoading =
		manufacturers.status === 'loading' || manufacturers.status === 'error';
	const [selectedOptions, setSelectedOptions] = useState([]);

	// Create the options array dynamically from the manufacturers in Redux state
	const options = manufacturers.items.map((manufacturer) => manufacturer.name);

	const handleOptionChange = (event, value) => {
		setSelectedOptions(value);
		// Pass the selected manufacturers back to the parent component
		onSelectManufacturers(value);
	};

	return (
		<div className={classes.filterContainer}>
			{isManufacturersLoading ? (
				// Display a CircularProgress while manufacturers are loading
				<CircularProgress className={classes.circularProgress} />
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
							label="Filter Options"
							placeholder="Select options"
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

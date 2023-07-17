import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

const useStyles = makeStyles((theme) => ({
	filterContainer: {
		marginBottom: theme.spacing(2),
		width: 300,
	},
}));

export const Filter = () => {
	const classes = useStyles();
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleOptionChange = (event, value) => {
		setSelectedOptions(value);
	};

	return (
		<div className={classes.filterContainer}>
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
		</div>
	);
};

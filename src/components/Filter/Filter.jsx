import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

const useStyles = makeStyles((theme) => ({
	filterContainer: {
		marginBottom: theme.spacing(2),
		width: 300,
		color: theme.palette.text_color.main,
	},
	filterTextField: { color: theme.palette.text_color.main },
	filterList: { color: theme.palette.text_color.main },
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
						className={classes.filterTextField}
						{...params}
						variant="outlined"
						label="Filter Options"
						placeholder="Select options"
					/>
				)}
				renderOption={(props, option) => (
					<li className={classes.filterList} {...props}>
						<Checkbox checked={selectedOptions.includes(option)} />
						{option}
					</li>
				)}
			/>
		</div>
	);
};

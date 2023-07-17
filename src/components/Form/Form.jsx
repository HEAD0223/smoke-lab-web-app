import React, { useCallback, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

export const Form = () => {
	const [country, setCountry] = useState('');
	const [street, setStreet] = useState('');
	const [subject, setSubject] = useState('physical');
	const { tg } = useTelegram();

	const onSendData = useCallback(() => {
		const data = {
			country,
			street,
			subject,
		};
		tg.sendData(JSON.stringify(data));
	}, [country, street, subject]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);

		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	useEffect(() => {
		tg.MainButton.setParams({
			text: 'Send Info',
		});
	}, []);

	useEffect(() => {
		if (!country || !street) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [country, street]);

	const onChangeCountry = (e) => {
		setCountry(e.target.value);
	};

	const onChangeStreet = (e) => {
		setStreet(e.target.value);
	};

	const onChangeSubject = (e) => {
		setSubject(e.target.value);
	};

	return (
		<div className="form">
			<h3>Your info</h3>
			<input
				className="input"
				type="text"
				placeholder="Country"
				value={country}
				onChange={onChangeCountry}
			/>
			<input
				className="input"
				type="text"
				placeholder="Street"
				value={street}
				onChange={onChangeStreet}
			/>
			<select className="select" value={subject} onChange={onChangeSubject}>
				<option value={'physical'}>Individual</option>
				<option value={'legal'}>Entity</option>
			</select>
		</div>
	);
};

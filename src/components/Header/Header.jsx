import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { Button } from '../Button/Button';
import './Header.css';

export const Header = () => {
	const { user, onClose } = useTelegram();

	return (
		<div className={'header'}>
			<Button onClick={onClose}>Close</Button>
			<span className={'username'}>{user?.username}</span>
			<span className={'username'}>{user?.language_code}</span>
		</div>
	);
};

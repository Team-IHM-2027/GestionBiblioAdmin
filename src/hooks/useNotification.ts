// src/hooks/useNotification.ts
import { useState, useCallback } from 'react';

export interface NotificationState {
	visible: boolean;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
}

export const useNotification = () => {
	const [notification, setNotification] = useState<NotificationState>({
		visible: false,
		message: '',
		type: 'info',
	});

	const hideNotification = useCallback(() => {
		setNotification((prev) => ({ ...prev, visible: false }));
	}, []);

	const showNotification = useCallback((
		message: string,
		type: NotificationState['type'] = 'info',
		duration: number = 3000
	) => {
		setNotification({ visible: true, message, type });
		setTimeout(() => {
			hideNotification();
		}, duration);
	}, [hideNotification]);

	return { notification, showNotification, hideNotification };
};
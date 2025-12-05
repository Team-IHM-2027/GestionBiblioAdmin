// src/hooks/useUnreadCount.ts
import { useState, useEffect } from 'react';
import { getUnreadConversationsCountListener } from '../services/chatService';

export const useUnreadCount = () => {
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const unsubscribe = getUnreadConversationsCountListener((count) => {
			setUnreadCount(count);
		});

		return () => unsubscribe();
	}, []);

	return unreadCount;
};
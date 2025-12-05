// src/hooks/useConversations.ts
import { useState, useEffect } from 'react';
import { getConversationsListener } from '../services/chatService';
import type { Conversation } from '../types/chat';

export const useConversations = () => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = getConversationsListener((updatedConversations) => {
			setConversations(updatedConversations);
			if (loading) setLoading(false);
		});

		return () => unsubscribe();
	}, [loading]);

	return { conversations, loading };
};
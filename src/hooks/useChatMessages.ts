// src/hooks/useChatMessages.ts
import { useState, useEffect } from 'react';
import { getMessagesListener, markConversationAsRead } from '../services/chatService';
import type { Message } from '../types/chat';

export const useChatMessages = (conversationId: string | undefined) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!conversationId) {
			setMessages([]);
			setLoading(false);
			return;
		}
		setLoading(true); // Set loading to true before starting to fetch

		// Consider if markConversationAsRead should be here or called elsewhere,
		// for now, keeping it as per original logic but ensuring it doesn't cause issues.
		markConversationAsRead(conversationId);

		const unsubscribe = getMessagesListener(conversationId, (updatedMessages) => {
			setMessages(updatedMessages);
			setLoading(false); // Set loading to false after messages are updated
		});

		return () => unsubscribe();
	}, [conversationId]); // Dependency array changed here

	return { messages, loading };
};
// src/types/chat.ts
import { Timestamp } from 'firebase/firestore';

export interface Message {
	id: string;
	text: string;
	senderId: string; // 'admin' ou l'email/ID de l'utilisateur
	timestamp: Timestamp;
}

export interface Conversation {
	id: string;
	participants: string[];
	userName: string;
	userImage?: string;
	lastMessageText: string;
	lastMessageTimestamp: Timestamp;
	unreadByAdmin: boolean;
	adminLastReadTimestamp?: Timestamp; // Add this line
}
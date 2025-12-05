// src/services/chatService.ts
import {
	collection,
	query,
	orderBy,
	onSnapshot,
	addDoc,
	serverTimestamp,
	doc,
	updateDoc,
	Timestamp,
	arrayUnion,
	getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Conversation, Message } from '../types/chat';

const biblioUserCollectionRef = collection(db, 'BiblioUser');

/**
 * Écoute les mises à jour en temps réel de toutes les conversations.
 * @param callback - Fonction appelée avec la liste des conversations.
 * @returns Une fonction pour arrêter l'écoute.
 */
export const getConversationsListener = (callback: (conversations: Conversation[]) => void) => {
	// Query BiblioUser collection, order by name for now, as lastMessageTimestamp is dynamic
	const q = query(biblioUserCollectionRef, orderBy('name', 'asc'));

	return onSnapshot(q, (querySnapshot) => {
		const conversations: Conversation[] = querySnapshot.docs
			.map(docSnapshot => { // First, map to a preliminary structure
				const userData = docSnapshot.data();
				const messages = userData.messages || [];
				const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

				return {
					docId: docSnapshot.id, // Keep original ID for filtering if needed
					userData,
					messages,
					lastMessage
				};
			})
			.filter(tempConvo => tempConvo.messages && tempConvo.messages.length > 0) // Filter here
			.map(filteredConvo => { // Now map to the final Conversation type
				const { docId, userData, messages, lastMessage } = filteredConvo;
				// lastMessage is guaranteed to exist due to the filter
				// messages is the full array of messages for this user from the preliminary map

				// Define the type for messages within this function for clarity, expecting 'lu'
				type MessageWithLu = { texte: string; heure: Timestamp; recue: 'R' | 'E'; lu?: boolean };

				const hasUnreadFromUser = (messages as MessageWithLu[]).some((msg: MessageWithLu) =>
					msg.recue === 'E' && (msg.lu === false || msg.lu === undefined)
				);

				return {
					id: docId,
					userName: userData.name,
					userImage: userData.image || '',
					lastMessageText: lastMessage!.texte, // lastMessage is from the preliminary map
					lastMessageTimestamp: lastMessage!.heure, // lastMessage is from the preliminary map
					unreadByAdmin: hasUnreadFromUser,
					participants: [docId, 'admin'],
					adminLastReadTimestamp: userData.adminLastReadTimestamp, // Add this line
				};
			})
			.sort((a, b) => { // Sort after final mapping
				// lastMessageTimestamp is guaranteed to exist here
				return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis();
			});
		callback(conversations);
	});
};

// Fetches a single user document
export const getUserDoc = async (userId: string): Promise<any | null> => { // Consider defining a UserData type for the return
	if (!userId) {
		console.log("getUserDoc: userId is not provided.");
		return null;
	}
	const userDocRef = doc(db, 'BiblioUser', userId);
	try {
		const docSnap = await getDoc(userDocRef);
		if (docSnap.exists()) {
			return docSnap.data();
		} else {
			console.log("No such user document for ID:", userId);
			return null;
		}
	} catch (error) {
		console.error("Error fetching user document:", userId, error);
		return null;
	}
};

/**
 * Écoute les mises à jour en temps réel des messages d'une conversation spécifique.
 * @param conversationId - L'ID de la conversation.
 * @param callback - Fonction appelée avec la liste des messages.
 * @returns Une fonction pour arrêter l'écoute.
 */
export const getMessagesListener = (userId: string, callback: (messages: Message[]) => void) => {
	const userDocRef = doc(db, 'BiblioUser', userId);

	return onSnapshot(userDocRef, (docSnapshot) => {
		if (docSnapshot.exists()) {
			const userData = docSnapshot.data();
			const messagesData = userData.messages || [];

			// Map to application's Message type if necessary, for now assuming direct compatibility
			// or that the component consuming this will adapt.
			// The old structure is { texte: string, heure: Timestamp, recue: "R" | "E" }
			// The current Message type is { id: string, text: string, senderId: string, timestamp: Timestamp }
			// We need to map these fields.
			const messages: Message[] = messagesData.map((msg: any, index: number) => ({
				id: `${userId}-${index}-${msg.heure.toMillis()}`, // Construct a unique ID
				text: msg.texte,
				senderId: msg.recue === 'E' ? userId : 'admin', // 'E' (Envoyé by user), 'R' (Reçu by user from admin)
				timestamp: msg.heure,
			}));
			callback(messages);
		} else {
			// Handle case where user document doesn't exist or has no messages
			callback([]);
		}
	});
};

/**
 * Envoie un nouveau message dans une conversation.
 * @param conversationId - L'ID de la conversation.
 * @param text - Le contenu du message.
 * @param senderType - 'admin' ou 'user'.
 */
export const sendMessage = async (userId: string, text: string, senderType: 'admin' | 'user') => {
	console.log(`Attempting to send message to userId: ${userId}`, text); // Added for debugging
	if (!text.trim()) return;

	if (senderType === 'admin') {
		try {
			const newMessage = {
				texte: text,
				heure: Timestamp.now(), // Changed from serverTimestamp()
				recue: 'R', // 'R' pour Reçu par l'utilisateur (envoyé par l'admin)
			};

			const userDocRef = doc(db, 'BiblioUser', userId);
			await updateDoc(userDocRef, {
				messages: arrayUnion(newMessage),
			});

			// Mirror to MessagesRecue collection
			const messagesRecueCollectionRef = collection(db, 'MessagesRecue');
			await addDoc(messagesRecueCollectionRef, {
				email: userId,
				messages: text, // Storing the raw text, as per old structure
				lue: false,
				heure: serverTimestamp(),
			});
		} catch (error) {
			console.error("Error in sendMessage:", error);
			throw error; // Re-throw the error
		}
	}
	// Note: Logic for senderType === 'user' is typically handled client-side by the user's application
	// They would write to their own messages array with recue: 'E'
};

/**
 * Marque une conversation comme lue par l'admin.
 * @param userId - L'ID de l'utilisateur (qui est l'ID de la conversation).
 */
export const markConversationAsRead = async (userId: string) => {
	const userDocRef = doc(db, 'BiblioUser', userId);
	try {
		const docSnap = await getDoc(userDocRef);

		if (docSnap.exists()) {
			const userData = docSnap.data();
			const updates: { [key: string]: any } = {};

			// Always update the adminLastReadTimestamp
			updates.adminLastReadTimestamp = serverTimestamp();

			const messages = userData.messages || [];
			let messagesArrayNeedsUpdate = false;

			// Define type for messages if not already available globally with 'lu'
			type MessageWithLu = { texte: string; heure: Timestamp; recue: 'R' | 'E'; lu?: boolean };

			const updatedMessages = messages.map((msg: MessageWithLu) => {
				if (msg.recue === 'E' && (msg.lu === false || msg.lu === undefined)) {
					messagesArrayNeedsUpdate = true;
					return { ...msg, lu: true };
				}
				return msg;
			});

			if (messagesArrayNeedsUpdate) {
				updates.messages = updatedMessages;
			}

			// Since adminLastReadTimestamp is always added, updates object will not be empty.
			// No need to check Object.keys(updates).length > 0 if we always intend to update at least the timestamp.
			await updateDoc(userDocRef, updates);
			console.log(`Updated read status for user: ${userId}. Fields updated:`, Object.keys(updates).join(', '));

		} else {
			console.log(`No document found for user: ${userId} to mark conversation as read.`);
		}
	} catch (error) {
		console.error("Error in markConversationAsRead for user:", userId, error);
	}
	// The logic for updating 'MessagesRecue' collection has been removed from this function.
};

/**
 * Écoute le nombre de conversations non lues par l'admin.
 * @param callback - Fonction appelée avec le nombre de conversations non lues.
 * @returns Une fonction pour arrêter l'écoute.
 */
export const getUnreadConversationsCountListener = (callback: (count: number) => void) => {
	// biblioUserCollectionRef is collection(db, 'BiblioUser')
	return onSnapshot(biblioUserCollectionRef, (querySnapshot) => {
		let unreadConversationsCount = 0;
		querySnapshot.forEach((docSnapshot) => {
			const userData = docSnapshot.data();
			const messages = userData.messages || [];

			// Define the type for messages within this function for clarity, expecting 'lu'
			type MessageWithLu = { texte: string; heure: Timestamp; recue: 'R' | 'E'; lu?: boolean };

			if (messages.length > 0) {
				const hasUnreadFromUser = (messages as MessageWithLu[]).some((msg: MessageWithLu) =>
					msg.recue === 'E' && (msg.lu === false || msg.lu === undefined)
				);
				if (hasUnreadFromUser) {
					unreadConversationsCount++;
				}
			}
		});
		callback(unreadConversationsCount);
	});
};
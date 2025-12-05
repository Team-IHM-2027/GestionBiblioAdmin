// src/components/chat/NewMessageModal.tsx
import React, { useState, useEffect } from 'react';
import {
	collection,
	query,
	where,
	getDocs,
	limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { sendMessage } from '../../services/chatService';
import Spinner from '../common/Spinner'; // Assuming a Spinner component exists
import { FiX, FiSend } from 'react-icons/fi';

interface User {
	id: string; // Firestore document ID (user's email)
	name: string;
	email: string;
}

interface NewMessageModalProps {
	isOpen: boolean;
	onClose: () => void;
	onMessageSent: (userId: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, onMessageSent }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [messageText, setMessageText] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [sendError, setSendError] = useState<string | null>(null);
	const [searchError, setSearchError] = useState<string | null>(null);

	// Debounce search term
	useEffect(() => {
		if (!searchTerm.trim()) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		setSearchError(null);
		const delayDebounceFn = setTimeout(async () => {
			try {
				const searchTermLower = searchTerm.toLowerCase();
				// More flexible query: name OR email starts with searchTermLower
				// Firestore doesn't support case-insensitive 'starts-with' natively or OR on different fields for inequality.
				// A common workaround is to query for range [searchTerm, searchTerm + '\uf8ff'] for starts-with.
				// For this example, we'll do two separate queries and merge, or a more complex backend solution would be better.
				// Simplified for now: exact match on email or name starts with (case-sensitive for name without specific field).
				// Let's try a email query and a name query.

				const usersRef = collection(db, 'BiblioUser');
				const qName = query(usersRef,
					where('name', '>=', searchTerm),
					where('name', '<=', searchTerm + '\uf8ff'),
					limit(5)
				);
				const qEmail = query(usersRef,
					where('email', '>=', searchTermLower),
					where('email', '<=', searchTermLower + '\uf8ff'),
					limit(5)
				);

				const [nameSnap, emailSnap] = await Promise.all([getDocs(qName), getDocs(qEmail)]);

				const usersMap = new Map<string, User>();
				nameSnap.forEach(doc => {
					const data = doc.data();
					usersMap.set(doc.id, { id: doc.id, name: data.name, email: data.email });
				});
				emailSnap.forEach(doc => {
					const data = doc.data();
					if (!usersMap.has(doc.id)) { // Avoid duplicates
						usersMap.set(doc.id, { id: doc.id, name: data.name, email: data.email });
					}
				});

				setSearchResults(Array.from(usersMap.values()));

			} catch (error) {
				console.error('Error searching users:', error);
				setSearchError('Failed to search users.');
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);

	const handleUserSelect = (user: User) => {
		setSelectedUser(user);
		setSearchTerm('');
		setSearchResults([]);
	};

	const handleSendMessage = async () => {
		if (!selectedUser || !messageText.trim()) return;

		setIsSending(true);
		setSendError(null);
		try {
			await sendMessage(selectedUser.id, messageText, 'admin');
			onMessageSent(selectedUser.id);
			resetAndClose();
		} catch (error) {
			console.error('Error sending message:', error);
			setSendError('Failed to send message. Please try again.');
		} finally {
			setIsSending(false);
		}
	};

	const resetAndClose = () => {
		setSearchTerm('');
		setSearchResults([]);
		setSelectedUser(null);
		setMessageText('');
		setIsSearching(false);
		setIsSending(false);
		setSendError(null);
		setSearchError(null);
		onClose();
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">{selectedUser ? `Message to ${selectedUser.name}` : 'New Message'}</h2>
					<button onClick={resetAndClose} className="p-1 rounded-full hover:bg-secondary-100">
						<FiX className="w-6 h-6 text-gray-600" />
					</button>
				</div>

				{!selectedUser ? (
					<div>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search user by name or email..."
							className="form-input w-full mb-3"
						/>
						{isSearching && <Spinner />}
						{searchError && <p className="text-red-500 text-sm mb-2">{searchError}</p>}
						<div className="max-h-60 overflow-y-auto border rounded-md">
							{searchResults.length > 0 ? (
								searchResults.map(user => (
									<div
										key={user.id}
										onClick={() => handleUserSelect(user)}
										className="p-3 hover:bg-secondary-100 cursor-pointer border-b last:border-b-0"
									>
										<p className="font-medium">{user.name}</p>
										<p className="text-sm text-gray-600">{user.email}</p>
									</div>
								))
							) : (
								!isSearching && searchTerm && <p className="p-3 text-gray-500">No users found.</p>
							)}
						</div>
					</div>
				) : (
					<div>
						<div className="flex justify-between items-center mb-3 p-2 bg-secondary-50 rounded-md">
							<div>
								<p className="font-semibold text-primary-700">{selectedUser.name}</p>
								<p className="text-sm text-gray-600">{selectedUser.email}</p>
							</div>
							<button
								onClick={() => {setSelectedUser(null); setMessageText(''); setSendError(null);}}
								className="text-sm text-primary-600 hover:underline"
							>
								Change user
							</button>
						</div>
						<textarea
							value={messageText}
							onChange={(e) => {
								setMessageText(e.target.value);
								if (sendError) setSendError(null);
							}}
							placeholder="Type your message..."
							rows={5}
							className="form-textarea w-full mb-3"
						/>
						{sendError && <p className="text-red-500 text-sm mb-2">{sendError}</p>}
						<div className="flex justify-end space-x-3">
							<button
								onClick={resetAndClose}
								className="btn btn-outline"
								disabled={isSending}
							>
								Cancel
							</button>
							<button
								onClick={handleSendMessage}
								className="btn btn-primary flex items-center"
								disabled={!messageText.trim() || isSending}
							>
								{isSending ? <Spinner/> : <FiSend className="mr-2" />}
								Send
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default NewMessageModal;

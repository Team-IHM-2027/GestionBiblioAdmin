// src/components/chat/ConversationItem.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { Conversation } from '../../types/chat';
import { formatDistanceToNow, isFuture, differenceInMinutes } from 'date-fns';
import { FaUserCircle } from 'react-icons/fa';

interface ConversationItemProps {
	conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
	return (
		<NavLink
			to={`/dashboard/messages/${conversation.id}`}
			className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
				isActive ? 'bg-primary-100' : 'hover:bg-secondary-100'
			}`
			}
		>
			<div className="relative mr-3">
				{conversation.userImage ? (
					<img src={conversation.userImage} alt={conversation.userName} className="w-12 h-12 rounded-full object-cover" />
				) : (
					<FaUserCircle className="w-12 h-12 text-secondary-400" />
				)}
				{conversation.unreadByAdmin && (
					<span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-center">
					<p className="font-semibold text-gray-800 truncate">{conversation.userName}</p>
					<p className="text-xs text-gray-500">
						{(() => {
							if (!conversation.lastMessageTimestamp) return null;
							const messageDate = conversation.lastMessageTimestamp.toDate();
							const now = new Date();
							if (isFuture(messageDate)) {
								const diffMins = differenceInMinutes(messageDate, now);
								if (diffMins >= 0 && diffMins < 5) { // If date is in future but within 5 minutes
									return 'just now'; // Or a localized version
								}
							}
							// For past dates or future dates beyond the threshold, use formatDistanceToNow
							return formatDistanceToNow(messageDate, { addSuffix: true });
						})()}
					</p>
				</div>
				<p className="text-sm text-gray-600 truncate">{conversation.lastMessageText}</p>
			</div>
		</NavLink>
	);
};
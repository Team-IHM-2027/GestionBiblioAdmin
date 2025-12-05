// src/components/chat/MessageBubble.tsx
import React from 'react';
import type { Message } from '../../types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
	message: Message;
	isSender: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
	const bubbleClasses = isSender
		? 'bg-primary text-white self-end rounded-br-none'
		: 'bg-secondary-200 text-gray-800 self-start rounded-bl-none';

	return (
		<div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
			<div className={`max-w-md px-4 py-2 rounded-xl shadow-sm ${bubbleClasses}`}>
				<p className="whitespace-pre-wrap break-words">{message.text}</p> {/* Added classes for better text wrapping */}
				<p className={`text-xs mt-1 ${isSender ? 'text-gray-200 opacity-80' : 'text-gray-500 opacity-80'}`}>
					{message.timestamp ? format(message.timestamp.toDate(), 'MMM d, h:mm a') : 'sending...'}
				</p>
			</div>
		</div>
	);
};


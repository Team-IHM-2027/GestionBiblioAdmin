import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
				<header className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-bold text-gray-800">{title}</h2>
					<button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
						<FaTimes className="text-gray-600" />
					</button>
				</header>
				<main className="p-6 overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	);
};
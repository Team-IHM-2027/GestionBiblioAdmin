// src/components/books/AddCommentForm.tsx
import React, { useState } from 'react';
import { Button } from '../common/Button.tsx';
import useI18n from '../../hooks/useI18n';
import { FaStar } from 'react-icons/fa';

interface AddCommentFormProps {
	onAddComment: (text: string, rating: number) => Promise<void>;
	isSubmitting: boolean;
}

const StarRating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
	return (
		<div className="flex items-center">
			{[...Array(5)].map((_, index) => {
				const ratingValue = index + 1;
				return (
					<label key={index}>
						<input
							type="radio"
							name="rating"
							value={ratingValue}
							onClick={() => setRating(ratingValue)}
							className="hidden"
						/>
						<FaStar
							className="cursor-pointer"
							color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
							size={24}
						/>
					</label>
				);
			})}
		</div>
	);
};

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ onAddComment, isSubmitting }) => {
	const { t } = useI18n();
	const [text, setText] = useState('');
	const [rating, setRating] = useState(0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		try {
			await onAddComment(text, rating);
			setText(''); // Clear form on success
			setRating(0);
		} catch (error) {
			// The page component will handle displaying the alert
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6">
			<h3 className="text-lg font-semibold text-gray-700 mb-2">{t('books:comments.add_your_comment')}</h3>
			<div className="mb-2">
				<StarRating rating={rating} setRating={setRating} />
			</div>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder={t('books:comments.comment_placeholder')}
				className="form-input w-full"
				rows={4}
				required
			/>
			<div className="flex justify-end mt-2">
				<Button type="submit" isLoading={isSubmitting}>
					{t('books:comments.submit_comment')}
				</Button>
			</div>
		</form>
	);
};
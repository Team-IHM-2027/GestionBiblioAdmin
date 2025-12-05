// src/components/books/CommentList.tsx
import React, { useState } from 'react';
import type { Comment } from '../../types/book';
import useI18n from '../../hooks/useI18n';
import { FaStar } from 'react-icons/fa';

interface CommentListProps {
	comments: Comment[];
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
	const { t } = useI18n();
	const commentDate = comment.heure instanceof Date
		? comment.heure
		: (comment.heure?.toDate ? comment.heure.toDate() : new Date(comment.heure?.seconds ? comment.heure.seconds * 1000 : Date.now()));

	return (
		<div className="flex items-start space-x-4 py-4 border-b border-secondary-200">
			<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary">
				{comment.nomUser ? comment.nomUser.charAt(0).toUpperCase() : 'A'}
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<p className="font-semibold text-gray-800">{comment.nomUser || t('pages:book_details.comments.anonymous')}</p>
					<p className="text-xs text-gray-500">{commentDate.toLocaleString()}</p>
				</div>
				<div className="flex items-center my-1">
					{[...Array(5)].map((_, i) => (
						<FaStar key={i} color={i < comment.note ? '#ffc107' : '#e4e5e9'} />
					))}
				</div>
				<p className="text-gray-600">{comment.texte}</p>
			</div>
		</div>
	);
};

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
	const { t } = useI18n();
	const [showAll, setShowAll] = useState(false);

	if (!comments || comments.length === 0 || !comments[0]?.heure) {
		return <p className="text-gray-500 mt-4">{t('pages:book_details.comments.no_comments')}</p>;
	}

	const sortedComments = [...comments].sort((a, b) => b.heure.seconds - a.heure.seconds);
	const visibleComments = showAll ? sortedComments : sortedComments.slice(0, 3);

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pages:book_details.comments.title')}</h2>
			<div className="bg-white p-6 rounded-lg shadow-md">
				{visibleComments.map((comment, index) => (
					<CommentItem key={index} comment={comment} />
				))}
				{sortedComments.length > 3 && (
					<div className="text-center mt-4">
						<button
							onClick={() => setShowAll(!showAll)}
							className="text-primary font-semibold hover:underline"
						>
							{showAll ? t('pages:book_details.comments.show_less') : t('pages:book_details.comments.show_more')}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
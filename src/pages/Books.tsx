import React from 'react';

const Books: React.FC = () => {
	return (
		<div>
			<h2 className="text-2xl font-semibold mb-6">Books Management</h2>
			<div className="bg-white rounded-lg shadow p-6">
				<p className="text-gray-600 mb-4">
					Manage your library's book collection, add new books, update existing ones, and organize by categories.
				</p>

				<div className="flex flex-wrap gap-4 mb-6">
					<button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
						Add New Book
					</button>
					<button className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary-50 transition-colors">
						Import Books
					</button>
					<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
						Export Catalog
					</button>
				</div>

				{/* Placeholder for book listing */}
				<div className="border rounded-lg p-8 bg-secondary-50 text-center">
					<p className="text-gray-500">Book listing component will be implemented here</p>
				</div>
			</div>
		</div>
	);
};

export default Books;
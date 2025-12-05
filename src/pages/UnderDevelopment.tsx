import React from 'react';

const UnderDevelopment: React.FC<{ sectionName: string }> = ({ sectionName }) => {
	return (
		<div className="text-center py-12">
			<svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
			</svg>
			<h3 className="text-xl font-medium text-gray-900 mb-2">Under Development</h3>
			<p className="text-gray-600">
				The {sectionName} section is currently being developed and will be available soon.
			</p>
		</div>
	);
};

export default UnderDevelopment;
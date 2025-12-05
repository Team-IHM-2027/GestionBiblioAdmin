// src/pages/ThesisCatalogue.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThesisCatalogue } from '../hooks/useThesisCatalogue';
import ThesisCard from '../components/thesis/ThesisCard';
import Spinner from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { FiPlus } from 'react-icons/fi';
import useI18n from '../hooks/useI18n';

const ThesisCatalogue: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useI18n();
	const { theses, isLoading, error, departmentName } = useThesisCatalogue();
	console.log(`department: ${departmentName}`)

	if (isLoading) return <Spinner />;
	if (error) return <div className="text-center text-red-500">{error}</div>;

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-700">
					{/* You'll need to add this translation */}
					{t('pages:thesis_catalogue.browsing', { department: departmentName, defaultValue: `Browsing Theses in ${departmentName}` })}
				</h2>
				<Button onClick={() => navigate('add')}>
					<FiPlus className="mr-2" />
					{/* You'll need to add this translation */}
					{t('pages:thesis_catalogue.add_new', { defaultValue: 'Add New Thesis' })}
				</Button>
			</div>

			{theses.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{theses.map(thesis => (
						<ThesisCard key={thesis.id} thesis={thesis} />
					))}
				</div>
			) : (
				<div className="text-center py-10 bg-secondary-100 rounded-lg">
					{/* You'll need to add this translation */}
					<p className="text-secondary-600">{t('pages:thesis_catalogue.no_theses_found', { defaultValue: 'No theses found in this department.' })}</p>
				</div>
			)}
		</div>
	);
};

export default ThesisCatalogue;
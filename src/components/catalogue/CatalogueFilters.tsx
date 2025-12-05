// src/components/catalogue/CatalogueFilters.tsx
import React from 'react';
import useI18n from '../../hooks/useI18n';
import type {CatalogueFiltersProps} from "../../types/book.ts";

const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({ onSortChange }) => {
	const { t } = useI18n();
	return (
		<div className="flex flex-col md:flex-row gap-4 mb-6">

			<select
				onChange={(e) => onSortChange(e.target.value as any)}
				className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
			>
				<option value="nameAsc">{t('components:catalogue.sort_name_asc')}</option>
				<option value="nameDesc">{t('components:catalogue.sort_name_desc')}</option>
				<option value="stockDesc">{t('components:catalogue.sort_stock_desc')}</option>
				<option value="stockAsc">{t('components:catalogue.sort_stock_asc')}</option>
			</select>
		</div>
	);
};

export default CatalogueFilters;
import React from 'react';
import { Outlet } from 'react-router-dom';
import {useConfig} from "../theme/ConfigProvider.tsx";

const DefaultLayout: React.FC = () => {
	const { loading } = useConfig();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-secondary-100">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-t-primary border-secondary-300 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-primary-600">Loading books...</p>
				</div>
			</div>
		);
	}

	return (
		<main className="p-6 flex-grow">
			<Outlet />
		</main>
	);
};

export default DefaultLayout;
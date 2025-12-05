// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const ProtectedRoute: React.FC = () => {
	const { admin, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<Spinner />
			</div>
		);
	}

	if (!admin) {
		return <Navigate to="/authentication" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
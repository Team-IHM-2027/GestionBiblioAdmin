// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/authService.ts';
import type { AdminData } from '../services/authService.ts';
import Spinner from '../components/common/Spinner';

interface AuthContextType {
	admin: AdminData | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<AdminData>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [admin, setAdmin] = useState<AdminData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const storedAdmin = localStorage.getItem('biblioAdmin');
			if (storedAdmin) {
				setAdmin(JSON.parse(storedAdmin));
			}
		} catch (error) {
			localStorage.removeItem('biblioAdmin');
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	const login = async (email: string, password: string) => {
		const adminData = await authService.loginAdmin(email, password);
	
		//Empêcher la connexion si le compte est bloqué
		if (adminData.etat === "bloc") {
			throw new Error("Votre compte est bloqué. Contactez l'administration.");
		}
	
		setAdmin(adminData);
		localStorage.setItem("biblioAdmin", JSON.stringify(adminData));
	
		return adminData;
	};
	
	const logout = () => {
		setAdmin(null);
		localStorage.removeItem('biblioAdmin');
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<Spinner />
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ admin, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

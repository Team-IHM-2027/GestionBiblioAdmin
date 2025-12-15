// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authService';
import { useConfig } from '../components/theme/ConfigProvider';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const Register: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [gender, setGender] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { config } = useConfig();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password.length < 6) {
			setError('Le mot de passe doit contenir au moins 6 caractères.');
			return;
		}

		if (password !== confirmPassword) {
			setError('Les mots de passe ne correspondent pas.');
			return;
		}

		setError('');
		setSuccess('');
		setIsLoading(true);

		try {
			await authService.registerAdmin(name, email, password, gender);

			setSuccess(
				"Un email de vérification vous a été envoyé. Veuillez vérifier votre boîte Gmail avant de vous connecter."
			);

			// On vide le formulaire
			setName('');
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			setGender('');
		} catch (err: any) {
			setError(err.message || "Erreur lors de la création du compte.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in">
			<div className="text-center animate-slide-up">
				<h1 className="text-3xl font-bold text-white">
					Créer un Compte Admin
				</h1>
				<p className="text-secondary-300 mt-2">
					Rejoignez {config.Name || 'Biblio Admin'}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Nom */}
				<div className="relative">
					<FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Nom complet"
						required
						className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* Email */}
				<div className="relative">
					<FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Adresse e-mail"
						required
						className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* Mot de passe */}
				<div className="relative">
					<FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Mot de passe (6+ caractères)"
						required
						className="w-full pl-10 pr-10 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white"
					>
						{showPassword ? <FiEyeOff /> : <FiEye />}
					</button>
				</div>

				{/* Confirmation */}
				<div className="relative">
					<FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
					<input
						type={showPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirmer le mot de passe"
						required
						className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* Genre */}
				<div className="relative">
					<FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none" />
					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						required
						className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
					>
						<option value="" disabled>
							Sélectionner le genre
						</option>
						<option value="Male">Masculin</option>
						<option value="Female">Féminin</option>
					</select>
				</div>

				{/* Messages */}
				{error && (
					<div className="text-center text-red-400 bg-red-900 bg-opacity-50 p-2 rounded-lg">
						{error}
					</div>
				)}

				{success && (
					<div className="text-center text-green-400 bg-green-900 bg-opacity-50 p-3 rounded-lg">
						{success}
					</div>
				)}

				{/* Bouton */}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full flex items-center justify-center py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
				>
					{isLoading ? (
						<div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div>
					) : (
						"Créer le compte"
					)}
				</button>
			</form>

			<p className="text-center text-sm text-secondary-300">
				Déjà un compte ?{' '}
				<Link
					to="/authentication"
					className="font-medium text-primary-400 hover:underline"
				>
					Se connecter
				</Link>
			</p>
		</div>
	);
};

export default Register;

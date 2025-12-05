// src/pages/ForgotPassword.tsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { sendResetPasswordEmail } from '../services/authService';
// import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword: React.FC = () => {
	// const [email, setEmail] = useState('');
	// const [message, setMessage] = useState('');
	// const [error, setError] = useState('');
	// const [isLoading, setIsLoading] = useState(false);
	//
	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	setError('');
	// 	setMessage('');
	// 	setIsLoading(true);
	// 	try {
	// 		await sendResetPasswordEmail(email);
	// 		setMessage("Si un compte existe pour cette adresse, un lien de réinitialisation a été envoyé.");
	// 	} catch (err: any) {
	// 		setError("Impossible d'envoyer l'e-mail. Veuillez réessayer.");
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	return (
		<div className="w-full max-w-md p-8 space-y-6 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in">
			{/*<div className="text-center">*/}
			{/*	<h1 className="text-3xl font-bold text-white">Mot de Passe Oublié</h1>*/}
			{/*	<p className="text-secondary-300 mt-2">Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>*/}
			{/*</div>*/}

			{/*<form onSubmit={handleSubmit} className="space-y-4">*/}
			{/*	<div className="relative">*/}
			{/*		<FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />*/}
			{/*		<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary" />*/}
			{/*	</div>*/}

			{/*	{message && <div className="text-center text-green-400 bg-green-900 bg-opacity-50 p-2 rounded-lg">{message}</div>}*/}
			{/*	{error && <div className="text-center text-red-400 bg-red-900 bg-opacity-50 p-2 rounded-lg">{error}</div>}*/}

			{/*	<button type="submit" disabled={isLoading || !!message} className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50">*/}
			{/*		{isLoading ? <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div> : "Envoyer le lien"}*/}
			{/*	</button>*/}
			{/*</form>*/}
			{/*<div className="text-center">*/}
			{/*	<Link to="/authentication" className="text-sm text-secondary-300 hover:text-white flex items-center justify-center">*/}
			{/*		<FiArrowLeft className="mr-2" /> Retour à la connexion*/}
			{/*	</Link>*/}
			{/*</div>*/}
			Yo
		</div>
	);
};

export default ForgotPassword;
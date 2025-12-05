import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline';
	isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = (
	{
		children,
		variant = 'primary',
		isLoading = false,
		className = '',
		...props
	}
) => {
	const baseClasses = 'flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	const variantClasses = {
		primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
		secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-500',
		outline: 'bg-transparent border border-secondary-300 text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
	};

	const loadingClasses = isLoading ? 'opacity-75 cursor-not-allowed' : '';

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${loadingClasses} ${className}`}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? (
				<div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
			) : (
				children
			)}
		</button>
	);
};
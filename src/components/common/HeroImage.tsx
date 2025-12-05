// src/components/HeroImage.tsx
import React from 'react';

interface HeroImageProps {
	backgroundColor?: string;
	className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({
	                                                    backgroundColor = 'bg-gradient from-primary-500 to-secondary-600',
	                                                    className = ''
                                                    }) => {
	return (
		<div className={`relative h-[50vh] min-h-[400px] overflow-hidden rounded-2xl ${backgroundColor} ${className}`}>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
			</div>

			{/* Floating Books Container */}
			<div className="relative h-full w-full">
				{/* Book 1 - Analyse Numérique (Top Center - Highest z-index) */}
				<div className="absolute top-8 left-1/3 transform -translate-x-1/2 z-40 float-animation">
					<div className="particle-float-slow transform hover:scale-105 transition-transform duration-300">
						<img
							src="/hero/ana_num.png"
							alt="Analyse Numérique"
							className="w-20 h-24 rounded-lg shadow-2xl border border-gray-200"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = 'none';
								target.parentElement!.innerHTML = '<div class="w-32 h-40 bg-orange-400 rounded-lg shadow-2xl flex items-center justify-center"><span class="text-white text-xs text-center p-2">Analyse Numérique</span></div>';
							}}
						/>
					</div>
				</div>

				{/* Book 2 - Génie Électrique (Left Side) */}
				<div className="absolute top-32 left-4 z-30 float-animation-delayed">
					<div className="transform hover:scale-105 transition-transform duration-300 rotate-12">
						<img
							src="/hero/elec.jpg"
							alt="Génie Électrique"
							className="w-30 h-40 rounded-lg shadow-2xl border border-gray-200 object-cover"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = 'none';
								target.parentElement!.innerHTML = '<div class="w-36 h-44 bg-primary-500 rounded-lg shadow-2xl flex items-center justify-center transform rotate-12"><span class="text-white text-xs text-center p-2">Génie Électrique</span></div>';
							}}
						/>
					</div>
				</div>

				{/* Book 3 - Génie Mécanique (Right Side - Lower z-index than ana_num) */}
				<div className="absolute top-16 right-4 z-20 float-animation-slow">
					<div className="transform hover:scale-105 transition-transform duration-300 -rotate-6">
						<img
							src="/hero/meca.jpg"
							alt="Génie Mécanique"
							className="w-34 h-42 rounded-lg shadow-2xl border border-gray-200"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = 'none';
								target.parentElement!.innerHTML = '<div class="w-34 h-42 bg-teal-500 rounded-lg shadow-2xl flex items-center justify-center -rotate-6"><span class="text-white text-xs text-center p-2">Génie Mécanique</span></div>';
							}}
						/>
					</div>
				</div>

				{/* Book 4 - Télécoms (Bottom Right) */}
				<div className="absolute bottom-3 left-1/4 z-10 float-animation-reverse">
					<div className="transform hover:scale-105 transition-transform duration-300">
						<img
							src="/hero/telecom.png"
							alt="Télécoms"
							className="w-24 h-30 rounded-lg shadow-2xl border border-gray-200"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = 'none';
								target.parentElement!.innerHTML = '<div class="w-28 h-36 bg-red-500 rounded-lg shadow-2xl flex items-center justify-center rotate-6"><span class="text-white text-xs text-center p-2">Télécoms</span></div>';
							}}
						/>
					</div>
				</div>

				{/* Floating particles with slower animations */}
				<div className="z-100 absolute top-1/4 left-1/5 w-2 h-2 bg-blue-300 rounded-full particle-float"></div>
				<div className="z-100 absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-300 rounded-full particle-float-delayed"></div>
				<div className="z-100 absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-300 rounded-full particle-float-slow"></div>
				<div className="z-100 absolute top-1/4 left-4/5 w-2 h-2 bg-blue-300 rounded-full particle-float"></div>
				<div className="z-100 absolute top-1/2 right-4 w-3 h-3 bg-indigo-300 rounded-full particle-float-delayed"></div>
				<div className="z-100 absolute bottom-2/3 left-2/3 w-1 h-1 bg-purple-300 rounded-full particle-float-slow"></div>
			</div>

		</div>
	);
};


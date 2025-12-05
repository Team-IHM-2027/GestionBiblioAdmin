import React, { useEffect, useState } from 'react';
import { useConfig } from './ConfigProvider.tsx';
import { getCurrentFormattedDateTime, getCurrentUserLogin } from '../../utils/dateUtils.ts';

const ThemePreview: React.FC = () => {
	const { config } = useConfig();
	const [cssVars, setCssVars] = useState<Record<string, string>>({});
	const [currentTime, setCurrentTime] = useState(getCurrentFormattedDateTime());
	const userLogin = getCurrentUserLogin();

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(getCurrentFormattedDateTime());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Get CSS variables for display
	useEffect(() => {
		const computedStyles = getComputedStyle(document.documentElement);
		const variables = {
			'--color-primary': computedStyles.getPropertyValue('--color-primary'),
			'--color-secondary': computedStyles.getPropertyValue('--color-secondary'),
		};

		setCssVars(variables);
	}, [config.Theme]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mt-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Theme Preview</h2>
				<div className="text-sm text-secondary-600">
					<span className="font-mono">{currentTime}</span>
					<span className="mx-2">|</span>
					<span>User: {userLogin}</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Primary Colors (10%) */}
				<div className="bg-white p-4 rounded shadow-sm border border-gray-200">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<div className="w-4 h-4 rounded bg-primary mr-2"></div>
						Primary Color (10%)
					</h3>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-primary)' }}></div>
							<span className="flex-1">Primary</span>
							<span className="font-mono text-xs">{config?.Theme?.Primary || '#3B82F6'}</span>
						</div>

						<div className="grid grid-cols-5 gap-1 mt-3">
							{[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
								<div
									key={`primary-${shade}`}
									className="h-8 rounded cursor-pointer group relative"
									style={{ backgroundColor: `var(--color-primary-${shade})` }}
									title={`Primary-${shade}`}
								>
                  <span className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1 transition-opacity">
                    {shade}
                  </span>
								</div>
							))}
						</div>
					</div>

					<div className="mt-4 p-3 bg-primary text-white rounded">
						Primary Button
					</div>

					<div className="mt-2 p-3 border border-primary text-primary rounded">
						Outline Button
					</div>
				</div>

				{/* Secondary Colors (30%) */}
				<div className="bg-white p-4 rounded shadow-sm border border-gray-200">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<div className="w-4 h-4 rounded bg-secondary mr-2"></div>
						Secondary Color (30%)
					</h3>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
							<span className="flex-1">Secondary</span>
							<span className="font-mono text-xs">{config?.Theme?.Secondary || '#64748B'}</span>
						</div>

						<div className="grid grid-cols-5 gap-1 mt-3">
							{[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
								<div
									key={`secondary-${shade}`}
									className="h-8 rounded cursor-pointer group relative"
									style={{ backgroundColor: `var(--color-secondary-${shade})` }}
									title={`Secondary-${shade}`}
								>
                  <span className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1 transition-opacity">
                    {shade}
                  </span>
								</div>
							))}
						</div>
					</div>

					<div className="mt-4 p-3 bg-secondary text-white rounded">
						Secondary Button
					</div>

					<div className="mt-2 p-3 border border-secondary text-secondary rounded">
						Outline Button
					</div>
				</div>
			</div>

			{/* UI Elements Showcase with 10-30-60 Rule */}
			<div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
				<h3 className="text-lg font-semibold mb-4">10-30-60 Color Rule UI Example</h3>
				<p className="text-gray-600 mb-4">
					Using 10% primary color, 30% secondary color, and 60% white background
				</p>

				<div className="flex flex-wrap gap-4 mb-6">
					{/* Primary elements - 10% */}
					<button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 shadow-sm">
						Primary Action
					</button>
					<div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
						Badge
					</div>
					<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
						<span>N</span>
					</div>
					<div className="inline-block h-4 w-4 rounded-full bg-primary"></div>
				</div>

				{/* Secondary elements - 30% */}
				<div className="mb-6">
					<div className="p-4 bg-secondary-100 rounded-lg border border-secondary-200">
						<h4 className="text-secondary-800 font-medium">Secondary Content Area (30%)</h4>
						<p className="text-secondary-600 text-sm">This is a secondary content area taking about 30% of the UI space.</p>
						<button className="mt-2 px-3 py-1 bg-secondary-200 text-secondary-700 rounded hover:bg-secondary-300">
							Secondary Action
						</button>
					</div>
				</div>

				{/* White background elements - 60% */}
				<div className="p-4 bg-white rounded-lg border border-gray-200">
					<h4 className="text-gray-800 font-medium">Main Content Area (60%)</h4>
					<p className="text-gray-600">The white background takes up approximately 60% of the UI, providing a clean canvas for content.</p>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-3 bg-white rounded border border-gray-200">
							Item 1
						</div>
						<div className="p-3 bg-white rounded border border-gray-200">
							Item 2
						</div>
						<div className="p-3 bg-white rounded border border-gray-200">
							Item 3
						</div>
					</div>
				</div>
			</div>

			{/* CSS Variables Debug */}
			<div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
				<h3 className="text-lg font-semibold mb-2">CSS Variables</h3>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
						<tr>
							<th className="text-left px-2 py-1">Variable</th>
							<th className="text-left px-2 py-1">Value</th>
						</tr>
						</thead>
						<tbody>
						{Object.entries(cssVars).map(([key, value]) => (
							<tr key={key} className="border-t border-gray-200">
								<td className="font-mono px-2 py-1">{key}</td>
								<td className="font-mono px-2 py-1 flex items-center">
									{value}
									<span
										className="w-4 h-4 ml-2 rounded-full"
										style={{ backgroundColor: value.trim() }}
									></span>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Current Configuration */}
			<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
				<h3 className="text-lg font-semibold mb-2">Current Theme Configuration</h3>
				<div className="flex items-center space-x-4 mb-4">
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
						<span className="font-mono text-sm">{config?.Theme?.Primary || '#3B82F6'}</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
						<span className="font-mono text-sm">{config?.Theme?.Secondary || '#64748B'}</span>
					</div>
				</div>
				<div className="text-gray-500 text-sm">
					<div className="flex">
						<span className="w-24">Date/Time:</span>
						<span className="font-mono">{currentTime} (UTC)</span>
					</div>
					<div className="flex">
						<span className="w-24">User:</span>
						<span>{userLogin}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThemePreview;
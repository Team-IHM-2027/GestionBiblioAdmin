// // src/components/thesis/ThesisDetailDisplay.tsx
// import React, { useState } from 'react';
// import type { Thesis } from '../../types/thesis';
// import { FiDownload, FiUser, FiAward, FiCalendar, FiBookOpen, FiLoader } from 'react-icons/fi';
// import { Button } from '../common/Button';
// import { sanitizeFilename } from '../../utils/fileUtils'; // Import the new utility
//
// interface ThesisDetailDisplayProps {
// 	thesis: Thesis;
// }
//
// const InfoRow: React.FC<{ label: string; value?: string | number; children?: React.ReactNode }> = ({ label, value, children }) => (
// 	<div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-secondary-200">
// 		<span className="text-secondary-600 w-32 shrink-0 font-medium">{label}</span>
// 		{children || <span className="font-semibold text-gray-800 break-words">{value || 'N/A'}</span>}
// 	</div>
// );
//
// export const ThesisDetailDisplay: React.FC<ThesisDetailDisplayProps> = ({ thesis }) => {
// 	// State to manage the download status for a better UX
// 	const [isDownloading, setIsDownloading] = useState(false);
//
// 	// --- CORE DOWNLOAD LOGIC ---
// 	const handleDownload = async () => {
// 		if (!thesis.pdfUrl) {
// 			alert("No PDF file is available for download.");
// 			return;
// 		}
//
// 		setIsDownloading(true);
// 		try {
// 			// 1. Fetch the PDF from the Cloudinary URL
// 			const response = await fetch(thesis.pdfUrl);
// 			if (!response.ok) {
// 				throw new Error(`Failed to download file: ${response.statusText}`);
// 			}
//
// 			// 2. Create a Blob from the response
// 			const blob = await response.blob();
//
// 			// 3. Create a temporary URL for the Blob
// 			const url = window.URL.createObjectURL(blob);
//
// 			// 4. Create a temporary anchor element to trigger the download
// 			const a = document.createElement('a');
// 			a.style.display = 'none';
// 			a.href = url;
//
// 			// 5. Set a clean, user-friendly filename
// 			const filename = sanitizeFilename(`${thesis.title} - ${thesis.author}.pdf`);
// 			a.download = filename;
//
// 			// 6. Programmatically click the anchor to start the download
// 			document.body.appendChild(a);
// 			a.click();
//
// 			// 7. Clean up by revoking the temporary URL and removing the anchor
// 			window.URL.revokeObjectURL(url);
// 			document.body.removeChild(a);
//
// 		} catch (error) {
// 			console.error("Download Error:", error);
// 			alert("An error occurred while trying to download the file.");
// 		} finally {
// 			setIsDownloading(false);
// 		}
// 	};
//
// 	return (
// 		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// 			<div className="md:col-span-1">
// 				<img src={thesis.coverImageUrl} alt={thesis.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
//
// 				<Button
// 					className="w-full mt-4"
// 					onClick={handleDownload}
// 					disabled={!thesis.pdfUrl || isDownloading}
// 					title={!thesis.pdfUrl ? "No PDF has been uploaded for this thesis." : "Download PDF"}
// 				>
// 					{isDownloading ? (
// 						<>
// 							<FiLoader className="mr-2 animate-spin" />
// 							Downloading...
// 						</>
// 					) : (
// 						<>
// 							<FiDownload className="mr-2" />
// 							{!thesis.pdfUrl ? "Empty PDF File" : "Download PDF"}
// 						</>
// 					)}
// 				</Button>
// 			</div>
//
// 			<div className="md:col-span-2">
// 				<h1 className="text-3xl font-bold text-gray-900 mb-1">{thesis.title}</h1>
// 				<div className="flex items-center text-lg text-secondary-700 mb-4 space-x-4">
// 					<span className="flex items-center"><FiUser className="mr-2"/>{thesis.author}</span>
// 					<span className="flex items-center"><FiCalendar className="mr-2"/>{thesis.year}</span>
// 				</div>
//
// 				<div className="bg-secondary-50 p-4 rounded-lg mb-6">
// 					<InfoRow label="Supervisor"><FiAward className="inline mr-2" />{thesis.supervisor}</InfoRow>
// 					<InfoRow label="Department" value={thesis.department} />
// 					<InfoRow label="Matricule" value={thesis.matricule} />
// 					<InfoRow label="Location" value={thesis.etagere} />
// 					<InfoRow label="Keywords">
// 						<div className="flex flex-wrap gap-2 pt-1">
// 							{thesis.keywords.map(k => k && <span key={k} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">{k}</span>)}
// 						</div>
// 					</InfoRow>
// 				</div>
//
// 				<div>
// 					<h2 className="text-xl font-semibold flex items-center mb-2"><FiBookOpen className="mr-2"/>Abstract</h2>
// 					<p className="text-gray-600 leading-relaxed text-justify">{thesis.abstract}</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// src/components/thesis/ThesisDetailDisplay.tsx
import React, { useState } from 'react';
import type { Thesis } from '../../types/thesis';
import { FiDownload, FiUser, FiAward, FiCalendar, FiBookOpen, FiLoader } from 'react-icons/fi';
import { Button } from '../common/Button';
// --- IMPORT BOTH HELPERS ---
import { sanitizeFilename, createCloudinaryDownloadUrl } from '../../utils/fileUtils';

interface ThesisDetailDisplayProps {
	thesis: Thesis;
}

const InfoRow: React.FC<{ label: string; value?: string | number; children?: React.ReactNode }> = ({ label, value, children }) => (
	<div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-secondary-200">
		<span className="text-secondary-600 w-32 shrink-0 font-medium">{label}</span>
		{children || <span className="font-semibold text-gray-800 break-words">{value || 'N/A'}</span>}
	</div>
);

export const ThesisDetailDisplay: React.FC<ThesisDetailDisplayProps> = ({ thesis }) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		if (!thesis.pdfUrl) {
			alert("No PDF file is available for download.");
			return;
		}

		setIsDownloading(true);
		try {
			// --- THIS IS THE FIX ---
			// Create the special download URL using our new helper function
			const downloadUrl = createCloudinaryDownloadUrl(thesis.pdfUrl);

			// Fetch the PDF from the special download URL
			const response = await fetch(downloadUrl);

			if (!response.ok) {
				// This will now give a more specific error if it still fails
				throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;

			const filename = sanitizeFilename(`${thesis.title} - ${thesis.author}.pdf`);
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

		} catch (error) {
			console.error("Download Error:", error);
			alert("An error occurred while trying to download the file.");
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div className="md:col-span-1">
				<img src={thesis.coverImageUrl} alt={thesis.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />

				<Button
					className="w-full mt-4"
					onClick={handleDownload}
					disabled={!thesis.pdfUrl || isDownloading}
					title={!thesis.pdfUrl ? "No PDF has been uploaded for this thesis." : "Download PDF"}
				>
					{isDownloading ? (
						<>
							<FiLoader className="mr-2 animate-spin" />
							Downloading...
						</>
					) : (
						<>
							<FiDownload className="mr-2" />
							{!thesis.pdfUrl ? "Empty PDF File" : "Download PDF"}
						</>
					)}
				</Button>
			</div>

			{/* The rest of the component remains the same */}
			<div className="md:col-span-2">
				<h1 className="text-3xl font-bold text-gray-900 mb-1">{thesis.title}</h1>
				<div className="flex items-center text-lg text-secondary-700 mb-4 space-x-4">
					<span className="flex items-center"><FiUser className="mr-2"/>{thesis.author}</span>
					<span className="flex items-center"><FiCalendar className="mr-2"/>{thesis.year}</span>
				</div>

				<div className="bg-secondary-50 p-4 rounded-lg mb-6">
					<InfoRow label="Supervisor"><FiAward className="inline mr-2" />{thesis.supervisor}</InfoRow>
					<InfoRow label="Department" value={thesis.department} />
					<InfoRow label="Matricule" value={thesis.matricule} />
					<InfoRow label="Location" value={thesis.etagere} />
					<InfoRow label="Keywords">
						<div className="flex flex-wrap gap-2 pt-1">
							{thesis.keywords.map(k => k && <span key={k} className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">{k}</span>)}
						</div>
					</InfoRow>
				</div>

				<div>
					<h2 className="text-xl font-semibold flex items-center mb-2"><FiBookOpen className="mr-2"/>Abstract</h2>
					<p className="text-gray-600 leading-relaxed text-justify">{thesis.abstract}</p>
				</div>
			</div>
		</div>
	);
};
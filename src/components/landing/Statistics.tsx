// src/components/landing/Statistics.tsx
import useI18n from "../../hooks/useI18n.ts";
import { useLandingStats } from '../../hooks/useLandingStats'; // Importer le nouveau hook
import { FiBook, FiUsers, FiGrid, FiClock } from 'react-icons/fi';

// Un petit composant pour afficher une statistique individuelle
const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string; loading: boolean }> = ({ icon, value, label, loading }) => (
	<div className="flex flex-col items-center justify-center p-4">
		<div className="text-primary text-4xl mb-3">{icon}</div>
		{loading ? (
			<div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
		) : (
			<p className="text-4xl font-bold text-primary mb-2">
				{value}
			</p>
		)}
		<p className="text-gray-600">
			{label}
		</p>
	</div>
);

function Statistics() {
	const { t } = useI18n();
	const { stats, loading } = useLandingStats(); // Utiliser le hook pour récupérer les données

	// Fonction pour formater les nombres (ex: 5000+ devient 5k+)
	const formatNumber = (num: number) => {
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k+`;
		}
		return `${num}+`;
	};

	const statsData = [
		{
			icon: <FiBook />,
			value: loading || !stats ? "..." : formatNumber(stats.totalBooks),
			label: t(`components:landing.statistics.stat_1.label`) // Livres Gérés
		},
		{
			icon: <FiUsers />,
			value: loading || !stats ? "..." : formatNumber(stats.activeUsers),
			label: t(`components:landing.statistics.stat_2.label`) // Utilisateurs Actifs
		},
		{
			icon: <FiGrid />,
			value: loading || !stats ? "..." : `${stats.departmentCount}+`,
			label: t(`components:landing.statistics.stat_3.label`) // Catégories de Sujets
		},
		{
			icon: <FiClock />,
			value: "24/7", // Statistique statique
			label: t(`components:landing.statistics.stat_4.label`) // Disponibilité du Système
		}
	];

	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
					{statsData.map((stat, index) => (
						<StatCard
							key={index}
							icon={stat.icon}
							value={stat.value}
							label={stat.label}
							loading={loading}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default Statistics;
// src/hooks/useLandingStats.ts
import { useState, useEffect } from 'react';
import { getLandingPageStats } from '../services/statisticsService';
import type { LandingPageStats } from '../services/statisticsService';

export const useLandingStats = () => {
	const [stats, setStats] = useState<LandingPageStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const fetchedStats = await getLandingPageStats();
				setStats(fetchedStats);
			} catch (error) {
				console.error("Le hook n'a pas pu récupérer les stats", error);
				// L'état initial (null) sera conservé en cas d'erreur
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []); // Le tableau de dépendances vide signifie que cela ne s'exécute qu'une fois

	return { stats, loading };
};
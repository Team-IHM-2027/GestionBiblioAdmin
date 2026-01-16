import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

type Emprunt = {
  id: string;
  livreId: string;
  userId: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  isNew?: boolean; // pour signaler un nouvel emprunt
};

export default function Emprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [prevIds, setPrevIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'Emprunts'), orderBy('startDate', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snap => {
        const items: Emprunt[] = snap.docs.map(d => {
          const data = d.data() as any;
          const toDate = (t: any) =>
            t && typeof t.toDate === 'function' ? t.toDate() : t ? new Date(t) : undefined;

          return {
            id: d.id,
            livreId: data.livreId || '',
            userId: data.userId || '',
            status: data.status || '',
            startDate: toDate(data.startDate),
            endDate: toDate(data.endDate),
            isNew: !prevIds.has(d.id), // nouveau si absent de prevIds
          };
        });

        // Mettre à jour prevIds pour la prochaine comparaison
        setPrevIds(new Set(items.map(e => e.id)));

        // Mettre à jour les emprunts
        setEmprunts(items);

        // Supprimer le statut "nouveau" après 5 secondes
        items.forEach((e, idx) => {
          if (e.isNew) {
            setTimeout(() => {
              setEmprunts(prev => {
                const copy = [...prev];
                copy[idx].isNew = false;
                return copy;
              });
            }, 5000);
          }
        });
      },
      err => {
        console.error('Erreur écoute emprunts', err);
        setMessage('Erreur lors de la synchronisation des emprunts.');
        setTimeout(() => setMessage(null), 3000);
      }
    );

    return () => unsubscribe(); // cleanup à la destruction du composant
  }, [prevIds]);

  return (
    <div>
      <h1>Emprunts (temps réel)</h1>
      {message && <div role="status" style={{ marginTop: 12 }}>{message}</div>}
      <ul>
        {emprunts.map(e => (
          <li
            key={e.id}
            style={{
              backgroundColor: e.isNew ? '#d4edda' : 'transparent',
              padding: '4px',
              margin: '2px 0',
              borderRadius: '4px',
              transition: 'background-color 0.5s ease',
            }}
          >
            <strong>Livre:</strong> {e.livreId} — <strong>Usager:</strong> {e.userId} — <strong>Statut:</strong> {e.status}
            {e.startDate && <> — <small>{e.startDate.toLocaleString()}</small></>}
          </li>
        ))}
      </ul>
    </div>
  );
}

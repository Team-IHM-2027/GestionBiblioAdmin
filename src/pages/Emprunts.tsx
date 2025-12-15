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
};

export default function Emprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'Emprunts'), orderBy('startDate', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snap => {
        const items = snap.docs.map(d => {
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
          } as Emprunt;
        });
        setEmprunts(items);
      },
      err => {
        console.error('Erreur écoute emprunts', err);
        setMessage('Erreur lors de la synchronisation des emprunts.');
        setTimeout(() => setMessage(null), 3000);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Emprunts (temps réel)</h1>
      {message && <div role="status" style={{ marginTop: 12 }}>{message}</div>}
      <ul>
        {emprunts.map(e => (
          <li key={e.id}>
            <strong>Livre:</strong> {e.livreId} — <strong>Usager:</strong> {e.userId} — <strong>Statut:</strong> {e.status}
            {e.startDate && <> — <small>{e.startDate.toLocaleString()}</small></>}
          </li>
        ))}
      </ul>
    </div>
  );
}
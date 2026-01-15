// src/components/LibrarianAlertListener.tsx
'use client';
import { useEffect } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNotifications } from '../context/notificationContext';

export default function LibrarianAlertListener() {
    const { addNotification } = useNotifications();

    useEffect(() => {
        // Ecoute les alertes non lues destinees aux bibliothecaires
        const q = query(
            collection(db, 'SystemAlerts'),
            where('targetRole', '==', 'librarian'),
            where('read', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const type = ['success', 'error', 'warning', 'info'].includes(data.type)
                        ? data.type
                        : 'warning';

                    addNotification({
                        type,
                        title: data.title || 'Alerte Systeme',
                        message: data.message,
                        duration: 10000
                    });

                    updateDoc(doc(db, 'SystemAlerts', change.doc.id), {
                        read: true,
                        readAt: serverTimestamp()
                    }).catch((error) => {
                        console.error('Error marking alert as read:', error);
                    });
                }
            });
        });

        return () => unsubscribe();
    }, [addNotification]);

    return null;
}

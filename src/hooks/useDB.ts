import { useState, useEffect } from "react";
import { initDB, getLastFiveEntries } from  "../lib/db";

export function useDB() {
    const [database, setDatabase] = useState<IDBDatabase | null>(null);
    const [lastFiveEntries, setLastFiveEntries] = useState<any[]>([]);
    const [notReadyDataDB, setNotReadyDataDB] = useState<boolean>(true);

    useEffect(() => {
        let _mounted = true;
    
        const loadDBandEntries = async () => {
            if (!_mounted) return;
            if (!window.indexedDB)
            {
                setDatabase(null);
                alert("Base de donnée inutilisable pas d'historique dans le navigateur !");
                return;
            }
            const db = await initDB();
            setNotReadyDataDB(false);
            setDatabase(db);
            const entries = await getLastFiveEntries(db);
            setLastFiveEntries(entries);
        };

        loadDBandEntries();
        
        return () => {
            _mounted = false;
        };
    }, []);

    return {
        database,
        notReadyDataDB,
        setNotReadyDataDB,
        lastFiveEntries,
        setLastFiveEntries,
    };
}
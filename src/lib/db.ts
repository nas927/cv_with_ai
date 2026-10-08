export function initDB(): Promise<IDBDatabase> {
    if (!('indexedDB' in window)) {
        console.error("IndexedDB n'est pas supporté par ce navigateur.");
        return Promise.reject(new Error("IndexedDB n'est pas supporté par ce navigateur."));
    }
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open("jobs", 1);
        
        request.onupgradeneeded = function(event: Event) {
            const db: IDBDatabase = (event.target as IDBRequest).result;
            
            // Création du store avec une clé auto-incrémentée
            const store = db.createObjectStore("jobs", { keyPath: "id", autoIncrement: true });
            
            // Création d'index (facultatif, mais utile si tu veux chercher plus tard)
            store.createIndex("entreprise", "entreprise", { unique: false });
            store.createIndex("titre", "titre", { unique: false });
            store.createIndex("cvName", "cvName", { unique: false });
            store.createIndex("description", "description", { unique: false });
        };
        
        request.onerror = function(event: Event) {
            const target = event.target as IDBRequest;
        
            console.error("Erreur d'ouverture :", target.error);
            reject(target.error);
        };
        
        request.onsuccess = function(event: Event) {
            const target = event.target as IDBRequest;
            if (!target.result) {
                reject(new Error("Impossible d'ouvrir la base de données"));
                return;
            }
            const db: IDBDatabase = target.result;
            resolve(db);
            return db;
        };
    });
}

export function addData(db: IDBDatabase, data: any) {
    const tx = db.transaction("jobs", "readwrite");
    const store = tx.objectStore("jobs");
  
    const ajout = store.add(data);
  
    ajout.onsuccess = () => console.log("Ajouté :", data);
    ajout.onerror = (e: Event) => {
        const target = e.target as IDBRequest;
        console.error("Erreur ajout :", target.error);
    };
}

export function getAllData(db: IDBDatabase): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("jobs", "readonly");
        const store = tx.objectStore("jobs");
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e: Event) => {
            const target = e.target as IDBRequest;
            console.error("Erreur récupération :", target.error);
            reject(target.error);
        };
    });
}

export function countAll(db: IDBDatabase): Promise<number> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("jobs", "readonly");
        const store = tx.objectStore("jobs");
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e: Event) => {
            const target = e.target as IDBRequest;
            console.error("Erreur comptage :", target.error);
            reject(target.error);
        };
    });
}

export function getLastFiveEntries(db: IDBDatabase): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("jobs", "readonly");
        const store = tx.objectStore("jobs");

        const results: any[] = [];

        const request = store.openCursor(null, "prev");

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;

            if (cursor && results.length < 5) {
                results.push(cursor.value);
                cursor.continue();
            } else
                resolve(results);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
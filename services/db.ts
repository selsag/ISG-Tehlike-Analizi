
import { FileRecord } from '../types';

const DB_NAME = "RiskDosyaDB";
const STORE_NAME = "riskDosyalari";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error("Veritabanı hatası: ", request.error);
                dbPromise = null; // Allow retrying on next call
                reject("Veritabanı hatası: " + request.error);
            };

            request.onsuccess = () => {
                const db = request.result;
                // Handle connection closing unexpectedly
                db.onclose = () => {
                    console.warn("Veritabanı bağlantısı kapandı. Bir sonraki işlemde yeniden açılacak.");
                    dbPromise = null;
                };
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const dbInstance = (event.target as IDBOpenDBRequest).result;
                if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                    const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                    store.createIndex("riskIdIndex", "riskId", { unique: false });
                }
            };
        });
    }
    return dbPromise;
};

// Export getDB as openDB so the App can eagerly initialize the connection
export const openDB = getDB;

export const addFileToDB = async (riskId: number, file: File): Promise<number> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const fileRecord = {
      riskId: riskId,
      fileData: file,
      fileName: file.name,
      fileType: file.type
    };
    const request = store.add(fileRecord);

    transaction.oncomplete = () => resolve(request.result as number);
    transaction.onerror = () => reject("Dosya eklenemedi: " + transaction.error);
  });
};

export const getFilesForRisk = async (riskId: number): Promise<FileRecord[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("riskIdIndex");
        const request = index.getAll(riskId);

        request.onsuccess = () => resolve(request.result as FileRecord[]);
        request.onerror = () => reject("Dosyalar alınamadı: " + request.error);
    });
};

export const getAllFiles = async (): Promise<FileRecord[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result as FileRecord[]);
        request.onerror = () => reject("Dosyalar alınamadı: " + request.error);
    });
};

export const getFileById = async (id: number): Promise<FileRecord> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result as FileRecord);
            } else {
                reject("Dosya bulunamadı: " + id);
            }
        };
        request.onerror = () => reject("Dosya alınamadı: " + request.error);
    });
};

export const deleteFileFromDB = async (id: number): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject("Dosya silinemedi: " + transaction.error);
  });
};

export const deleteFilesByRiskId = async (riskId: number): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("riskIdIndex");
        const request = index.getAllKeys(riskId);

        request.onsuccess = () => {
            const keys = request.result;
            if (!keys || keys.length === 0) {
                resolve();
                return;
            }
            
            // Delete all found keys
            // Since getAllKeys returns keys, we can iterate and delete
            let completed = 0;
            keys.forEach((key) => {
                store.delete(key);
            });
            
            transaction.oncomplete = () => resolve();
        };
        request.onerror = () => reject("Dosya anahtarları alınamadı: " + request.error);
    });
};

export const clearDB = async (): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject("Veritabanı temizlenemedi: " + transaction.error);
  });
};

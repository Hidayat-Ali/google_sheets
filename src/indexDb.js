export const openDB = (dbName, storeName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
    };
  });
};

export const getObjectStore = (db, storeName, mode) => {
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

export const saveData = (dbName, storeName, data) => {
  return openDB(dbName, storeName).then((db) => {
    const store = getObjectStore(db, storeName, "readwrite");
    const request = store.put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

export const getData = (dbName, storeName, id) => {
  return openDB(dbName, storeName).then((db) => {
    const store = getObjectStore(db, storeName, "readonly");
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

export const getAllData = (dbName, storeName) => {
  return openDB(dbName, storeName).then((db) => {
    const store = getObjectStore(db, storeName, "readonly");
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

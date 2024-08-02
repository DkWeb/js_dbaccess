var dbaccess = function() {
	var db;

    return {
        initDb: function(dbname, dbversion, createObjectStoreFuncs) {
            return new Promise(function(resolve, reject) {
                if (!window.indexedDB) {
	    			reject(new Error('No support for IndexedDB in this browser'));
	    			return;
	  			}
                var request = indexedDB.open(dbname, dbversion);
                request.onupgradeneeded = function(event) {
                    db = event.target.result;
                    createObjectStoreFuncs.forEach(e => e.call(undefined, db));

                    var transaction = event.target.transaction;			                
                    transaction.oncomplete = function(event) {    
                        console.log("Data store upgraded successfully");
                        resolve(event);	
                        return;					
                    }
                }
                request.onerror = function(event) {
					reject(new Error("Error occurred while creating the data store" + event));
                    return;
				};
				request.onsuccess = function(event) {
					db = request.result;
                    console.log("Data store created successfully");
					resolve(event);
                    return;
				};	
            });
        },
        saveItem: function(objectStoreName, toStore) {
            return new Promise(function(resolve, reject) {
                if (!db) {
					reject(new Error('Please init db first!'));
					return;
				}
				var transaction = db.transaction([  objectStoreName ], "readwrite");
				transaction.oncomplete = function(event) {
				  resolve();
                  return;
				};
				transaction.onerror = function(event) {
				  reject('Error when trying to save to object store ' + objectStoreName + '. ' + event);
                  return;
				};
				var objectStore = transaction.objectStore(objectStoreName);
				objectStore.put(toStore);
            });
        },
        getItem: function(objectStoreName, path) {
            return new Promise(function(resolve, reject) {
                if (!db) {
					reject(new Error('Please init db first!'));
					return;
				}
				var transaction = db.transaction([  objectStoreName ], "readonly");
				transaction.onerror = function(event) {
				  reject('Error when trying to load an object from object store ' + objectStoreName + '. ' + event);
                  return;
				};
				var objectStore = transaction.objectStore(objectStoreName);
				var request = objectStore.get(path);
                request.onsuccess = function(event) {
                	var hit = event.target.result;
                    resolve(hit);
                }
            });
        },
        getAllItems: function(objectStoreName) {
            return new Promise(function(resolve, reject) {
                if (!db) {
                    reject(new Error('Please init db first!'));
                    return;
                }
                var transaction = db.transaction([  objectStoreName ], "readonly");
                transaction.onerror = function(event) {
                    reject('Error when trying to load objects from object store ' + objectStoreName + '. ' + event);
                    return;
                };
                var objectStore = transaction.objectStore(objectStoreName);
                var request = objectStore.getAll();
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                }
            });
        }        
    }
}();
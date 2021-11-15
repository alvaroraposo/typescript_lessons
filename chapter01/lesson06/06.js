//@ts-check
/** @typedef { import('./06').ShipStorage }
ShipStorage */
/** @typedef { import('./06').StorageItem }
StorageItem */
/** @constant { import('./06').isDevelopment }
isDevelopment */

/** @type ShipStorage */
const storage = {
  max: undefined,
  items: [],
};

let currentStorage = undefined;
function storageUsed() {
  if (currentStorage) {
    return currentStorage;
  }
  currentStorage = 0;
  for (let i = 0; i < storage.items.length; i++) {
    currentStorage += storage.items[i].weight;
  }
  return currentStorage;
}

/**
 * @param {StorageItem} item
 */
function add(item) {
  if (storage.max - item.weight >= storageUsed()) {
    storage.items.push(item);
    currentStorage += item.weight;
  }

  if (isDevelopment) {
    const itemCount = storage.items.length;
    console.log(`${itemCount} items`);
    console.log(`${currentStorage} kg total`);
  }
}

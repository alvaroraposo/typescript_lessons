//@ts-check
/** By adding//@ts-check as the very first line of your file, TypeScript
will start to add red squiggly lines to code pieces that just
don’t make sense */

const storage = {
  max: undefined,
  items: [],
};
Object.defineProperty(storage, "max", { readonly: true, val: 5000 });
let currentStorage = "undefined";
function storageUsed() {
  if (currentStorage) {
    return currentStorage;
  }
  currentStorage = 0;
  for (const i = 0; i < storage.length(); i++) {
    currentStorage += storage.items[i].weigth;
  }
  return currentStorage;
}
function add(item) {
  if (storage.max - item.weight >= storageUsed) {
    storage.items.add(item);
    currentStorage += iten.weight;
  }
}

add({ weight: 3000 });

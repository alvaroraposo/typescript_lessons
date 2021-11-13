//@ts-check

const storage = {
  max: undefined,
  items: [],
};
/* Property descriptors don’t know of a property called readonly ; it’s
called writable . Instead of a readonly value of true , we
need a writable value of false .*/
/*TypeScript will also tell us that val does not exist
– it’s value . */
//Object.defineProperty(storage, "max", { readonly: true, val: 5000 });
Object.defineProperty(storage, "max", { writable: false, value: 5000 });
/** Once you assign a value to a variable, you most likely want it to keep a
specific type. */
//let currentStorage = "undefined";
let currentStorage = undefined;
function storageUsed() {
  // currentStorage = "undefined" would lead to 'true'
  if (currentStorage) {
    return currentStorage;
  }
  currentStorage = 0;
  /**we declared
the initialization variable i as a constant. Constants can’t
be reassigned */
  //  for (const i = 0; i < storage.length(); i++) {
  for (let i = 0; i < storage.items.length; i++) {
    currentStorage += storage.items[i].weigth;
  }
  return currentStorage;
}
function add(item) {
  //we also compare numbers to a function!
  //  if (storage.max - item.weight >= storageUsed) {
  if (storage.max - item.weight >= storageUsed()) {
    // The next line tells us that add is not a valid method on arrays; it should be push :
    //    storage.items.add(item);
    storage.items.push(item);
    //currentStorage += iten.weight;  }
    currentStorage += item.weight;
  }
}

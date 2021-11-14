//@ts-check
/**
* Adding two numbers. This annotation tells
TypeScript
* which types to expect. Two parameters (params) of
* type number and a return type of number
*
* @param {number} numberOne
* @param {number} numberTwo
* @returns {number}
*/
function addNumbers(numberOne, numberTwo) {
  return numberOne + numberTwo;
}

/**
* Adding two numbers. This annotation tells
TypeScript
* which types to expect. Two parameters (params) of
* type number and a return type of number
*
* @param {number} numberOne
* @param {number} numberTwo
* @returns {number}
*/
function addNumbers2(numberOne, numberTwo) {
  return numberOne.toUpperCase() + "";
  // Wait, what? We are treating numberOne like a
  // string, even though it's a number, and we return
  // it as a string even though we expect a number in
  // return, there's something wrong here!
}
// TypeScript throws an error here, because the JSDoc
// comments expect two numbers, not a number and
// a string
addNumbers(3, "2");

// TypeScript throws an error here, because addNumbers
// returns a number, and toUpperCase() is not available
// in number
addNumbers(3, 2).toUpperCase();

/**So within a comment, we define a new type called Storage
Item , which is an object. It has one property called weight,
which is a number. We also create a type for our storage object
in the same fashion. */
/**
 * @typedef {Object} StorageItem
 * @property {number} weight
 */

/**
 * @typedef {Object} ShipStorage
 * @property {number} max
 * @property {StorageItem[]} items
 */

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

//let deliveryAddress; // deliveryAddress is any

// deliveryAddress is of type string
//let deliveryAddress = '421 Smashing Hill, 90210' //string

// deliveryAddress is of type any
//let deliveryAddress: any = "421 Smashing Hill, 90210";

// deliveryAddress is of type string,
// why assign a number?
let deliveryAddress: string = 2;

/**
 * left-hand typing, as the typing happens before
 * (to the left of) the equals sign.
 * Leaving out type annotations and working first with type
inference is called right-hand typing:
 */

let deliveryAddresses: string[] = [];
// OK
deliveryAddresses.push("421 Smashing Hill, 90210");
// Not OK! 2 is not a string
deliveryAddresses.push(2000);

//With any , things like this are possible:
const myName: any = "Fritz the Cat";
myName.firstLetter.makeCapitals();
// theObject is an object we don’t have a type for,
// but we know exactly what
// we are doing!
let theObject;
(theObject as any).firstLetter.toUppercase();
/**
 * If you want to make sure you don’t have any somewhere
 * in your code you don’t expect it to be, set the compiler
 * flag noImplicitAny to true .
 */
// deliveryAddress is of type any, because we
// didn’t annotate a specific type. Implicit anys are
// hard to track down later on, that’s why it’s good
// to have TypeScript scream at us
function printAddress(deliveryAddress) {
  console.log(deliveryAddress);
}

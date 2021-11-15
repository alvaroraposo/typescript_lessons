/**
 * To be even more explicit and intentional with our types, we
have to add type annotations.
 *  function addVAT(price, vat = 0.2)
 */
function addVAT(price, vat = 0.2) {
    return price * (1 + vat);
}
/**
 * The type definitions above are short form for:
function addVAT(price: number, vat: number = 0.2): number {
    return price * (1 + vat)
}
 */
// vatPrice is of type ‘number’
//One way is to add a default value for vat
//const vatPrice = addVAT(30, 0.2);
const vatPrice = addVAT(30, 0.2);
// vatPrice is of type ‘number’
const vatPriceWithDefault = addVAT(30); // OK!
const vatPriceWrong = addVAT("this is so", "wrong");
// Not OK. We expect a number for vat because of the
// default value! This piece causes errors
const vatPriceErrors = addVAT(30, "a string!");
// This, however, is not quite reasonable, but OK
const vatPriceAlsoWrong = addVAT("Hi, friends!");
/**
 * "any" is a special TypeScript type – it does not
exist in JavaScript. It accepts any value of any
type, and is thus a top type, encompassing all
other types. TypeScript sets "any" as the default
type for any value or parameter that is not
explicitly typed or can’t be inferred.
 */

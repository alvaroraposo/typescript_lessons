const deliveryAddresses = ["um", "dois"];

function selectDeliveryAddress(addressOrIndex: any): string {
  //function selectDeliveryAddress(addressOrIndex: any) {
  /*
The comparison to see if addressOrIndex is
smaller than the number of items in deliveryAddresses 
is also only possible because we know
addressOrIndex is a number*/
  if (
    typeof addressOrIndex === "number" &&
    addressOrIndex < deliveryAddresses.length
  ) {
    //  if (typeof addressOrIndex === "number") {
    // OK, because addressOrIndex is a number
    console.log(addressOrIndex.toFixed(2));
    // OK, because addressOrIndex is a number
    console.log(addressOrIndex * 2 + 3);
    return deliveryAddresses[addressOrIndex];
  }
  return addressOrIndex;
}

// Oh no! This is totally OK in TypeScript, but
// myFavouriteAddress is now string, even though we just
// return true? This is going to blow up in runtime!
const myFavouriteAddress = selectDeliveryAddress(true);

/**
 * we aren’t allowed to do anything with unknown .
unknown should make you cautious: we have to provide a
proper control flow to ensure type safety. Let’s see what
happens when we change any to unknown :
 */

function selectDeliveryAddress(addressOrIndex: unknown): string {
  if (
    typeof addressOrIndex === "number" &&
    addressOrIndex < deliveryAddresses.length
  ) {
    return deliveryAddresses[addressOrIndex];
  } else if (typeof addressOrIndex === "string") {
    return addressOrIndex;
  }
  return "";
  /**
   * We must do type checks and trigger control
   * flow analysis; otherwise, TypeScript will throw an error!
   */
  //  return addressOrIndex;
}

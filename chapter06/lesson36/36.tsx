type Customer = {
  customerId: number;
  firstName: string;
  lastName: string;
};

const customer = {
  customerId: 1,
  firstName: "Stefan",
  lastName: "Baumgartner",
}; // = type Customer

type Product = {
  productId: number;
  title: string;
  price: number;
};

const product = {
  productId: 22,
  title: "Form Design Patterns",
  price: 29,
};

type Order = {
  orderId: number;
  customer: Customer;
  products: Product[];
  date: Date;
};

// We are implementing an administration interface for an e-commerce application.
/*
We want to provide a fetchOrder function, which works as follows:

1. If we pass a customer, we get a list of orders from this customer.
2. If we pass a product, we get a list of orders that include this product.
3. If we pass an order ID, we just get that particular order.

Our first idea to implement this would be function overloads.


function fetchOrder(customer: Customer): Order[];
function fetchOrder(product: Product): Order[];

function fetchOrder(orderId: number): Order;
function fetchOrder(param: any): any {
  // Implementation to follow
}
*/

/*
This works well for simple cases where we’re absolutely
sure which parameters we expect:
fetchOrder(customer); // It’s Order[]
fetchOrder(2); // It’s Order
*/

/*
When we pass an argument that can be either Customer or number , the
output is a bit boring:

declare const ambiguous: Customer | number;
fetchOrder(ambiguous); // It’s any
*/

/*
Of course, we could patch the types of the implementation
function to be a bit clearer: 

function fetchOrder(customer: Customer): Order[];
function fetchOrder(product: Product): Order[];

function fetchOrder(param: Customer | Product | number): Order[] | Order {
  // Implementation to follow
}*/

/*
But being explicit about all possible outcomes gets very
verbose very quickly:
function fetchOrder(customer: Customer): Order[];
function fetchOrder(product: Product): Order[];
function fetchOrder(orderId: number): Order;
function fetchOrder(param: Customer | Product): Order[];
function fetchOrder(param: Customer | number): Order[] | Order;
function fetchOrder(param: Product | number): Order[] | Order;
function fetchOrder(param: Customer | Product | number): Order[] | Order {
  // I hope I didn’t forget anything
}*/

/*
We can map each input type to an output type
• If the input type is Customer , the return type is Order[]
• If the input type is Product , the return type is Order[]
• If the input type is number , the return type is Order

If the input type is a combination of available input types, the
return types are a combination of the respective output types.

We can model this behavior with conditional types. The syn-
tax for conditional types is based on generics and is as follows:

ternary-like
type Conditional<T> = T extends U ? A : B; */

type FetchParams = number | Customer | Product;
type FetchReturn<Param extends FetchParams> = Param extends Customer
  ? Order[]
  : Param extends Product
  ? Order[]
  : Order;

/* 
    1. If the Param type extends Customer, we expect an Order[] array.
    2. Else, if Param extends Product , we also expect an Order[] array.
    3. Otherwise, when only number is left, we expect a single Order .

    In TypeScript jargon, we say the conditional type resolves to Order[].
*/
function fetchOrder<Param extends FetchParams>(
  param: Param
): FetchReturn<Param> {
  // Well, the implementation
  return null;
}

declare const ambiguous: Customer | number;

fetchOrder(customer); // Order[] OK!
fetchOrder(product); // Order[] OK!
fetchOrder(2); // Order OK!
fetchOrder(ambiguous); // Order | Order[]

declare const x: any;
// any is not part of `FetchParams`
fetchOrder(x);

/* 
Conditional types also work well with the idea of having a
type layer around regular JavaScript. They work only in the
type layer and can be easily erased, while still being able to
describe all possible outcomes of a function.
*/

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
type FetchParams = number | Customer | Product;
type FetchReturn<Param extends FetchParams> = Param extends Customer
  ? Order[]
  : Param extends Product
  ? Order[]
  : Order;

/*
Remember the metaphor from the previous chapter: gener-
ics work like functions, have parameters, and return output.
With that in mind, we can see how this conditional type
works when we put in one type as argument.
*/
//type FetchByCustomer = FetchReturn<Customer>;
type FetchByCustomer = Customer extends Customer
  ? Order[]
  : Customer extends Product
  ? Order[]
  : Order;

// hover over FectchByCustomer (type FetchByCustomer = Order[])

/* 
It gets a little different once we pass union types. In most
cases, conditional types are distributed over unions during
instantiation.
*/

//type FetchByProductOrId = FetchReturn<Product | number>;
/*
FetchReturn is a distributive conditional type. This means
that each constituent of the generic type parameter is instan-
tiated with the same conditional type. In short: a conditional
type of a union type is like a union of conditional types.
*/
// Distribution over Unions
/*
type FetchByProductOrId =
  | (Product extends Customer
      ? Order[]
      : Product extends Product
      ? Order[]
      : Order)
  | (number extends Customer
      ? Order[]
      : number extends Product
      ? Order[]
      : Order);*/

/*
Knowing that TypeScript’s conditional types work through
distribution is incredibly important for a couple of reasons.

1. We can track each input type to exactly one output
type, no matter in which combination they occur.

2. This means that in a scenario like ours, where we want
to have different return types for different input types,
we can be sure we don’t forget a combination. The
possible combinations of return types is exactly the
possible combinations of input types.

Even though the possible combinations are the same, return
type unions remove duplicates and impossible results. This
means that if we do a distribution over all possible input
types, we get two output types in the result:
*/

type FetchByProductOrId1 = FetchReturn<Product | Customer | number>;
// Equal to
type FetchByProductOrId2 =
  | (Product extends Customer
      ? Order[]
      : Product extends Product
      ? Order[]
      : Order)
  | (Customer extends Customer
      ? Order[]
      : Customer extends Product
      ? Order[]
      : Order)
  | (number extends Customer
      ? Order[]
      : number extends Product
      ? Order[]
      : Order);

// Equal to
type FetchByProductOrId3 = Order[] | Order[] | Order;
// Removed redundancies
type FetchByProductOrId = Order[] | Order;
type FetchByCustomer2 = FetchReturn<Customer>;
type FetchByCustomer3 =
  // This condition is still true!
  [Customer] extends [Customer]
    ? Order[]
    : [Customer] extends [Product]
    ? Order[]
    : Order;
type FetchByCustomer4 = Order[];

/* 
The tuple [Param] when instantiated with Customer is still a
subtype of the tuple [Customer] , so this condition still resolves
to Order[] . When we instantiate Param with a union type, and
this doesn’t get distributed, we get the following result:
*/
type FetchByCustomerOrId = FetchReturn<Customer | number>;
type FetchByProductOrId4 =
  // This is false!
  [Customer | number] extends [Customer]
    ? Order[]
    : // This is obviously also false
    [Customer | number] extends [Product]
    ? Order[]
    : // So we resolve to this
      Order;
type FetchByProductOrId5 = Order; // Gasp!

/* 
To make this conditional type a lot safer and more correct, we
can add another condition to it where we check for the sub-
type of number . The last conditional branch resolves to never .
*/
type FetchReturn2<Param extends FetchParams> = [Param] extends [Customer]
  ? Order[]
  : [Param] extends [Product]
  ? Order[]
  : [Param] extends [number]
  ? Order
  : never;

/*
This ensures we definitely get the correct return value if
we work with a single type. Union types always resolve to
never , which can be a nice way of making sure that we first
narrow down to a single constituent of the union.
  */

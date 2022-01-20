/* there are scenarios where a healthy mix of function
overloads and conditional types create much better readability and clearer outcomes. 
Let’s refactor fetchOrder so it allows for asynchronous data
retrieval. The function should combine two different asyn-
chronous patterns:

1. If we pass a single argument (either number, Customer or Product ), 
we get a promise in return with the respective outcome ( Order or Order[] ).

2. We are able to pass a callback as a second argument.
This callback gets the result ( Order or Order[] ) as a
parameter; the function fetchOrder returns void.

This is a classical pattern that we can see in many Node.js li-
braries.
*/

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

type FetchReturn<Param extends FetchParams> = Param extends Customer
  ? Order[]
  : Param extends Product
  ? Order[]
  : Order;

// A callback helper type
type Callback<Res> = (result: Res) => void;
type FetchParams = number | Customer | Product;
// Version 1. Similar to the version from
// the previous lesson, but wrapped in a promise
/*
function fetchOrder<Par extends FetchParams>(
  inp: Par
): Promise<FetchReturn<Par>>;

// Version 2. We pass a callback function that
// gets the result, and return void.
function fetchOrder<Par extends FetchParams>(
  inp: Par,
  fun: Callback<FetchReturn<Par>>
): void;
*/

/* 
A possible solution would be to do a conditional type for a
union of the entire set of function heads.

function doSomething(...rest) {
return rest[0] + rest[1]
}
// Returns “JavaScript”
doSomething(‘Java’, ‘Script’ )

function fetchOrder<Par extends FetchParams>(
  ...args: [Par, Callback<FetchReturn<Par>>]
): void;

function fetchOrder<Par extends FetchParams>(
  ...args: [Par]
): Promise<FetchReturn<Par>>;*/

/*
We sum up the entire argument list of each function head
into separate tuple types. This means that we can create a
conditional type that selects the right output type.
*/
// A small helper type to make it easier to read
type FetchCb<T extends FetchParams> = Callback<FetchReturn<T>>;

type AsyncResult<FHead, Par extends FetchParams> = FHead extends [
  Par,
  FetchCb<Par>
]
  ? void
  : FHead extends [Par]
  ? Promise<FetchReturn<Par>>
  : never;

/* 
  The conditional type reads as follows:
1. If the function head FHead is a subtype of tuple
FetchParams and FetchCb , then return void.
2. Otherwise, if the function head is a subtype of the
tuple FetchParams , return a promise.
3. Otherwise, never return

We can use this newly created conditional type and bind it
to our function.
  */
function fetchOrder<Par extends FetchParams, FHead>(
  ...args: FHead[]
): AsyncResult<FHead, Par>;

/*
And this pretty much does the trick. But it also comes at
a high price:

1. Readability. Conditional types are already hard to
read. In this case, we have two nested conditional
types: the old FetchReturn , that reliably returns the
respective return type; and the new AsyncResult , that
tells us if we get void or a promise back.

2. Correctness. Somewhere along the way we might
lose binding information for our generic type parame-
ters. This means we don’t get the actual return type,
but a union of all possible return types. Making sure
we don’t lose anything requires us to bind a lot of
parameters, thus crowding our generic signatures
and generic constraints.
*/

// Version 1
function fetchOrder<Par extends FetchParams>(
  inp: Par
): Promise<FetchReturn<Par>>;
// Version 2
function fetchOrder<Par extends FetchParams>(
  inp: Par,
  fun: Callback<FetchReturn<Par>>
): void;
// The implementation!
function fetchOrder<Par extends FetchParams>(
  inp: Par,
  fun?: Callback<FetchReturn<Par>>
): Promise<FetchReturn<Par>> | void {
  // Fetch the result
  const res = fetch(`/backend?inp=${JSON.stringify(inp)}`).then((res) =>
    res.json()
  );
  // If there’s a callback, call it
  if (fun) {
    res.then((result) => {
      fun(result);
    });
  } else {
    // Otherwise return the result promise
    return res;
  }
}

/* 
If we look closely, we see that we don’t leave conditional
types completely. The way we treat the FetchReturn type
is still a conditional type, based on the FetchParams union
type. The variety of inputs and outputs was nicely con-
densed into a single type.

However, the complexity of different function heads was
better suited to function overloads. The input and output be-
havior is clear and easy to understand, and the function shape
is different enough to qualify for being defined explicitly. As a
rule of thumb for your functions:

1. If your input arguments rely on union types, and you
need to select a respective return type, then a conditional type is the way to go.

2. If the function shape is different (e.g. optional arguments), 
and the relationship between input argumentsand output types is easy to follow, 
a function overload will do the trick.
*/

type Medium = {
  id: number;
  title: string;
  artist: string;
};

type TrackInfo = {
  duration: number;
  tracks: number;
};

type CD = Medium &
  TrackInfo & {
    kind: "cd";
  };

type LP = Medium &
  TrackInfo & {
    kind: "lp";
  };

type AllMedia = CD | LP;
type MediaKinds = AllMedia["kind"];

declare function createMedium(kind, info): AllMedia;
declare function createMedium(kind: MediaKinds, info): AllMedia;
// We use a generic to bind the actual value type if we use a literal.
declare function createMedium<Kin extends MediaKinds>(
  kind: Kin,
  info
): AllMedia;

type SelectBranch<Brnch, Kin> = Brnch extends { kind: Kin } ? Brnch : never;
type SelectCD = SelectBranch<AllMedia, "cd">;

// Equal to
type SelectCD2 = CD | never;

// A quick look back to the previous lesson. This is how far we got:
declare function createMedium<Kin extends MediaKinds>(
  kind: Kin,
  info
): SelectBranch<AllMedia, Kin>;

// Resolves to LP
type SelectLP = Extract<AllMedia, { kind: "lp" }>;

// We select a certain kind, and know which return type to expect.
createMedium("lp", {
  /* tbd */
}); // Returns LP!
createMedium("cd", {
  /* tbd */
}); // Returns CD!

type CDInfo = {
  title: string;
  description: string;
  tracks: number;
  duration: number;
};

type LPInfo = {
  title: string;
  description: string;
  sides: {
    a: {
      tracks: number;
      duration: number;
    };
    b: {
      tracks: number;
      duration: number;
    };
  };
};

type Removable = "kind" | "id";
type Remove<A, B> = A extends B ? never : A;
// First our keys
type CDKeys = keyof CDInfo;

// Equal to
// type CDKeys = "id" | "description" | "title" | "kind" | "tracks" | "duration";
// Now for the keys we actually want
type CDInfoKeys = Remove<CDKeys, Removable>;
// Equal to
type CDInfoKeys2 = Remove<
  "id" | "description" | "title" | "kind" | "tracks" | "duration",
  "id" | "kind"
>;
// Now for the keys we actually want
type CDInfoKeys3 = Remove<CDKeys, Removable>;
// Equal to
type CDInfoKeys4 = Remove<
  "id" | "description" | "title" | "kind" | "tracks" | "duration",
  "id" | "kind"
>;

// A conditional of a union is a union of conditionals
type CDInfoKeys5 =
  | Remove<"id", "id" | "kind">
  | Remove<"description", "id" | "kind">
  | Remove<"title", "id" | "kind">
  | Remove<"kind", "id" | "kind">
  | Remove<"tracks", "id" | "kind">
  | Remove<"duration", "id" | "kind">;

// Substitute
type CDInfoKeys6 =
  | ("id" extends "id" | "kind" ? never : "id")
  | ("description" extends "id" | "kind" ? never : "description")
  | ("title" extends "id" | "kind" ? never : "title")
  | ("kind" extends "id" | "kind" ? never : "kind")
  | ("tracks" extends "id" | "kind" ? never : "tracks")
  | ("duration" extends "id" | "kind" ? never : "duration");

// Evaluate
type CDInfoKeys7 =
  | never
  | "description"
  | "title"
  | "never"
  | "tracks"
  | "duration";

// Remove impossible types from the union"tracks" ‘tracks’ | ‘duration’
type CDInfoKeys8 = "description" | "title" | "tracks" | "duration";
type CDInfo2 = Pick<CD, Exclude<keyof CD, "kind" | "id">>;
type CDInfo3 = Omit<CD, "kind" | "id">;
type RemovableKeys = "kind" | "id";
type GetInfo<Med> = Omit<Med, RemovableKeys>;
declare function createMedium<Kin extends MediaKinds>(
  kind: Kin,
  info: GetInfo<SelectBranch<AllMedia, Kin>>
): SelectBranch<AllMedia, Kin>;

// A userId variable counting up... not safe
// but we are in development mode
let userId = 0;
function createUser(name, roles) {
  return {
    userId: userId++,
    name,
    roles,
    createdAt: new Date(),
  };
}

function createUser2(
  name: string,
  role: "admin" | "maintenance" | "shipping",
  isActive: boolean
) {
  return {
    userId: userId++,
    name,
    role,
    isActive,
    createdAt: new Date(),
  };
}

// The type of user is the shape returned by createuser
const user = createUser2("Stefan", "shipping", true);
type User = typeof user;

type GetReturn<Fun> = Fun extends (...args: any[]) => any ? Fun : never;
type Fun = GetReturn<typeof createUser2>;
type GetReturn2<Fun> = Fun extends (...args: any[]) => infer R ? R : never;
type User2 = GetReturn<typeof createUser2>;
type Unpack<T> = T extends Promise<infer Res> ? Res : never;
type A3 = Unpack<Promise<number>>; // A is number

type Customer = {
  customerId: number;
  firstName: string;
  lastName: string;
};

type Flatten<T> = T extends Array<infer Vals> ? Vals : never;
type A2 = Flatten<Customer[]>; // A is Customer
type A = Parameters<typeof createUser>;

/*
In chapter 4 we learned that undefined and null 
are parts of every set in the type space, 
unless we set the flag strictNullChecks.
This removes undefined and null and treats them 
as their own entities. This prompts TypeScript to 
throw red squigglies at us the moment we forget
to handle nullish values.

This has a great effect for the code we write on our own. If we
use types as contracts to pass data across functions, we can be
sure that we have dealt with null and undefined already. The
bitter truth is that nullish values can and will happen, at least at
the point where our software has to work with external input:

1. an element from the DOM we want to select
2. user input from an input field
3. data we fetch asynchronously from a back end

Let’s look at a very simplified fetchOrderList function that
does roughly the same thing as the one earlier in this chap-
ter, but which is exclusively asynchronous.
*/

type Product = {
  productId: number;
  title: string;
  price: number;
};

type Order = {
  orderId: number;
  customer: Customer;
  products: Product[];
  date: Date;
};
declare function fetchOrderList(input: Customer | Product): Promise<Order[]>;

/* 
If we implement this function with fetch as we did in lesson
37, we see that we have a problem: fetch returns a promise of
any (the top type that covers everything and takes anything,
including null and undefined – and never , if we take the
possibility of an error into account).
This means that inside this function, we lose the information
if the return value is actually defined. We have to be more
specific about the set of possible return values, especially
since strictNullChecks says we don’t take nullish values
into our sets.

The real function head for fetchOrderList is much
more like this:
*/

declare function fetchOrderList(
  input: Customer | Product
): Promise<Order[] | null>;

/* 
This is good. We add nullish values back to our sets and are
explicit about it. This means that we are also forced to check if
values can be null. This makes our code much safer than before.

NonNullable
*/

declare function listOrders(arg: Order[] | null): void;

/* 
This ensures that the listOrders function is compatible
with the output from fetchOrderList . Null checks have
to be done inside listOrders . The other option is to make
sure that we never pass nullish values to listOrders . This
means that we have to do null checks before:
*/
declare function listOrders(arg: Order[]): void;

/* 
In any case, we will have to do a check for null . And most
likely not only for lists of orders, but also for lists of prod-
ucts, lists of customers, and so on. This calls for a generic
helper function, that checks if an object is actually available.
*/
declare function isAvailable<Obj>(obj: Obj): obj is NonNullable<Obj>;
/**
 * This generic function binds to the type variable Obj . So far,
Obj can be anything. We don’t have any type constraints
and don’t want any type constraints. isAvailable should
work with everything.

But the result should ensure we don’t have any nullish val-
ues. That’s why we use the built-in utility type NonNullable ,
which removes null and undefined from our set of values.
 */

//type NonNullable<T> = T extends null | undefined ? never : T;

/* 
NonNullable is a distributive conditional type. If we pass
a union where we explicitly set null or undefined , we can
make sure that we remove these value types again and con-
tinue with a narrowed down set. This is the implementation:
*/
function isAvaialble<Obj>(obj: Obj): obj is NonNullable<Obj> {
  return typeof obj !== undefined && obj !== null;
}
(async () => {
  const customer = null;
  // orders is Order[] | null
  const orders = await fetchOrderList(customer);
  if (isAvailable(orders)) {
    //orders is Order[]
    listOrders(orders);
  }
})();

/**
 * It’s recommended to consider nullish values early on. Keep
the core of your application null-free, and try to catch any
possible side effects as soon as possible. 

Low-Level Utilities

TypeScript’s built-in conditional types help a lot if you work
on very low-level utility functions that you can reuse in your application.

The same goes for our own utility types we declared in the previous lesson. 
fetchOrderList is very specific;
now think of a much more generic function and about some possible processes.
First, fetching from a database.
*/
type FetchDBKind = "orders" | "products" | "customers";
type FetchDBReturn<T> = T extends "orders"
  ? Order[]
  : T extends "products"
  ? Product[]
  : T extends "customers"
  ? Customer[]
  : never;
declare function fetchFromDatabase<Kin extends FetchDBKind>(
  kind: Kin
): Promise<FetchDBReturn<Kin> | null>;

/**
 * Processing anything that we fetched and making sure we
get the right process function for this.
 */
function process<T extends Promise<any>>(
  promise: T,
  cb: (res: Unpack<NonNullable<T>>) => void
): void {
  promise.then((res) => {
    if (isAvailable(res)) {
      cb(res);
    }
  });
}

/**
 * This allows us to safely listOrders to a function where the
results can be ambiguous.
 */
process(fetchFromDatabase("orders"), listOrders);

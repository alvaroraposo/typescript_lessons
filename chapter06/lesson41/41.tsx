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

/* 
We don’t want too much time spent on
type maintenance if we can create types dynamically from
other types. There are times, however, when we are not sure
how our model will look. Especially during development, 
things can change. Data can be added and removed, and
the overall shape of an object is in flux. This is OK. It’s the
flexibility JavaScript is known for!

Think of extending our e-commerce admin application
with a function that creates users who are allowed to read
and modify orders, products, and customers. The function
might look something like this:
*/

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

/*
The roles are divided between
• admin: allowed to read and modify everything.
• maintenance: allowed to modify products.
• shipping: allowed to read orders to get the necessary
info to dispatch them.
*/
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

/*
But this is just another mutation. Input types get more con-
crete, and the return type adapts to the changes. We would
always have to maintain a type User if we want to continue
to work with users in a type-safe environment.

Infer the Return Type

It would help a lot if we could name the type that gets re-
turned by createUser . TypeScript can infer types through
assignments. The variable’s type takes on the shape of
what’s returned by the function.
*/

// The type of user is the shape returned by createuser
const user = createUser2("Stefan", "shipping", true);

// We can put a name on this with the typeof operator:
/*
type User = {
userId: number,
name: string,
role: ‘admin’ | ‘maintenace’ | ‘shipping’,
isActive: boolean,
createdAt: Date
}
*/
type User = typeof user;

/*
This gets us the User type but at a very high price. We al-
ways have to call the function to obtain the shape of the re-
turn type.
What if this function call performs a critical data
mutation, in a database, for example? Are database transac-
tions justifiable only to retrieve the type of an object?

What we want is to retrieve the return type from the function
signature. For situations like that, TypeScript allows us to in-
fer type variables in the extends clause of a conditional type.
*/
type GetReturn<Fun> = Fun extends (...args: any[]) => any ? Fun : never;
/*
We combine all possible arguments into an argument tuple
(see rest parameters in lesson 37). We know that we have
any return type. If we pass our function, we get the type of
the function in return:
*/

type Fun = GetReturn<typeof createUser2>;
/*
Now we have the ability to infer types that are in this
extends clause. This happens with the infer keyword. We
can choose a type variable and return this type variable.
*/
type GetReturn2<Fun> = Fun extends (...args: any[]) => infer R ? R : never;

/*
With infer R we say that no matter the return type of this
function, we store it in the type variable R . If we have a valid
function, we return R as type.
*/
/*
type User = {
userId: number,
name: string,
role: ‘admin’ | ‘maintenance’ | ‘shipping’,
isActive: boolean,
createdAt: Date
}
*/
type User2 = GetReturn<typeof createUser2>;
/*
Zero maintenance; always correct types. This helper type is
available in TypeScript as ReturnType<Fun> .
*/

/*
Helper Types

Helper types like ReturnType are essential if we construct
functions and libraries where we care more about the behav-
ior and interconnection of parts rather than the actual types
themselves. Storing and retrieving objects from a database,
creating objects based on a schema, that kind of thing. With
the infer keyword we get powerful flexibility to get types
even when we don’t know yet what we are dealing with.

For example, a simple type that allows us to retrieve the
resolved value of a promise:
*/
type Unpack<T> = T extends Promise<infer Res> ? Res : never;
type A3 = Unpack<Promise<number>>; // A is number

/*
Or a type that flattens an array, so we get the type of the
array’s values.
*/
type Customer = {
  customerId: number;
  firstName: string;
  lastName: string;
};

type Flatten<T> = T extends Array<infer Vals> ? Vals : never;
type A2 = Flatten<Customer[]>; // A is Customer

/*
TypeScript has a couple more built-in conditional types that
use inference. One is Parameters , which collects all argu-
ments from a function in a tuple.

type Parameters<T> =
T extends (...args: infer Param) => any
? Param
: never
/* A is [
string,
“admin” | “maintenace” | “shipping”,
boolean
]
*/
type A = Parameters<typeof createUser>;

/*
Others are:

• InstanceType. Gets the type of the created instance of
the class’s constructor function.

• ThisParameterType. If you use callback functions that
bind this , you can get the bound type in return.

• OmitThisParameterType . Uses infer to return a func-
tion signature without the this type. This is handy if
your app doesn’t care about the bound this type and
needs to be more flexible in passing functions.

Types with the infer keyword have one thing in common:
they are low-level utility types that help you glue parts of
your code together with ease. This is behavior defined in a
type, and it allows for very generic scenarios where your code
has to be flexible enough to deal with unknown expectations.
*/

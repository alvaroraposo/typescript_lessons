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

/*
Now we want to focus on the missing information. 
Remember, we want to add everything that’s necessary to create a full medium, 
except for id, which is autogenerated by createMedium, or kind, which we already defined.

Exclude
This means we need to pass objects that look like this:
*/
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

/*
But we don’t want those types to be maintained – we want to have them autogenerated.

The first thing we want to take care of is knowing which
keys of our object we actually need. The best way to do this
is by knowing which keys we don’t need: kind and id .
*/
type Removable = "kind" | "id";

/*
Good. Now we need to filter all property keys that are not in
this set of keys. For that, we create another distributive con-
ditional type. It looks very similar to Extract , but resolves
differently.
*/
type Remove<A, B> = A extends B ? never : A;

/* 
It reads that if the type A is part of B , remove it ( never ); otherwise keep it. 
Let’s see what happens if we use all keys of CD and distribute the union over the Remove type. 
Remember, a conditional of a union is like a union of conditionals.
*/
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

/*
Wow, what a process! But we get one step closer to the result we expect. 
The Remove type is built-in to TypeScript and called Exclude. 
The definition is exactly the same, and it’s description says that it excludes 
types from A which are in B. This is what just happened.

Omit

We now have to take this new set of keys – a subset of the
original set of keys – and create an object type with the new
keys, which need to be of the type of the original object.

This sounds a lot like a mapped type, doesn’t it? Remember
Pick ? Pick runs over a set of keys and selects the type from the
original property type. This is exactly what we’re looking for.
*/
type CDInfo2 = Pick<CD, Exclude<keyof CD, "kind" | "id">>;

/* 
How do we read this new type? We pick from CD all keys of CD,
but exclude kind and id.
The result is the type we originally envisioned. 
Once again, generic types behave like functions. 
They have parameters and an output, and are composable.

Reading this type might feel like a little tongue twister.
That’s why TypeScript has a built-in type for exactly this
combination of Pick and Exclude , called Omit .
*/

type CDInfo3 = Omit<CD, "kind" | "id">;

/* 
We’ve come a long way with our types. The last step is to
compose everything in our createMedium function. To suc-
cessfully omit kind and id from our medium types, we need
to pass the selected branch to Omit . Another helper type
makes this a bit more readable.
*/
type RemovableKeys = "kind" | "id";
type GetInfo<Med> = Omit<Med, RemovableKeys>;
declare function createMedium<Kin extends MediaKinds>(
  kind: Kin,
  info: GetInfo<SelectBranch<AllMedia, Kin>>
): SelectBranch<AllMedia, Kin>;

/*
And that’s it! Now TypeScript prompts us only for the prop-
erties that are missing. We don’t have to specify redundant
information, and we get autocomplete and type safety when
using our createMedium function.

A Set of Helper Types

Being able to compose generics and distributive conditional
types allows for a set of smaller, single-purpose helper types
that can be assembled for different scenarios. This allows
us to define type behavior without maintaining too many
types. Focus on the model, describe behavior with helpers.
*/
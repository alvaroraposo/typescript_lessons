// Pick <O, K> creates a new object with selected property keys K of object O . It is defined as
type MyPick<O, K extends keyof O> = {
  [P in K]: O[P];
};

/**
 * [P in K] runs over all value types in the union K , which is
 * all keys of O.O[P] is an indexed access type.
 * It’s like indexing an object, but retrieving a type.
 * This allows us to define a union of keys that are part of
 * an original object type, and select those keys
 * and their types from the original object.
 *
 * For example, this would be a type with all HD videos
 */
type VideoFormatURLs = {
  format360p: URL;
  format480p: URL;
  format720p: URL;
  format1080p: URL;
};

type HD1 = Pick<VideoFormatURLs, "format1080p" | "format720p">;
// Equivalent to
type HD2 = {
  format1080p: URL;
  format720p: URL;
};

/**
 * Record<K, T> creates an object type where all types in T get
 * the type K . Like a dictionary.
 */
type MyRecord<K extends string | number | symbol, T> = {
  [P in K]: T;
};

// Note that K is a subtype of string | number | symbol .
// URLObject from the previous lesson would be defined as
type URLObject = Record<string, URL>;

/**
 * Let’s say that our video platform, while allowing for all four
 * kinds of video resolution to be uploaded, doesn’t require all
 * four of them. We require at least one format.
 *
 * Modeling this situation is easily done with union types:
 */
type Format360 = {
  format360p: URL;
};
type Format480 = {
  format480p: URL;
};
type Format720 = {
  format720p: URL;
};
type Format1080 = {
  format1080p: URL;
};
type AvailableFormats = Format360 | Format480 | Format720 | Format1080;

const hq: AvailableFormats = {
  format720p: new URL("..."),
  format1080p: new URL("..."),
}; // OK!
const lofi: AvailableFormats = {
  format360p: new URL("..."),
  format480p: new URL("..."),
}; // OK!

/**
 * We don’t want to redefine VideoFormatURLs ,
 * as the type is necessary for certain functionality in our app.
 * We just want to have VideoFormatURLs but split into unions.
 * Let’s build a helper, called Split .
 *
 * The goal is to create a union type. To make it easier, we start
 * with a concrete type and work with the substitution later.
 * So what do we already know?
 *
 * First, we know keyof VideoFormatURLs creates a union of
 * all keys of VideoFormatURLs .
 */
type Split = keyof VideoFormatURLs;
// Equivalent to
type Split2 = "format360p" | "format480p" | "format720p" | "format1080";

// We also know that a mapped type runs over all keys and creates a new object with those keys.
type Split3 = {
  [P in keyof VideoFormatURLs]: P;
};
// Equivalent to
type Split4 = {
  format360p: "format360p";
  format480p: "format480p";
  format720p: "format720p";
  format1080p: "format1080p";
};

/**
 * Now we can access the values of this type again by using the indexed access operator.
 * If we access by the union of keys of VideoFormatURLs , we get a union of the values.
 */
type Split5 = {
  [P in keyof VideoFormatURLs]: P;
}[keyof VideoFormatURLs];
// Equivalent to
type Split6 = "format360p" | "format480p" | "format720p" | "format1080p";

/**
 * This looks exactly like the first step, but it’s fundamentally different.
 * Instead of getting the left side of an object type – the property keys – in union,
 * we get the right side of an object type – the property types – in union.
 *
 * So the only thing we have to do is to get the values right,
 * and we have the union we envisioned. Enter Record.
 * A Record<P, VideoFormatURLs[P] gives us
 * an object with the property P we get from the key union,
 * and we’re accessing the corresponding type from the property key.
 */
type Split7 = {
  [P in keyof VideoFormatURLs]: Record<P, VideoFormatURLs[P]>;
}[keyof VideoFormatURLs];
// Equivalent to
type Split8 =
  | Record<"format360p", URL>
  | Record<"format480p", URL>
  | Record<"format720p", URL>
  | Record<"format1080p", URL>;

// Equivalent to
type Split9 =
  | { format360p: URL }
  | { format480p: URL }
  | { format720p: URL }
  | { format1080p: URL };

// Last, but not least, let’s build a generic out of it.
type Split10<Obj> = {
  [P in keyof Obj]: Record<P, Obj[P]>;
}[keyof Obj];
type AvailableFormats2 = Split10<VideoFormatURLs>;

/**
 * The moment we change something in VideoFormatURLs ,
 * we update AvailableFormats as well. And TypeScript yells at
 * us with wonderful red squigglies if we have set a property
 * that doesn’t exist anymore.
 */

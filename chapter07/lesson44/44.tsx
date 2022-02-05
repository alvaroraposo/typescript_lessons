/**
 *  • mapped types
    • conditional types
    • the infer keyword
    • recursive types
 */

class Serializer<T> {
  serialize(inp: T): string {
    return JSON.stringify(inp);
  }
  deserialize(inp: string): JSONified<T> {
    return JSON.parse(inp);
  }
}
/**
     * With JSONified to be defined. Let’s declare a type that in-
cludes all possible ways of writing values in JavaScript: num-
bers, strings, Booleans, functions. Nested and in arrays. And
a type that has a toJSON function. If an object has a toJSON
function, JSON.stringify will use the object returned from
toJSON for serialization and not the actual properties.
     * 
     */

// toJSON returns this object for
// serialization, no matter which other
// properties this type has.
type Widget = {
  toJSON(): {
    kind: "Widget";
    date: Date;
  };
};

type Item = {
  // Regular primitive types
  text: string;
  count: number;
  // Options get preserved
  choice: "yes" | "no" | null;
  // Functions get dropped.
  func: () => void;
  // Nested elements need to be parsed
  // as well
  nested: {
    isSaved: boolean;
    data?: [1, 3, 2];
  };
  // A pointer to another type
  widget?: Widget;
  // The same object referenced again
  children?: Item[];
};

/**
 * There is a difference between JSON and JavaScript objects,
and we can model this difference with just a few lines of
conditional types. Let’s implement JSONified<T> .

First, we create the JSONified type and do one particular
check: is this an object with a toJSON function? If so, we
infer the return type and use it. Otherwise we JSONify the
object itself. toJSON also returns an object, so we pass it to
our next step as well.
 */
type JSONified<T> = JSONifiedValue<T extends { toJSON(): infer U } ? U : T>;

/* 
Next, let’s look at the actual values, and what happens once
we serialize them. Primitive types can be transferred easily.
Functions should be dropped. Arrays and nested objects
should be handled separately.
*/
type JSONifiedValue<T> = T extends string | number | boolean | null
  ? T
  : T extends Function
  ? never
  : T extends object
  ? JSONifiedObject<T>
  : T extends Array<infer U>
  ? JSONifiedArray<U>
  : never;

/* 
  JSONifiedObject is a mapped type where we run through
all properties and apply JSONified again.
  */
type JSONifiedObject<T> = {
  [P in keyof T]: JSONified<T[P]>;
};

/* 
This is the first occurence in this book of a recursive type.
TypeScript allows for a certain level of recursion as long as
there’s no circular referencing involved. Calling JSONified
again further down a tree works.

It’s similar with the JSONifiedArray , which becomes an
array of JSONified values. If there’s an undefined element,
JSON.stringify will map this to null . That’s why we need
another helper type.
*/

type UndefinedAsNull<T> = T extends undefined ? null : T;
type JSONifiedArray<T> = Array<UndefinedAsNull<JSONified<T>>>;

/*
And this is all we need. With a couple lines of code, we
described the entire behavior of a JSON.parse after a JSON.
stringify . Not only on a type level, but also wrapped nicely
in a class:
*/
const anItem = {
  // Regular primitive types
  text: "texto",
  count: 123,
  // Options get preserved
  choice: null,
  // Functions get dropped.
  func: () => new Object(),
  // Nested elements need to be parsed
  // as well
  nested: {
    isSaved: false,
  },
};
const itemSerializer = new Serializer<Item>();
const serialization = itemSerializer.serialize(anItem);
const obj = itemSerializer.deserialize(serialization);

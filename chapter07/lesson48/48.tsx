/*
TypeScript’s control flow analysis lets you narrow down
from a broader type to a narrower type:
*/
function print(msg: any) {
  if (typeof msg === "string") {
    // We know msg is a string
    console.log(msg.toUpperCase()); // thumbs up!
  } else if (typeof msg === "number") {
    // I know msg is a number
    console.log(msg.toFixed(2)); // thumbs up!
  }
}

/*
This is a type-safety check in JavaScript, and TypeScript
benefits from that. However, there are some cases where
TypeScript needs a little bit more assistance from us.

Checking Object Properties

Let’s assume you have a JavaScript object and you don’t know if
a certain property exists. The object might be any or unknown .
In JavaScript, you would check for properties like this:
*/
function test(obj: any) {
  if (typeof obj === "object" && "prop" in obj) {
    // It's safe to access obj.prop
    console.assert(typeof obj.prop !== "undefined");
    // But TS doesn't know :-(
  }
  if (typeof obj === "object" && obj.hasOwnProperty("prop")) {
    // It's safe to access obj.prop
    console.assert(typeof obj.prop !== "undefined");
    // But TS doesn't know :-(
  }
}

/*
Let’s check out what’s happening:
1. Our hasOwnProperty function has two generics:
    a. X extends {} makes sure we use this method
    only on objects.
    b. Y extends PropertyKey makes sure that the key
    is either string | number | symbol . Property
    Key is a built-in type.

2. There’s no need to explicitly define the generics as
they’re inferred by usage.

3. (obj: X, prop: Y) : we want to check if prop is a property key of obj.

4. The return type is a type predicate. If the method returns
true , we can retype any of our parameters. In this case,
we say our obj is the original object, with an intersec-
tion type of Record<Y, unknown> . The last piece adds
the newly found property to obj and sets it to unknown .

Extending lib.d.ts

Writing a helper function is a bit on the nose. Why write
a helper function that wraps some baked-in functionality
only to get better types? We should be able to create those
typings directly where they occur.

Thankfully, with declaration merging of interfaces, we
are able to do that. Create your own ambient type decla-
ration file and make sure that the TypeScript compiler
knows where to find them ( typeRoots and types in
tsconfig.json are a good start).

In this file, which we can call mylib.d.ts, we can
add our own ambient declarations, and can extend
existing declarations.

We can do so with the Object interface. This is a built-in
interface for all Object s.
*/
interface Object {
  hasOwnProperty<X extends {}, Y extends PropertyKey>(
    this: X,
    prop: Y
  ): this is X & Record<Y, unknown>;
}

/*
If you think TypeScript ought to have something like that
out of the box, then you are right. There might be a good
reason type definitions aren’t yet shipped like that, but it’s
good that we are able to extend it to meet our own needs.

Extending the Object Constructor

We get into a similar scenario when working with other
parts of Object . One pattern that you might encounter a lot
is to iterate over an array of object keys, then access these
properties to do something with the values.
*/
const obj = {
  name: "Stefan",
  age: 38,
};
Object.keys(obj).map((key) => {
  console.log(obj[key]);
});

/*
In strict mode, TypeScript wants to know explicitly what
type key has, to be sure that this index access works. So we
get some red squigglies thrown at us. Well, we should know
the type of key it is! It’s keyof obj ! This is a good chance to
extend the typings for Object.

This is how Object.keys should behave:
1. If we pass a number, we return an empty array.
2. If we pass an array or a string, we get a string array in
return. This string array contains the stringified indi-
ces of the input value.
3. If we pass an object, we get the actual keys of this
object in return.

The interface to extend is called ObjectConstructor .
For classes or class-like structures, TypeScript needs two
different interfaces. One is the constructor interface, which
includes the constructor function and all the static informa-
tion. The other is the instance interface, which includes all the
dynamic information per instance.

This divide comes from old JavaScript, when classes were
defined as constructor function and prototype, for example:


// Static parts --> constructor interface
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.create(name, age) {
return new Person(name, age)
}
// Dynamic parts --> instance interface
Person.prototype.toString() {
return `My name is ${this.name} and I'm
${age} years old`
}

In our case, Object is the instance interface and Object
Constructor is the constructor interface. Let’s make
Object.keys stronger:
*/
// A utility type
type ReturnKeys<O> = O extends number
  ? []
  : O extends Array<any> | string
  ? string[]
  : O extends object
  ? Array<keyof O>
  : never;
// Extending the interface
interface ObjectConstructor {
  keys<O>(obj: O): ReturnKeys<O>;
}

/*
Let’s put this into our ambient type declaration file and
Object.keys will get better type inference immediately.
*/

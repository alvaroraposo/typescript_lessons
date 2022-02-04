// import { promisify } from "util";
// e.g. a function that loads a file into a string
declare function loadFile(fileName: string, cb: (result: string) => void);
// We want to promisify this function
//const loadFilePromise = promisify(loadFile);

// The promised function takes all arguments
// except the last one and returns a promise
// with the result

// which is a string according to loadFile
// loadFilePromise("./chapter7.md")
//   .then((result) => result.toUpperCase());

/*
  The output is a promisified function, 
  which means a function that takes a number 
  of arguments and returns a promise.
  */

/*
declare function promisify<Fun extends FunctionWithCallback>(
  fun: Fun
): PromisifiedFunction<Fun>; */

/* 
Now, let’s model our newly created types. Function
WithCallback is somehow peculiar, as it needs to work for
a potentially endless list of arguments before we reach the
last one, the callback.
One way to achieve that would be a list of function over-
loads, where we make sure the last argument is a callback.
But this method has to end somewhere. The following
example stops at three overloads:

type FunctionWithCallback =
  | ((arg1: any, cb: (result: any) => any) => any)
  | ((arg1: any, arg2: any, cb: (result: any) => any) => any)
  | ((arg1: any, arg2: any, arg3: any, cb: (result: any) => any) => any);
*/

/* 
  A much more flexible solution is a variadic tuple type. A tuple
type in TypeScript is an array with the following features.
1. The length of the array is defined.
2. The type of each element is known (and does not have
to be the same).
  */
type PersonProps = [string, number];
const [name, age]: PersonProps = ["Stefan", 37];
/* 
Function arguments can also be described as tuple types.
For example:
*/
declare function hello(name: string, msg: string): void;
declare function hello(...args: [string, string]): void;
/* 
A variadic tuple type is a tuple type that has the same
properties – defined length and the type of each element is
known – but where the exact shape is yet to be defined.

This is a perfect use case for our callback-style function.
The last argument has to be a callback function; everything
before is yet to be defined. So FunctionWithCallback can
look like this:
*/
type FunctionWithCallback<T extends any[] = any[]> = (
  ...t: [...T, (...args: any) => any]
) => any;

/* 
First, we define a generic. We need generics to define vari-
adic tuple types as we have to define the shape later on. This
generic type parameter extends the any[] array to catch
all tuples. We also default to any[] to make it easier to use.
Then comes a function definition.

The argument list is of type [...T, (...args: any) =>
any]) . First the variadic part that we define through usage,
then a wildcard function. This ensures we only pass func-
tions that have a callback as the last argument.

Note that we explicitly use any here. This is one of the rare
use cases where any makes a lot of sense. We’re not con-
cerned yet about what we’re passing as a function as long
as the shape is intact. We also don’t want to be bothered by
passing arguments around. This is a helper function and
any will do just fine.

Next, let’s work on the return type, a promisified function.
The promisified function is a conditional type that checks
the shape we defined in FunctionWithCallback . This is
where the actual type check happens, and where we bind
types to generics.
*/
type PromisifiedFunction<T> = (
  ...args: InferArguments<T>
) => Promise<InferResults<T>>;

type InferArguments<T> = T extends (
  ...t: [...infer R, (...args: any) => any]
) => any
  ? R
  : never;

type InferResults<T> = T extends (
  ...t: [...infer T, (res: infer R) => any]
) => any
  ? R
  : never;

/* 
  The function type we check for in our conditional is again
of a very similar shape to FunctionWithCallback . This
time, however, we want to know the argument list of the
callback and infer those.
This already works like a charm. loadFile gets the correct
types and also functions with other types, and other argu-
ment lists do the same.
  */

declare function addAsync(x: number, y: number, cb: (result: number) => void);
const addProm = promisify(addAsync);
// x is number!
addProm(1, 2).then((x) => x);

/* 
The types are done! We can test how this function will
behave once it’s finished. And this is all we need to do on the
TypeScript side. A couple of lines of code and we know the
input and the output behavior of our function.

As this is a utility function, we will most likely use
promisify more than once. Time on typings well spent.

The implementation also takes a couple of lines of code:
*/
function promisify<Fun extends FunctionWithCallback>(
  f: Fun
): PromisifiedFunction<Fun> {
  return function (...args: InferArguments<Fun>) {
    return new Promise((resolve) => {
      function callback(result: InferResults<Fun>) {
        resolve(result);
      }
      args.push(callback);
      f.call(null, ...args);
    });
  };
}

/* 
Here we can see some behavior mirrored in JavaScript that we
already saw in TypeScript. We use rest parameters – of type
InferArguments – in the newly created function. This returns
a promise with a result of type InferResults. 

To get this, we need to create the callback, 
let it resolve the promise with the results and add it back 
to the argument lists. Now we can call
the original function with a complete set of arguments.

This is the inverse operation of what we did with our types,
where we always tried to shave off the callback function. Here
we need to add it again to make it complete. The types are com-
plex, but so sound we can implement the whole promisify
function without any type cast. This is a good sign!
*/

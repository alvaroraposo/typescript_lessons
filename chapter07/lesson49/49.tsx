/*
In JavaScript we can define object properties on the fly with
Object.defineProperty . This is useful if we want your
properties to be read-only or similar. Think back to the very
first example in this book: a storage object that has a maxi-
mum value that shouldn’t be overwritten:
*/
const storageOld = {
  currentValue: 0,
};
Object.defineProperty(storageOld, "maxValue", {
  value: 9001,
  writable: false,
});

console.log(storageOld.maxValue); // 9001
storageOld.maxValue = 2; // read-only

console.log(storageOld.maxValue); // Still 9001

/*
DefineProperty and property descriptors are very complex.
They allow us to do everything with properties that is usually
reserved for built-in objects. So they’re common in larger code-
bases. TypeScript has a little problem with defineProperty :

If we don’t explicitly type cast, we don’t get maxValue
attached to the type of storage . However, for simple use
cases, we can help!

Assertion Signatures

In TypeScript 3.7 the team introduced assertion signatures.
Think of an assertIsNum function where we can make sure
some value is of type number , and otherwise it throws an
error. This is similar to the assert function in Node.js:
*/
function assertIsNumOld(val: any) {
  if (typeof val !== "number") {
    throw new AssertionError("Not a number!");
  }
}
function multiplyOld(x, y) {
  assertIsNum(x);
  assertIsNum(y);
  // At this point I'm sure x and y are numbers.
  // If one assert condition is not true, this
  // position is never reached.
  return x * y;
}
/*
To comply with behavior like this, we can add an assertion
signature that tells TypeScript that we know more about the
type after this function:
*/
function assertIsNum(val: any): asserts val is number {
  if (typeof val !== "number") {
    throw new AssertionError("Not a number!");
  }
}

/*
This works a lot like type predicates, but without the control
flow of a condition-based structure like if or switch .
*/
function multiply(x, y) {
  assertIsNum(x);
  assertIsNum(y);
  // Now also TypeScript knows that both x and y are numbers;
  return x * y;
}
/*
If we look at it closely, we can see those assertion signatures
can change the type of a parameter or variable on the fly.
This is just what Object.defineProperty does as well.

Custom defineProperty

Disclaimer: The following helper does not aim to be 100%
accurate or complete. It might have errors, and it might not
tackle every edge case of the defineProperty specification.
It might, however, handle a lot of use cases well enough. So
use it at your own risk!
Just as with hasOwnProperty in the last lesson, we create a
helper function that mimics the original function signature:

*/
function defineProperty<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor
>(obj: Obj, prop: Key, val: PDesc) {
  Object.defineProperty(obj, prop, val);
}

/*
We work with three generics:
1. The object we want to modify, of type Obj , which is a
subtype of object .
2. Type Key , which is a subtype of PropertyKey (built-in),
so string | number | symbol .
3. PDesc , a subtype of PropertyDescriptor (built-in).
This allows us to define the property with all its fea-
tures (writability, enumerability, reconfigurability).

We use generics because TypeScript can narrow them down
to a very specific unit type. PropertyKey , for example, is
all numbers, strings, and symbols. But if we use Key
extends PropertyKey , we can pinpoint prop to be of (for
instance) type "maxValue" . This is helpful if we want to
change the original type by adding more properties.

The Object.defineProperty function either changes the
object or throws an error should something go wrong.

Exactly what an assertion function does. Our custom helper
defineProperty thus does the same.
Let’s add an assertion signature. Once defineProperty
successfully executes, our object has another property. We’ll
create some helper types for that. The signature first:
*/
function definePropertyOld<
  Obj extends object,
  Key extends PropertyKey,
  PDesc extends PropertyDescriptor
>(
  obj: Obj,
  prop: Key,
  val: PDesc
): asserts obj is Obj & DefineProperty<Key, PDesc> {
  Object.defineProperty(obj, prop, val);
}
/*
obj then is of type Obj (narrowed down through a generic)
and our newly defined property.
This is the DefineProperty helper type:
*/
type DefinePropertyOld<
  Prop extends PropertyKey,
  Desc extends PropertyDescriptor
> = Desc extends {
  writable: any;
  set(val: any): any;
}
  ? never
  : Desc extends {
      writable: any;
      get(): any;
    }
  ? never
  : Desc extends {
      writable: false;
    }
  ? Readonly<InferValue<Prop, Desc>>
  : Desc extends {
      writable: true;
    }
  ? InferValue<Prop, Desc>
  : Readonly<InferValue<Prop, Desc>>;

/*
  First, we deal with the writeable property of a Property
Descriptor . It’s a set of conditions to define some edge
cases and conditions of how the original property
descriptors work:

1. If we set writable and any property accessor ( get ,
set ), we fail. never tells us that an error was thrown.
2. If we set writable to false , the property is read-
only. We defer to the InferValue helper type.
3. If we set writable to true , the property is not read-
only. We defer as well.
4. The last, default case is the same as writeable: false ,
so Readonly<InferValue<Prop, Desc>> . ( Readonly
<T> is built-in.)

This is the InferValue helper type, dealing with the set
value property:
  */
type InferValueOld<Prop extends PropertyKey, Desc> = Desc extends {
  get(): any;
  value: any;
}
  ? never
  : Desc extends { value: infer T }
  ? Record<Prop, T>
  : Desc extends { get(): infer T }
  ? Record<Prop, T>
  : never;

/*
  Again a set of conditions:
1. If we have a getter and a value set, Object.define
Property throws an error, so never .
2. If we have set a value, let’s infer the type of this value
and create an object with our defined property key and
the value type.
3. Or we infer the type from the return type of a getter.
4. Anything else we forgot. TypeScript won’t let us work
with the object as it’s becoming never .

Moving It to the Object Constructor

This already works wonderfully in your code, but if you
want to make use of that throughout the whole application,
we should put this type declaration in ObjectConstructor .
Let’s move our helpers to mylib.d.ts and change the
ObjectConstructor interface:
  */

type InferValue<Prop extends PropertyKey, Desc> = Desc extends {
  get(): any;
  value: any;
}
  ? never
  : Desc extends { value: infer T }
  ? Record<Prop, T>
  : Desc extends { get(): infer T }
  ? Record<Prop, T>
  : never;
type DefineProperty<
  Prop extends PropertyKey,
  Desc extends PropertyDescriptor
> = Desc extends {
  writable: any;
  set(val: any): any;
}
  ? never
  : Desc extends {
      writable: any;
      get(): any;
    }
  ? never
  : Desc extends {
      writable: false;
    }
  ? Readonly<InferValue<Prop, Desc>>
  : Desc extends {
      writable: true;
    }
  ? InferValue<Prop, Desc>
  : Readonly<InferValue<Prop, Desc>>;
interface ObjectConstructor {
  defineProperty<
    Obj extends object,
    Key extends PropertyKey,
    PDesc extends PropertyDescriptor
  >(
    obj: Obj,
    prop: Key,
    val: PDesc
  ): asserts obj is Obj & DefineProperty<Key, PDesc>;
}

/*
Thanks to declaration merging and function overloading,
we attach this much more concrete version of define
Property to Object . In use, TypeScript aims for the most
correct version when selecting an overload. So we always
end up with the one overload where we bind generics
through inference. Let’s see what TypeScript does:
*/
const storage = {
  currentValue: 0,
};
Object.defineProperty(storage, "maxValue", {
  writable: false,
  value: 9001,
});
storage.maxValue; // It's a number
storage.maxValue = 2; // Error! It's read-only
const storageName = "My Storage";
defineProperty(storage, "name", {
  get() {
    return storageName;
  },
});
storage.name; // It's a string!
// It's not possible to assign a value and a getter
Object.defineProperty(storage, "broken", {
  get() {
    return storageName;
  },
  value: 4000,
});
// Storage is never because we have a malicious
// property descriptor
storage;
/*
We already have some great additions to regular typings
that we can reuse in all our applications. Take care of this
file and make it part of your standard setup.
*/

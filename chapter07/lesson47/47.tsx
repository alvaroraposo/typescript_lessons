function factory(element, properties, ...children) {
  //...
}

function OldDOMcreateElement(element, properties, ...children) {
  if (typeof element === "function") {
    return element({
      ...nonNull(properties, {}),
      children,
    });
  }
  return DOMparseNode(element, properties, children);
}

function oldNonNull(val, fallback) {
  return Boolean(val) ? val : fallback;
}

function OldDOMparseNode(element, properties, children) {
  const el = Object.assign(document.createElement(element), properties);
  DOMparseChildren(children).forEach((child) => {
    el.appendChild(child);
  });
  return el;
}

function OldDOMparseChildren(children) {
  return children.map((child) => {
    if (typeof child === "string") {
      return document.createTextNode(child);
    }
    return child;
  });
}

const Button = ({ msg }) => {
  return (
    <>
      <button onclick={() => alert(msg)}></button>
      <strong>Click me</strong>
    </>
  );
};

const el = (
  <div>
    <h1 className="what">Hello world</h1>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae sed
      consectetur placeat veritatis illo vitae quos aut unde doloribus, minima
      eveniet et eius voluptatibus minus aperiam sequi asperiores, odio ad?
    </p>
    <Button msg="Yay" />
    <Button msg="Nay" />
  </div>
);
document.body.appendChild(el);

/*
In this lesson we’ll see:
• type maps
• mapped types
• conditional types
• declaration merging
• the JSX namespace

What we created in the previous lesson is already very pow-
erful. We can go really far and have a nice API to write to the
DOM without any library or framework!

But we TypeScript folks miss one important thing:
proper typings. Type inference does a lot for us, but
with noImplicitAny turned off, we miss a lot of
important information.

Turning it back on, we see red squigglies everywhere.
Let’s be true to ourselves and create proper typings for
our functions. As an added benefit, we also get a really
good type inference!

Typing the Factory

Let’s start with the three functions that we have. TypeScript
at this point really complains mostly about implicit any s. So
we’d better throw in some concrete types.

The nonNull helper function is easy to type. We take two
generics we can bind as we use the function.

The return type is inferred as T | U .
*/
function nonNull<T, U>(val: T, fallback: U) {
  return Boolean(val) ? val : fallback;
}

/*
Next, we work on DOMparseChildren as it has the simplest
set of arguments. There are just a few types that can actual-
ly be children of our DOM tree:

1. HTMLElement , the base class of all HTML elements.
2. string , if we pass a regular string that should be con-
verted into a text node.
3. Text , if we created a text node outside that we
want to append.

We create a helper union, PossibleChildren , and use this
for the argument of DOMparseChildren .

The return type is correctly inferred as HTMLElement |
Text , as we get rid of string and convert them to Text .
*/
type PossibleChildren = HTMLElement | Text | string;
function DOMparseChildren(children: PossibleChildren[]) {
  return children.map((child) => {
    if (typeof child === "string") {
      return document.createTextNode(child);
    }
    return child;
  });
}

/*
The next function is DOMparseNode , as it has the same
signature as DOMcreateElement . Let’s look at the possible
input arguments.

1. element can be a string or a function. We want to
use a generic to bind the concrete value of an element
to a type.
2. properties can be either the function arguments of
the component function or the set of properties of the
respective HTML element.
3. children is a set of possible children. We have the type
for this already.

To make this work properly, we need a couple of helper
types. Fun is a much looser interpretation of Function . We
need this to infer parameters.
*/
type Fun = (...args: any[]) => any;

/*
We need to know which HTML element is created when we
pass a certain string. TypeScript provides an interface called
HTMLElementTagNameMap . It’s a so-called type map, which
means that it is a key–value list of identifiers (tags) and
their respective types (subtypes of HTMLElement ). You can
find this list in lib.dom.ts.
*/
interface HTMLElementTagNameMap {
  a: HTMLAnchorElement;
  abbr: HTMLElement;
  address: HTMLElement;
  //  applet: HTMLAppletElement;
  // and so on ...
}

/*
We want to create a type, CreatedElement , that returns the
element according to the string we pass. If this element
doesn’t exist, we return HTMLElement , the base type.
*/
type AllElementsKeys = keyof HTMLElementTagNameMap;
type CreatedElement<T> = T extends AllElementsKeys
  ? HTMLElementTagNameMap[T]
  : HTMLElement;

/*
We use this helper type to properly define Props. If we pass
a function, we want to get parameters of this function. If we
pass a string, possible properties are a partial of the corre-
sponding HTML element. Without the partial, we would
have to define all properties. And there are a lot!
*/
type Props<T> = T extends Fun
  ? Parameters<T>[0]
  : T extends string
  ? Partial<CreatedElement<T>>
  : never;
/*
Note that we index the first parameter of Parameters . This is
because the JSX function only has one argument, the props.
And we need to destructure from a tuple to an actual type.
*/
function DOMparseNode<T extends string>(
  element: T,
  properties: Props<T>,
  children: PossibleElements[]
) {
  const el = Object.assign(document.createElement(element), properties);
  DOMparseChildren(children).forEach((child) => {
    el.appendChild(child);
  });
  return el;
}

/*
The DOMcreateElement function. This one can be a bit tricky 
as separating between function properties and HTML element 
properties is not as easy as it looks at first. 
Our best option is function overloads as we only have two variants. 
Also, the Props type helps us make the correct connection 
between the type of element and the respective properties.
*/
function DOMcreateElement<T extends string>(
  element: T,
  properties: Props<T>,
  ...children: PossibleElements[]
): HTMLElement;

function DOMcreateElement<F extends Fun>(
  element: F,
  properties: Props<F>,
  ...children: PossibleElements[]
): HTMLElement;

function DOMcreateElement(
  element: any,
  properties: any,
  ...children: PossibleElements[]
): HTMLElement {
  if (typeof element === "function") {
    return element({
      ...nonNull(properties, {}),
      children,
    });
  }
  return DOMparseNode(element, properties, children);
}

/*
Typing JSX

We still get some type errors when using JSX instead of
factory functions. This is because TypeScript has its own
JSX parser and wants to catch JSX problems early on. Right
now, TypeScript doesn’t know which elements to expect.
Therefore, it defaults to any for every element.

To change this, we have to extend TypeScript’s own JSX name-
space and define the return type of created elements. Name-
spaces are a way in TypeScript to organize code. They were
created in a time before ECMAScript modules and are therefore
not used as much anymore.

Still, when defining internal interfaces that should be grouped,
namespaces are the way to go.

As with interfaces, namespaces allow for declaration merg-
ing. We open the namespaces JSX and define two things:

1. The return element, which is extending the interface Element.

2. All available HTML elements, so TypeScript can give
us autocompletion in JSX. They are defined in
IntrinsicElements . We use a mapped type where
we copy HTMLElementTagNameMap to be a map of par-
tials. Then we extend IntrinsicElements from it.
We want to use an interface instead of a type as we
want to keep declaration merging open.
*/

// Open the namespace
declare namespace JSX {
  // Our helper type, a mapped type
  type OurIntrinsicElements = {
    [P in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[P]>;
  };
  // Keep it open for declaration merging
  interface IntrinsicElements extends OurIntrinsicElements {}
  // JSX returns HTML elements. Keep this also
  // open for declaration merging
  interface Element extends HTMLElement {}
}

/*
With that, we get autocompletion for HTML elements and
function components. And our little TypeScript-based DOM
JSX engine is ready for prime time!
*/

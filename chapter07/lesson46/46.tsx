/* 
JSX

<Button onClick={() => alert('YES')}><span>Click me</
span></Button>

which translates to:

React.createElement(Button, { onClick: () =>
alert('YES') },
React.createElement('span', {}, 'Click me'));

What are the implications, especially compared with templates?

• There’s no runtime compilation and parsing of tem-
plates. Everything goes directly to the virtual DOM or
layout engine underneath.
• There are no expressions to evaluate. Everything
around is JavaScript.
• Every component property is translatable to a JSX
object key. This allows us to type check them.

TypeScript works so well with JSX because there’s
JavaScript underneath.

So everything looks like XML, except that it’s
JavaScript functions.

Writing the DOM with JSX

With TypeScript we have the possibility to change the JSX
factory. That’s how TypeScript is able to compile JSX for
React, Vue.js, Dojo…
*/

/**
 * element: string or component
 * properties: object or null
 * ...children: null or calls to the factory
 */
function factory(element, properties, ...children) {
  //...
}

/* 
Let’s try! These are the features we want to implement:
1. Parse JSX to DOM nodes, including attributes.
2. Have simple functional components for more compos-
ability and flexibility.

TypeScript needs to know how to compile JSX for us. Set-
ting two properties in tsconfig.json is all we need.
*/

/*
tsconfig.json


{
    “compilerOptions”: {
    ...
    “jsx”: "react",
    “jsxFactory”: "DOMcreateElement",
    “noImplicitAny”: false
}

We leave it to the React JSX pattern (the method signature
we were talking about earlier), but tell TypeScript to use our
soon-to-be-created function DOMcreateElement for that.

Also, we set noImplicitAny to false for now. This is so we
can focus on the implementation and do proper typings at a
later stage. If we want to use JSX, we have to rename our .ts
files to .tsx.

First, we implement our factory function. Its specification:

1. If the element is a function, then it’s a functional com-
ponent. We call this function (passing properties and
children , of course) and return the result. We expect a
return value of type Node .

2. If the element is a string, we parse a regular node.
*/
function DOMcreateElement(element, properties, ...children) {
  if (typeof element === "function") {
    return element({
      ...nonNull(properties, {}),
      children,
    });
  }
  return DOMparseNode(element, properties, children);
}
/**
* A helper function that ensures we won't work with
null values
*/
function nonNull(val, fallback) {
  return Boolean(val) ? val : fallback;
}

/*
Next, we parse regular nodes.
1. We create an element and apply all properties from
JSX to this DOM node. This means that all properties
we can pass are part of HTMLElement.

2. If available, we append all children.
*/
function DOMparseNode(element, properties, children) {
  const el = Object.assign(document.createElement(element), properties);
  DOMparseChildren(children).forEach((child) => {
    el.appendChild(child);
  });
  return el;
}

/*
Last, we create the function that handles children . Children
can either be:
1. Calls to the factory function DOMcreateElement , re-
turning an HTMLElement .
2. Text content, returning a Text .
*/
function DOMparseChildren(children) {
  return children.map((child) => {
    if (typeof child === "string") {
      return document.createTextNode(child);
    }
    return child;
  });
}

/*
To sum it up:

1. The factory function takes elements. Elements can be
of type string or a function.

2. A function element is a component. We call the func-
tion, because we expect to get a DOM Node out of it. If
the function component has also more function com-
ponents inside, they will eventually resolve to a DOM
Node at some point.

3. If the element is a string, we create a regular DOM
Node . For that we call document.createElement .

4. All properties are passed to the newly created Node . By
now you might understand why React has something
like className instead of class . This is because the
DOM API underneath is also className . onClick is
camelCase, though, which I find a little odd.

5. Our implementation only allows DOM Node properties
in our JSX, because of that simple property passing.

6. If our component has children (pushed together in an
array), we parse children as well and append them.

7. Children can be either a call to DOMcreateElement ,
resolving in a DOM Node eventually, or a simple string.

8. If it’s a string, we create a Text . Text s can also be ap-
pended to a DOM Node .
*/
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
Our JSX implementation returns a DOM Node with all its
children. We can even use function components for it. In-
stead of templates, we work with the DOM directly, but the
API is a lot nicer!
So what’s missing? Property typings!
*/

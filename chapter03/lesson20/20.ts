type Result = {
  title: string;
  url: string;
  abstract: string;
};

// It takes a term and some optional tags, and returns a promise with results:
// declare function search(term: string, tags?: string[]): Promise<Result[]>;

// search function that takes a term, a call-
// back, and optional tags as a third parameter. We don’t return
// values, only void .
/* declare function search(
  term: string,
  callback: (result: Result[]) => void,
  tags?: string[]
): void; */

/* However, it isn’t that uncommon in JavaScript to have
functions that take differently typed arguments at differ-
ent positions. Take a look at the write function of the file
system API in Node.js. 
The second argument can be either a buffer with data or a
string that we write to a file. And there are lots of optional
parameters afterwards. The only thing that’s constant is that
the last argument is always a callback. But this callback can
be at position three, four, five, or even six!
*/

// In TypeScript, we define types like that by writing the func-
// tion overloads on top of the actual implementation.

/* 
we need the actual function that implements our search function. 
The function head has to be very special: the argument list has 
to encompass all argument lists from all function overloads above.
Since most of the arguments are different, we use any or unknown to type them.
*/
function search(term: string, tags?: string[]): Promise<Result[]>;
function search(
  term: string,
  callback: (results: Result[]) => void,
  tags?: string[]
): void;
// Here comes the implementation
/*function search(term: string, p2?: unknown, p3?: string[]) {
  // Now for the implementation
}

// see function autocompletion
search();*/

//It’s good practice to get intentional about your overloaded
//arguments at the very beginning of your function body:
/*
function search(term: string, p2?: unknown, p3?: string[]) {
  // We only have a callback if 'p2' is a function
  const callback = typeof p2 === "function" ? p2 : undefined;
  // We have tags if p2 is defined and an array, or if p3
  // is defined and an array
  const tags =
    typeof p2 !== "undefined" && Array.isArray(p2)
      ? p2
      : typeof p3 !== "undefined" && Array.isArray(p3)
      ? p3
      : undefined;
  let queryString = `?query=${term}`;
  if (tags && tags.length) {
    // tags at this point has to be an array
    queryString += `&tags=${tags.join()}`;
  }
  // The actual fetching of results!
  const results = fetch(`/search${queryString}`).then((response) =>
    response.json()
  );
  // callback is either undefined or a function, as
  // seen above
  if (callback) {
    // Now it's definitely a function! So let's then()
    // the results and call the callback!
    // We don't return anything. This is equivalent to
    // void
    return void results.then((res) => callback(res));
  } else {
    // Otherwise, we have to return a promise with
    // results as described in the first function
    // overload
    return results;
  } */

/* Note that inside the function body we lose a lot of type
information due to p2 being unknown . We can narrow it
down to a regular function, or to an array of any . 

If we want
to know more about the types inside the function body, and
still satisfy the function overloads, we can be more explicit:
*/

function search(
  term: string,
  p2?: string[] | ((results: Result[]) => void),
  p3?: string[]
) {
  // All from above, but with better type info
}

/* 
This construct is called a union type, where we define this
parameter as either a string array or a function that accepts
an array of results as a parameter.
*/

// Function Types with Overloads
// A quick way is to get the type via typeof search again, and it might look something like this:
type SearchOverloadFn = {
  // Function overload number 1
  (term: string, tags?: string[] | undefined): Promise<Result[]>;
  // Function overload number 2
  (
    term: string,
    callback: (results: Result[]) => void,
    tags?: string[] | undefined
  ): void;
};

// We can use this function type again to type arrow functions that react to overloads:
const searchWithOverloads: SearchOverloadFn = (
  term: string,
  p2?: string[] | ((results: Result[]) => void),
  p3?: string[]
) => {
  // Do your magic
};

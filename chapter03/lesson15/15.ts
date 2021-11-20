// A helper type with the results we expect
// from calling the back end
type Result = {
  title: string;
  url: string;
  abstract: string;
};

/**
 * The search function takes a query it sends
 * to the back end, as well as a couple of tags
 * as a string array, to get filtered results
 */
// declare function search(query: string, tags: string[]): Result[];

/** search("Ember", ["JavaScript"]); // Works
search("Ember"); // Errors! Tags are missing
search("Ember", []); // Nasty workaround  */

/** functions can take optional parameters, marked
with a question mark */

/** declare function search(query: string, tags?: string[]): Result[];

search("Ember"); // Yes!
search("Ember", ["JavaScript"]); // Also yes!
search("Ember", ["JavaScript", "CSS"]); // Yes yes! */

// can be a string array, but it can also be undefined.
// Only if we check the value exists will
// TypeScript allow us to use the array methods and
// append to the query string.
/**
function search(query: string, tags?: string[]) {
  // Based on our input parameters, we build a query
  // string
  let queryString = `?query=${query}`;
  // tags can be undefined as it's optional.
  // let's check if they exist
  if (tags && tags.length) {
    // and add all tags in that array to the
    // query string
    queryString += `&tags=${tags.join()}`;
  }
  // Ready? Fetch from our search API
  return (
    // What we want is actually what we get: a promise of results.
    // fetch(`/search${queryString}`)
    // When we get a response, we call the
    // .json method to get the actual results
    //.then((response) => response.json())

    // Here we have to be explicit, either through a type cast:
    fetch(`/search${queryString}`).then(
      (response) => response.json() as Promise<Result[]>
    )
  );
}*/

// the other possibility is the function head:
function search(query: string, tags?: string[]): Promise<Result[]> {
  let queryString = `?query=${query}`;
  // tags can be undefined as it's optional.
  // let's check if they exist
  if (tags && tags.length) {
    // and add all tags in that array to the
    // query string
    queryString += `&tags=${tags.join()}`;
  }
  // Ready? Fetch from our search API
  return (
    // What we want is actually what we get: a promise of results.
    // fetch(`/search${queryString}`)
    // When we get a response, we call the
    // .json method to get the actual results
    //.then((response) => response.json())

    // Here we have to be explicit, either through a type cast:
    fetch(`/search${queryString}`).then(
      (response) => response.json() as Promise<Result[]>
    )
  );
}

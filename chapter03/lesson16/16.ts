// A helper type with the results we expect
// from calling the back end
type Result = {
  title: string;
  url: string;
  abstract: string;
};

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

// functions have types too!
// type SearchFn = typeof search;
// When you hover over SearchFn , you’ll see the expanded type definition for a function:
// We can use this function type to create different functions that follow the same signature.
type SearchFn = (
  query: string,
  tags?: string[] | undefined
) => Promise<Result[]>;

// Of course, we can type the function type as defined up there, without using typeof . But typeof is handy!
// We can define complex object types that contain functions:
/**
type Query = {
  query: string;
  tags?: string[];
  assemble: (includeTags: boolean) => string;
};*/

// An object like this would satisfy the contract:
const query: Query = {
  query: "Ember",
  tags: ["javascript"],
  assemble(includeTags = false) {
    let query = `?query=${this.query}`;
    if (includeTags && typeof this.tags !== "undefined") {
      query += `&${this.tags.join(",")}`;
    }
    return query;
  },
};

// And types are composable, so we can define the function type for assemble at a different position:
type AssembleFn = (includeTags: boolean) => string;
type Query = {
  query: string;
  tags?: string[];
  assemble: AssembleFn;
};

/**
Let’s write a function that combines a few workflows for our search:
1. selecting the element where the user inputs their query
2. calling a search
3. showing the results
It takes three arguments:
1. the ID of the input element
2. the ID of the element to present the results in
3. a search function */

// think first about the function head before developing the body.
declare function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void;

//for example, the original search function:
//  displaySearch('searchField', 'result', search)

//  Or an entirely new one that we just made up.Look at this test function:
/** displaySearch("searchField", "result", function (query, tags) {
  return Promise.resolve([
    {
      title: `The ${query} test book`,
      url: `/${query}-design-patterns`,
      abstract: `A practical book on ${query}`,
    },
  ]);
}); */

//We get the same type inference if we extract the function
//into its own anonymous function and assign it to a const
/** const testSearch: SearchFn = function (query, tags) {
  // All types still intact
  return Promise.resolve([
    {
      title: `The ${query} test book`,
      url: `/${query}-design-patterns`,
      abstract: `A practical book on ${query}`,
    },
  ]);
};*/

// structure and shape aren’t defined by the names of arguments as in objects, but by the order of arguments.
// This means we can rename our parameters and still retain types:
/** const testSearch: SearchFn = function (term, options) {
  // term is a string (as defined by query)
  // options is an optional string array
  return Promise.resolve([
    {
      title: `The ${term} test book`,
      url: `/${term}-design-patterns`,
      abstract: `A practical book on ${term}`,
    },
  ]);
};*/

// And we can also completely remove the optional parameter tags (the string array) if we don’t have any use for it:

const testSearch: SearchFn = function (term) {
  // All types still intact
  return Promise.resolve([
    {
      title: `The ${term} test book`,
      url: `/${term}-design-patterns`,
      abstract: `A practical book on ${term}`,
    },
  ]);
};

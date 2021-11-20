// A helper type with the results we expect
// from calling the back end
type Result = {
  title: string;
  url: string;
  abstract: string;
};

/** function search(query: string, tags?: string[]): Promise<Result[]> {
  let queryString = `?query=${query}`;

  if (tags && tags.length) {
    queryString += `&tags=${tags.join()}`;
  }

  return fetch(`/search${queryString}`).then(
    (response) => response.json() as Promise<Result[]>
  );
} */

type SearchFn = (
  query: string,
  tags?: string[] | undefined
) => Promise<Result[]>;

/**
type Query = {
  query: string;
  tags?: string[];
  assemble: (includeTags: boolean) => string;
};*/

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

type AssembleFn = (includeTags: boolean) => string;
type Query = {
  query: string;
  tags?: string[];
  assemble: AssembleFn;
};

declare function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void;

const testSearch: SearchFn = function (term) {
  return Promise.resolve([
    {
      title: `The ${term} test book`,
      url: `/${term}-design-patterns`,
      abstract: `A practical book on ${term}`,
    },
  ]);
};

// We can also drop arguments entirely if we don’t have any use for them:
// This is a valid search Function
/** const dummyContentSearchFn: SearchFn = function () {
  return Promise.resolve([
    {
      title: "Form Design Patterns",
      url: "/form-design-patterns",
      abstract: "A practical book on accessible forms",
    },
  ]);
}; */

// Calling our original search function.
// TypeScript tells us that we need to pass
// at least a query
// search();

// JavaScript still allows us to pass the parameters; we just don’t
// do anything with them. This makes dummyContentSearchFn ,
// with no parameters, compatible with the type SearchFn .
// we can’t call dummyContentSearchFn without the right amount of parameters defined by SearchFn .
dummyContentSearchFn();

//If we refactor dummyContentSearchFn to be a named
//function and not explicitly typed, the behavior is
// fundamentally different:
function dummyContentSearchFn() {
  return Promise.resolve([
    {
      title: "Form Design Patterns",
      url: "/form-design-patterns",
      abstract: "A practical book on accessible forms",
    },
  ]);
}
dummyContentSearchFn("Ember"); // Nope!
dummyContentSearchFn("Ember", ["JavaScript"]); // Nope!
// Good!
dummyContentSearchFn();

// We still can pass dummyContentSearchFn to displaySearch.
displaySearch("input", "output", dummyContentSearchFn);
// TypeScript calls this behavior substitutability.
// We can substitute one function signature for another if it makes sense.
// Substitutability works because the types of the return values stay the same.

//There are situations where we can also substitute the return
//type of the function: when the return type is void .

// We add a callback as second parameter, as
// optional parameters always have to be last
/** function search(
  query: string,
  callback: (results: Result[]) => void,
  tags?: string[]
) {
  let queryString = `?query=${query}`;
  if (tags && tags.length) {
    queryString += `&tags=${tags.join()}`;
  }
  fetch(`/search${queryString}`)
    .then((res) => res.json() as Promise<Result[]>)
    // Here, we pass the results to our callback
    .then((results) => callback(results));
} */

// logs all results to the console
search("Ember", function (results) {
  console.log(results);
});

// And, as we are used to with callbacks, we can pass any function that resembles the function’s shape:
/** function searchHandler(results: Result[]) {
  console.log(results);
}*/
search("Ember", searchHandler);

// we can also pass functions that have a different return type.
// Search handler now returns a number
/** function searchHandler(results: Result[]): number {
  return results.length;
} */
// Totally OK!
search("Ember", searchHandler);

// We can substitute any return type for void . Inside the calling function, the return type will be handled as undefined,
// which means you can’t do anything with it that wouldn’t let TypeScript scream at you with red squiggly lines:
/** function search(
  query: string,
  callback: (results: Result[]) => void,
  tags?: string[]
) {
  let queryString = `?query=${query}`;
  if (tags && tags.length) {
    queryString += `&tags=${tags.join()}`;
  }
  fetch(`/search${queryString}`)
    .then((res) => res.json() as Promise<Result[]>)
    .then((results) => {
      let didItWork = callback(results);
      // didItWork is undefined! This causes an error
      didItWork += 2;
    });
} */

// There are occasions where we pass callback functions that return
// something even though the function called doesn’t do anything with it,
// especially if you want to reuse functions over and over in different scenarios.

// This function shows results in an HTML element
// but also returns the container element that has been filled
function showResults(results: Result[]) {
  const container = document.getElementById("results");
  if (container) {
    container.innerHTML = `<ul>
${results.map((el) => `<li>${el.title}</li>`)}
<ul>`;
  }
  return container;
}

// Somewhere in our app, we show a list of
// pages on click
button.addEventListener("click", function () {
  const el = showResults(storedResults);
  if (el) {
    el.style.display = "block";
  }
});
// But hey, this function also makes a good
// search handler
search("Ember", showResults);

// If you really want to make sure that no value is returned, you
// can either put void in front of callback in plain JavaScript:

function search(
  query: string,
  callback: (results: Result[]) => void,
  tags?: string[]
) {
  let queryString = `?query=${query}`;
  if (tags && tags.length) {
    queryString += `&tags=${tags.join()}`;
  }
  fetch(`/search${queryString}`)
    .then((res) => res.json() as Promise<Result[]>)
    // void is a keyword in JavaScript returning
    // undefined ***** here ********************
    .then((results) => void callback(results));
  // or use undefined as a type:
  /* function search(
  query: string,
  callback: (results: Result[]) => undefined,
  tags?: string[]
  ) {*/
}

function searchHandler(results: Result[]): number {
  return results.length;
}
// This breaks now!
search("Ember", searchHandler);

/* Instead of being too strict with exact function shapes, it complements the way JavaS-
cript works with functions: asking only for the parameters that you actually need. */

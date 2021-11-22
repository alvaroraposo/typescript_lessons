type Result = {
  title: string;
  url: string;
  abstract: string;
};

type SearchFn = (
  query: string,
  tags?: string[] | undefined
) => Promise<Result[]>;

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

const testSearch: SearchFn = function (term) {
  return Promise.resolve([
    {
      title: `The ${term} test book`,
      url: `/${term}-design-patterns`,
      abstract: `A practical book on ${term}`,
    },
  ]);
};

dummyContentSearchFn();

function dummyContentSearchFn() {
  return Promise.resolve([
    {
      title: "Form Design Patterns",
      url: "/form-design-patterns",
      abstract: "A practical book on accessible forms",
    },
  ]);
}
// Good!
dummyContentSearchFn();

// We still can pass dummyContentSearchFn to displaySearch.
displaySearch("input", "output", dummyContentSearchFn);

// logs all results to the console
search("Ember", function (results) {
  console.log(results);
});

search("Ember", searchHandler);

// Totally OK!
search("Ember", searchHandler);

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
}

function searchHandler(results: Result[]): number {
  return results.length;
}
// This breaks now!
search("Ember", searchHandler);

/* Instead of being too strict with exact function shapes, it complements the way JavaS-
cript works with functions: asking only for the parameters that you actually need. */

/* declare function displaySearch(
  inputId: "string",
  outputId: "string",
  search: SearchFn
): void; */

// First, we select the input element which goes by the ID passed in the inputId argument. We want to listen to all
// change events that are fired. Once a change event is fired, we set an active state to the
// entire form, which means we add a class called active to the parent element.
/* function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void {
  document.getElementById(inputId)?.addEventListener("change", function () {
    this.parentElement?.classList.add("active");
  });
}*/

// After we set our form to active , we fetch the current value from the input field, to
// pass it to the search function.
/* function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void {
  document.getElementById(inputId)?.addEventListener("change", function () {
    this.parentElement?.classList.add("active");
    const searchTerm = this.value;
  });
} */

// Function Binding and HTML Elements
/* the callback function is bound to the
element we retrieved via getElementById . So this at this
moment is the element node, which is of type HTMLElement. 
So this at this
moment is the element node, which is of type HTMLElement.
*/
// Creating an HTMLVideoElement by using
// the tag
const x = document.createElement("video");
console.log(x.toString());
// Prints "[object HTMLVideoElement]"
// the name of the actual browser interface
/* The TSJS Generator 20 converts WIDL files to TypeScript declaration files 
How should a static code
analysis tool know which element is underneath inputId?
In our case, we have to check what subtype instance this
is. This comes with another type guard check: instanceof .


function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void {
  document.getElementById(inputId)?.addEventListener("change", function () {
    // This is of type HTMLElement because
    // getElementById says so
    this.parentElement?.classList.add("active");
    if (this instanceof HTMLInputElement) {
      // From here on, this is
      // of type HTMLInputElement
      const searchTerm = this.value; // Works!
      search(searchTerm).then((results) => {
        // TODO in another lesson
      });
    }
  });
}*/

/* 
As an additional benefit, our code becomes a lot more
secure. TypeScript again points us to the things that might
cause some problems: yes, we can be sure that this is an
HTMLElement once we reach the callback, but we can never
be completely sure that it is of type HTMLInputElement. 

what if we want to extract the callback into its own function? This is not uncommon
when writing JavaScript; the same function might be used at different places. 
But the moment we extract the function and put it in another place, we also lose 
any connection to this !


function inputChangeHandler() {
  // We have no clue what this can be
  // that's why we get red squigglies
  this.parentElement?.classList.add("active");
}*/

function displaySearch(
  inputId: string,
  outputId: string,
  search: SearchFn
): void {
  document
    .getElementById(inputId)
    // Only here, inputChangeHandler's this
    // becomes of type HTMLElement again
    // but inputChangeHandler doesn't know about that
    ?.addEventListener("change", inputChangeHandler);
}

/* TypeScript has a way of dealing with situations like this:
we are allowed to type this ! Function declarations can
have another additional parameter, that has to be at the
very first position: this. */
// We define that this is of type HTMLElement
function inputChangeHandler(this: HTMLElement) {
  this.parentElement?.classList.add("active");
}

/* We can only use inputChangeHandler wherever we can
be sure that this is going to be a (sub)type of HTMLElement .
This also ensures that we don’t call inputChangeHandler
outside with no context: */

// The 'this' context of type 'void' is not assignable
// to method's 'this' of type 'HTMLElement'.
inputChangeHandler();

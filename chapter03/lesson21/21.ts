type Result = {
  title: string;
  url: string;
  abstract: string;
};
/* There are two things to remember when working with generators.
1. There’s an asterisk around the generator function telling you that this is not an ordinary function.
2. There’s a new keyword: yield . It acts as a doorway that passes results to the outside, but also allows us 
to enter values for the next iteration. If you ever saw a function as a black box, see yield as a hatch where
we can peek inside. */
// Nonsensical, but it illustrates the way they work
function* generateStuff() {
  yield 1;
  yield 2;
  let proceed = yield 3;
  if (proceed) {
    yield 4;
  }
  return "done";
}
// In use:
const generator = generateStuff();
console.log(generator.next().value); // logs 1
console.log(generator.next().value); // logs 2
console.log(generator.next().value); // logs 3
// The door is open, we pass true through and...
console.log(generator.next(true).value); // logs 4
console.log(generator.next().value); // 'done'

// Polling Search
/* In our example we want to have a polling search. Imagine
a back end that reacts to a specific search query and then
returns results within milliseconds. The results are by no
means complete, just a few it was able to fetch from the da-
tabase. It also tells us if it’s finished with the query. We then
have the possibility to query again and get more results. We
constantly poll the back end for more. */
type PollingResults = {
  results: Result[];
  done: boolean;
};

// We strip away things like resetting the search query or connecting results to a user:
async function polling(term: string): Promise<PollingResults> {
  return fetch(`/pollingSearch?query=${term}`).then((res) => res.json());
}

/* 
The reason why we’re fetching results in batches is that we
want to show them as soon as possible, appending results
on the go: */
function append(result: Result) {
  const node = document.createElement("li");
  node.innerHTML = `
<a href="${result.url}">${result.title}</a>
`;
  document.querySelector("#results")?.append(node);
}

/* We constantly poll our back end and return results, but end the
function only if the back end tells us it’s done. 
async function* getResults(term: string) {
  let state;
  do {
    // state is a PollingResult
    state = await polling(term);
    // yield the current result array
    yield state.results;
  } while (!state.done);
  // Nothing more to do
} */

// The type of the generator is as follows:
/* AsyncGenerator<Result[], void, unknown>
1. We yield Result[] arrays.
2. We return nothing, hence void .
3. We don’t pass anything. Unknown values come
through the door. 

Looping through our constantly fetched
results looks something like this:
*/
// Adding an event listener, we've been there
document
  .getElementById("searchField")
  ?.addEventListener("change", handleChange);

/* The actual event handler
async function handleChange(this: HTMLElement, ev: Event) {
  if (this instanceof HTMLInputElement) {
    // Search for a term,
    // call the generator, get an iterator
    let resultsGen = getResults(this.value);
    let next;
    do {
      // Get the next iterator result
      next = await resultsGen.next();
      // The value can be a Result[] or void
      // because that's what the generator function
      // returns
      if (typeof next.value !== "undefined") {
        next.value.map(append);
      }
    } while (!next.done); // As long as we are not done
  }
}*/

// For this very basic iteration, where we don’t put anything
// back through the yield door, we can use for await loops:
/* async function handleChange(this: HTMLElement, ev: Event) {
  if (this instanceof HTMLInputElement) {
    let resultsGen = getResults(this.value);
    for await (const results of resultsGen) {
      results.map(append);
    }
  }
}

 The great thing about having a generator function is that
we can control the output midway through. 

We can wait until our back end is complete with all the search
results and sends us the done flag. Or we preemptively say
stop polling if we reach a certain amount of results we
want to show.

Thankfully, the next function allows us to pass results in. A
call if the polling should proceed would be nice, preferably
when we show more than five results. The handleChange
function is adapted quickly by introducing a counter variable.
*/

async function handleChange(this: HTMLElement, ev: Event) {
  if (this instanceof HTMLInputElement) {
    // Search for a term,
    // call the generator, get an iterator
    let resultsGen = getResults(this.value);
    let next;
    let count = 0;
    do {
      // Get the next iterator result
      next = await resultsGen.next(count >= 5);
      if (typeof next.value !== "undefined") {
        next.value.map(append);
        count += next.value.length;
      }
      if (typeof next.value !== "undefined") {
        next.value.map(append);
      }
    } while (!next.done); // As long as we are not done
  }
}

/*
async function* getResults(term: string) {
  let state;
    //let stop; let TypeScript infer it by assigning a default value:
    //TypeScript is OK with this change as everything we can pass
    //in through the yield door is unknown . So we have to make
    //that more concrete.
  let stop = false;
  do {
    // state is a PollingResult
    state = await polling(term);
    // yield the current result array
    stop = yield state.results;
  } while (!state.done || stop);
  // Nothing more to do
}

And this (let stop = false) makes sure that we pass the correct types. 

Or, we are very explicit about our return type: */
async function* getResults(
  term: string
): AsyncGenerator<Result[], void, boolean> {
  let state, stop;
  do {
    state = await polling(term);
    stop = yield state.results;
    // from here on, stop is boolean
  } while (state.done && stop);
}

/* Like so often, the choice is between casually going forward (assign values and count on typescript inferation)
as we code, or being very explicit about contracts by defin-
ing function heads as concretely as possible. */

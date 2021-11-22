// Tagged Template Literals
type Result = {
  title: string;
  url: string;
  abstract: string;
};
/* Let’s think about a highlight tag, that allows us to replace
a certain symbol within a string with some HTML ele-
ments; for example: */

const result = {
  title: "A guide to @@starthl@@Ember@@endhl@@.js",
  url: "/a-guide-to-ember",
  description: "The framework @@starthl@@Ember@@endhl@@.js in a nutshell",
};

/* We want to replace every @@starthl@@ with <mark> tags, and @@endhl@@ with </mark> closing tags. */
let markup = highlight`<li>${result.title}</li>`;

/* 
A tag for a tagged template literal is nothing but a function that has a defined set of parameters.
1. The first parameter is a TemplateStringsArray , an array that contains all the strings around the expres-
sions. In our case <li> and </li>
2. The second is a string array with the actual expres-
sions. In our case whatever ${result.title} gives us.

TypeScript provides us with respective types for that. The
type TemplateStringsArray is different from other string
arrays as it’s read-only and has a pointer to the raw array.
This mirrors the actual implementation in JavaScript.
*/
function highlight(strings: TemplateStringsArray, ...values: string[]) {
  let str = ""; // The result string
  strings.forEach((templ, i) => {
    // Fetch the expression from the same position
    // or assign an empty string
    let expr =
      values[i]?.replace("@@start@@", "<em>").replace("@@end@@", "</em>") ?? "";
    // Merge template and expression
    str += templ + expr;
  });
  return str;
}

function createResultTemplate(results: Result[]): string {
  return `<ul>
${results.map((result) => highlight`<li>${result.title}</li>`)}
</ul>`;
}

//declare function search(term: string, ...tags: string[]): Promise<Result[]>;

/* 
Just by adding three dots, the usage of the search function
varies, while the way the search function works internally
stays exactly the same.
rest parameters are always optional


Using the async keyword affects the function body and
the implementation. Your return values are automatically
wrapped in a promise return type:

async function search(query: string, tags?: string[]) {
  let queryString = `?query=${query}`;
  if (tags && tags.length) {
    queryString += `&tags=${tags.join()}`;
  }
  // Instead of thenable promise calls
  // we await results
  const response = await fetch(`/search${queryString}`);
  const results = await response.json();
  // The return type becomes Promise<Result[]>
  return results as Result[];
}*/

/* Note that TypeScript supports top-level async . This means
that as long as you are in a module context, you can call
async functions as much as you like. 

One important detail: when you declare an asynchronous
function type, you can’t use the async keyword.
*/
declare function search(term: string, tags?: string[]): Promise<Result[]>;

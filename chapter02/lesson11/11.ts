//To define a type for the book object,
//we can use the type alias syntax:
type Article = {
  title: string;
  price: number;
  vat: number;
  stock: number;
  description: string;
};

const book = {
  title: "Form Design Patterns by Adam Silver",
  price: 32.77,
  vat: 0.19,
  stock: 1000,
  description: "A practical book on accessibility and forms",
};

// Property 'description' is missing
const movie: Article = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
};

// Property 'rating' is not allowed
const movie2: Article = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
  description: "90 minutes of gushing about Helvetica",
  rating: 5,
};

//However, this isn’t the case when we define the value elsewhere:
const movBackup = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
  description: "90 minutes of gushing about Helvetica",
  rating: 5,
};
const movie3: Article = movBackup; // Totally OK!
/**
 * If we look at the autocompletion features that 
 * VS Code gives us as soon as we assigned movBackup
to movie , we see that rating is not available anymore
This doesn’t mean that these properties aren’t there at run-
time. They are!
 */

/**
 * This is also true if we have two different types with a simi-
lar enough structure to fulfill the contract
 */
type ShopItem = {
  title: string;
  price: number;
  vat: number;
  stock: number;
  description: string;
  rating: number;
};

const shopitem = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
  description: "90 minutes of gushing about Helvetica",
  rating: 5,
};
const movie4: Article = shopitem; // Totally OK!

const missingProperties = {
  title: "Helvetica",
  price: 6.66,
};
// Boom! This breaks
const anotherMovie: Article = missingProperties;

function addVAT(price: number, vat = 0.2) {
  return price * (1 + vat);
}

//We can also use our custom defined types as parameters
//in functions
function createArticleElement(article: Article): string {
  const title = article.title;
  const price = addVAT(article.price, article.vat);
  return `<h2>Buy ${title} for ${price}</h2>`;
}

/* And we can pass parameters with no explicit type annota-
tion. Since the structural contract is fulfilled. */

const shopItem2 = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
  description: "90 minutes of gushing about Helvetica",
  rating: 5,
};

//createArticleElement(shopItem2); // Totally OK!

//do an inline object type with only the properties we expect:
function createArticleElement2(article: {
  title: string;
  price: number;
  vat: number;
}): string {
  const title = article.title;
  const price = addVAT(article.price, article.vat);
  return `<h2>Buy ${title} for ${price}</h2>`;
}

const movie5: Article = {
  title: "Helvetica",
  price: 6.66,
  vat: 0.19,
  stock: 1000,
  description: "90 minutes of gushing about Helvetica",
};
//The structural contract is still fulfilled.
createArticleElement2(movie5);

/*Direct value assignments: passing an
object with too many properties directly to a function will
trigger excess property checks:*/
createArticleElement2({
  title: "Design Systems by Alla Kholmatova",
  price: 20,
  vat: 0.19,
  rating: 5,
}); // Boom! rating is one property too many

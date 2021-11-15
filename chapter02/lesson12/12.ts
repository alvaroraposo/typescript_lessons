const defaultOrder = {
  articles: [
    {
      price: 1200.5,
      vat: 0.2,
      title: "Macbook Air Refurbished - 2013",
    },
    {
      price: 9,
      vat: 0,
      title: "I feel smashing subscription",
    },
  ],
  customer: {
    name: "Fritz Furball",
    address: {
      city: "Smashing Hill",
      zip: "90210",
      street: "Whisker-ia Lane",
      number: "1337",
    },
    dateOfBirth: new Date(2006, 9, 1),
  },
};

/** This object is a bit complex! We could define the type
in one sitting: */
type OrderFull = {
  articles: {
    price: number;
    vat: number;
    title: number;
  }[];
  customer: {
    name: string;
    address: {
      city: string;
      zip: string;
      street: string;
      number: string;
    };
    dateOfBirth: Date;
  };
};

//Or we could create lots of smaller types:
type ArticleStub = {
  price: number;
  vat: number;
  title: string;
};
type Address = {
  city: string;
  zip: string;
  street: string;
  number: string;
};
type Customer = {
  name: string;
  address: Address;
  dateOfBirth: Date;
};
type Order = {
  articles: ArticleStub[];
  customer: Customer;
};

/* In TypeScript’s type system, the typeof
operator takes any object (or function, or constant) and
extracts the shape of it:*/
type OrderFromDefault = typeof defaultOrder;
/**
 * This gives us a type we can use anywhere in our code
 * Checks if all our orders have articles
 */
function checkOrders(orders: OrderFromDefault[]) {
  let valid = true;
  for (let order of orders) {
    valid = valid && order.articles.length > 0;
  }
  return valid;
}

//import { Article } from "./12.d";
//If we are only interested in types
import type { Article } from "./12.d";
function isArticleInStock(article: Article) {
  // this check is necessary to make sure
  // the optional property exists
  if (article.stock) {
    return article.stock > 0;
  }
  return false;
}

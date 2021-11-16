import type { Article } from "./14.d";

class Discount {
  isPercentage: boolean;
  amount: number;
  constructor(isPercentage: boolean, amount: number) {
    this.isPercentage = isPercentage;
    this.amount = amount;
  }
  apply(article: Article) {
    if (this.isPercentage) {
      article.price = article.price - article.price * this.amount;
    } else {
      article.price = article.price - this.amount;
    }
  }
}

// Our friend’s ShopItem
interface ShopItem {
  title: string;
  price: number;
  vat: number;
  stock?: number;
  description?: string;
} // And yes, the semicolons are optional

/** Both Article and ShopItem are compatible,
 * because their shape – their structure – is the same: */
const discount = new Discount(true, 0.2);
const shopItem: ShopItem = {
  title: "Inclusive components",
  price: 30,
  vat: 0.2,
};

// Discount.apply is typed to take `Article`
// but also takes a `ShopItem`
discount.apply(shopItem);

/** If you use classes, both interfaces and types can be
implemented: */
// Implementing Interfaces
class DVD implements ShopItem {
  title: string;
  price: number;
  vat: number;
  constructor(title: string) {
    this.title = title;
    this.price = 9.99;
    this.vat = 0.2;
  }
}
// Implementing Types
class Book implements Article {
  title: string;
  price: number;
  vat: number;
  constructor(title: string) {
    this.title = title;
    this.price = 39;
    this.vat = 0.2;
  }
}

// Nope, we missed the property `title`!
class Book implements Article {
  price: number;
  vat: number;
  constructor() {
    this.price = 39;
    this.vat = 0.2;
  }
}

/**Of course, the shape of objects of types Book and DVD are the
same as Article or ShopItem , so our Discount class works
on them as well: */
let book = new Book("Art Direction on the Web");
discount.apply(book);
let dvd = new DVD("Contagion");
discount.apply(dvd);

//the biggest difference is declaration merging.
/* We can take our ShopItem declaration from earlier on,
and extend them with an array of reviews at a totally
different position: */
interface ShopItem {
  reviews: {
    rating: number;
    content: string;
  }[];
}

declare global {
  interface Window {
    isDevelopment: boolean;
  }
}

/** TypeScript classes can do a lot more,
even modifying access to certain properties: */
class Article2 {
  public title: string;
  private price: number;
  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}
const article = new Article2("Smashing Book 6", 39);
console.log(article.price);

/** They implement a lot but leave out important
details to be filled out by real classes: */
abstract class Discount2 {
  // This needs to be implemented
  abstract isValid(article: Article): boolean;
  // This is already implemented
  apply(article: Article) {
    // Like before ...
  }
}

/** Enums (short for enumerations) allow you to bundle a cou-
ple of types and use them throughout your code: */
enum UserType {
  Admin,
  PayingCustomer,
  Trial,
}
function showWarning(user: UserType) {
  switch (user) {
    case UserType.Admin:
      return false;
    case UserType.PayingCustomer:
      return false;
    case UserType.Trial:
      return false;
  }
}

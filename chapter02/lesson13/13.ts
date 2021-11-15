import type { Article } from "./13.d";

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

// The moment we create a class, it’s available in the type space as well:
let discount: Discount = new Discount(true, 0.2);

//So what’s the shape of a class-generated object?
// 1. The constructor function. (Boolean isPercentage , and a
// number for the amount)
// The second part is a prototype. (( isPercentage, amount ) and a function to apply
// the discount to an article.)

// Now that we know the
// shape, we can even assign regularly generated objects to a
// variable of type Discount.
let allProductsTwentyBucks: Discount = {
  isPercentage: false,
  amount: 20,
  apply(article) {
    article.price = 20;
  },
};

/* This also works vice versa. We can define an object type,
and create a new Discount object via a constructor:*/
type DiscountType = {
  isPercentage: boolean;
  amount: number;
  apply(article: Article): void;
};
let disco: DiscountType = new Discount(true, 0.2);

/**
 * This class always gives 20 %, but only if
 * the price is not higher than 40 EUR
 */
class TwentyPercentDiscount extends Discount {
  // No special constructor
  constructor() {
    // But we call the super constructor of
    // Discount
    super(true, 0.2);
  }
  apply(article: Article) {
    if (article.price <= 40) {
      super.apply(article);
    }
  }

  /* But we can change the shape. Let’s create a validation fea-
ture to TwentyPercentDiscount :*/
  isValidForDiscount(article: Article) {
    return article.price <= 40;
  }
}

let disco1: Discount = new TwentyPercentDiscount(); // OK
//let disco2: TwentyPercentDiscount = new Discount(true, 0.3);
// OK! Semantics changed! (without validation)
// Error! We miss the `isValidForDiscount`
// method
let disco2: TwentyPercentDiscount = new Discount(true, 0.3);

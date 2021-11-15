class Discount {
  isPercentage;
  amount;
  constructor(isPercentage, amount) {
    this.isPercentage = isPercentage;
    this.amount = amount;
  }
  apply(article) {
    if (this.isPercentage) {
      article.price = article.price - article.price * this.amount;
    } else {
      article.price = article.price - this.amount;
    }
  }
}
// A discount that shaves off 10 EUR
const discount = new Discount(false, 10);
discount.apply({
  price: 39,
  vat: 0.2,
  title: "Form Design Patterns",
});

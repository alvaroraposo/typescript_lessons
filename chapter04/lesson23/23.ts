type Name = {
  name: string;
};
type Age = {
  age: number;
};

const person = {
  name: "Stefan Baumgartner",
  city: "Linz",
};

// In my midlife crisis, I don't use semicolons
// ... just like the cool kids
const midlifeCrisis = {
  age: 38,
  usesSemicolons: false,
};

const me = {
  name: "Stefan Baumgartner",
  age: 38,
};

// Once we define the union type Age | Name
// both midlifeCrisis and person are compatible with
// the newly created type.

// an intersection type Person = Age & Name
// only the variable me becomes compatible

/* We can narrow down primitive types to values. 
It turns out that each specific value of a set is 
its own type: a value type. */

let conf = "conference";
let withTypeAny: any = "conference"; // OK!
let withTypeString: string = "conference"; // OK!
// But also:
let withValueType: "conference" = "conference";

/*
When our back end sends along details of which kind of
events we are dealing with, 
we can create a custom union type:
*/

type EventKind = "webinar" | "conference" | "meetup";
// Cool, but not possible
let tomorrowsEvent: EventKind = "concert";

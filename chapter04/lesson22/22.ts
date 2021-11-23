/* 
1. Tech conferences: people meet at a certain location
and listen to a couple of talks. Conferences usually cost
something, so they have a price.

2. Meetups: smaller in scale, meetups are similar to
conferences from a data perspective. They also happen
at a certain location with a range of talks, but compared
with tech conferences they are usually free. Well, at
least in our example they are.

3. Webinars: instead of people attending in a physical
space, webinars are online. They don’t need a location,
but a URL where people can watch the webinar in their
browser. They can have a price, but can also be free.
Compared with the other two event types, webinars
feature only one talk.
*/

type Talk = {
  title: string;
  abstract: string;
  speaker: string;
};

/*type Conference = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  kind: string;
  location: string;
  price: number;
  talks: Talk[];
};

type Meetup = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  kind: string;
  location: string;
  price: string; // free
  talks: Talk[];
};

type Webinar = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  kind: string;
  url: string;
  price?: number;
  talks: Talk;
}; */

/*First, let’s create a TechEventBase type that contains all the
properties that are the same in all three event types.*/

type TechEventBase = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  kind: string;
};

//refactoring
//We call this concept intersection types.
//We read the & operator as and.
type Conference = TechEventBase & {
  location: string;
  price: number;
  talks: Talk[];
};
type Meetup = TechEventBase & {
  location: string;
  price: string;
  talks: Talk[];
};
type Webinar = TechEventBase & {
  url: string;
  price?: number;
  talks: Talk;
};

/*
Sometimes we don’t know exactly what entries we get, only that
they are of one of the three event types. 
For situations like that, we can use a concept called union
types.

TechEvent type that can be either a
Webinar , or a Conference , or a Meetup .
*/
type TechEvent = Webinar | Conference | Meetup;

// The new type can access the following properties:
// 1. properties all three types have in common (TechEventBase)
// 2. talks: This property can be either a single Talk , or an array Talk[]
// 3. price: string or number , and – following Webinar – it can be optional.
// -    check if it’s available, and then we have to do typeof
//      checks to see if we’re dealing with a number
//      or a string.
//

// type guards ( if statements)
// to narrow down the union type to its single type.
function printEvent(event: TechEvent) {
  if (event.price) {
    // Price exists!
    if (typeof event.price === "number") {
      // We know that price is a number
      console.log("Price in EUR: ", event.price);
    } else {
      // We know that price is a string, so the
      // event is free!
      console.log("It is free!");
    }
  }
  if (Array.isArray(event.talks)) {
    // talks is an array
    event.talks.forEach((talk) => {
      console.log(talk.title);
    });
  } else {
    // It's just a single talk
    console.log(event.talks.title);
  }
}

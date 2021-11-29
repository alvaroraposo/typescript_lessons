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

type TechEvent = Webinar | Conference | Meetup;

function printEvent(event: TechEvent) {
  if (event.price) {
    if (typeof event.price === "number") {
      console.log("Price in EUR: ", event.price);
    } else {
      console.log("It is free!");
    }
  }
  if (Array.isArray(event.talks)) {
    event.talks.forEach((talk) => {
      console.log(talk.title);
    });
  } else {
    console.log(event.talks.title);
  }
}

/* 
Instead of putting a union of three val-
ue types at TechEventBase , we can move very distinct value
types down to the three specific tech event types. First, we
drop kind from TechEventBase:
*/
/* type TechEventBase = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  // this type can only take three distinct values:
  kind: "conference" | "meetup" | "webinar";
}; 

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
}; */

// First, we drop kind from TechEventBase :
type TechEventBase = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
  // this type can only take three distinct values:
};

type Conference = TechEventBase & {
  location: string;
  price: number;
  talks: Talk[];
  kind: "conference";
};
type Meetup = TechEventBase & {
  location: string;
  price: string;
  talks: Talk[];
  kind: "meetup";
};
type Webinar = TechEventBase & {
  url: string;
  price?: number;
  talks: Talk;
  kind: "webinar";
};

/* 
with a specific value type for a property 
we can directly point to the surrounding object type.
*/
function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    // We now know that I'm in type Conference
    case "conference":
      return (
        `${event.title} (Conference)` +
        // Suddenly I don't have to check for price as
        // TypeScript knows it will be there
        `priced at ${event.price} USD`
      );
    case "meetup":
      // We now know that we're in type Meetup
      return (
        `${event.title} (Meetup)` +
        // Suddenly we can say for sure that this
        // event will have a location, because the
        // type tells us
        `hosted at ${event.location}`
      );
    case "webinar":
      // We now know that we're in type Webinar
      return (
        `${event.title} (Webinar)` +
        // Suddenly we can say for sure that there will
        // be a URL
        `available online at ${event.url}`
      );
    //    case "concert": (not possible)
    default:
      throw new Error("Not sure what to do with that!");
  }
}

/* 
Using value types for properties works like a hook for Type-
Script to find the exact shape inside a union. Types like this
are called discriminated union types, and they’re a safe way to
move around in TypeScript’s type space.
*/

// Let’s define a conference object outside of what we get from the back end.
/* const script19 = {
  title: "ScriptConf",
  date: new Date("2019-10-25"),
  capacity: 300,
  rsvp: 289,
  description: "The feel-good JS conference",
  kind: "conference",
  price: 129,
  location: "Central Linz",
  talks: [
    {
      speaker: "Vitaly Friedman",
      title: "Designing with Privacy in mind",
      abstract: "...",
    },
  ],
}; */

// By our type signature, this would be a perfectly fine value of
// the type TechEvent (or Conference ).
//getEventTeaser(script19); // (error)
// inferred types are mostly strings and numbers for simple properties.

/* const script19: TechEvent = {
  title: "ScriptConf",
  date: new Date("2019-10-25"),
  capacity: 300,
  rsvp: 289,
  description: "The feel-good JS conference",
  kind: "conference",
  price: 129,
  location: "Central Linz",
  talks: [
    {
      speaker: "Vitaly Friedman",
      title: "Designing with Privacy in mind",
      abstract: "...",
    },
  ],
};

getEventTeaser(script19); */

/* 
we lose the ability to leverage structural typing 
and work freely with objects that just need to be compatible with 
types rather than explicitly be of a certain shape.
*/

// That will work, but we lose some type safety as we could
// also cast 'meetup' as 'conference'.
const script19 = {
  title: "ScriptConf",
  date: new Date("2019-10-25"),
  capacity: 300,
  rsvp: 289,
  description: "The feelgood JS conference",
  // kind: "conference" as "conference", // this works
  kind: "conference" as const, //this is better
  price: 129,
  location: "Central Linz",
  talks: [
    {
      speaker: "Vitaly Friedman",
      title: "Designing with Privacy in Mind",
      abstract: "...",
    },
  ],
};

// This works just like assigning a primitive value to a const
// and fixate its value type.

/* 
You can apply const context events to objects, casting all
properties to their value types, effectively creating a value
type of an entire object. As a side effect, the whole object
becomes read-only.
*/

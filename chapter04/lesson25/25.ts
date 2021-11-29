type Talk = {
  title: string;
  abstract: string;
  speaker: string;
};

//type TechEvent = Webinar | Conference | Meetup;

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

function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    case "conference":
      return `${event.title} (Conference)` + `priced at ${event.price} USD`;
    case "meetup":
      return `${event.title} (Meetup)` + `hosted at ${event.location}`;
    case "webinar":
      return `${event.title} (Webinar)` + `available online at ${event.url}`;
    default:
      throw new Error("Not sure what to do with that!");
  }
}

const script19 = {
  title: "ScriptConf",
  date: new Date("2019-10-25"),
  capacity: 300,
  rsvp: 289,
  description: "The feelgood JS conference",
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

// type EventKind = "conference" | "webinar" | "meetup";
function filterByKind(list: TechEvent[], kind: EventKind): TechEvent[] {
  return list.filter((el) => el.kind === kind);
}

// A list of tech events we get from a back end
declare const eventList: TechEvent[];
filterByKind(eventList, "conference"); // OK!
filterByKind(eventList, "webinar"); // OK!
filterByKind(eventList, "meetup"); // OK!
// 'concert' is not part of EventKind
filterByKind(eventList, "concert"); // Bang!

// new type!
type Hackathon = TechEventBase & {
  location: string;
  price?: number;
  kind: "hackathon";
};
type TechEvent = Conference | Webinar | Meetup | Hackathon;

//type EventKind = "conference" | "webinar" | "meetup" | "hackaton";
// Immediately, we get a disconnect between EventKind and TechEvent .
// This should be possible
filterByKind(eventList, "hackathon"); // Error

declare const event: TechEvent;
// Accessing the kind property via the index
// operator
console.log(event["kind"]);
// Doing the same thing on a type level
type EventKind = TechEvent["kind"];
// EventKind is now
// 'conference' | 'webinar' | 'meetup' | 'hackathon'

/* 
Since the union of TechEvent already combines all possible
values of property types into unions, we don’t need to define
EventKind on our own anymore. Types like this are called
index access types or lookup types.
*/

/*type GroupedEvents = {
  conference: TechEvent[];
  meetup: TechEvent[];
  webinar: TechEvent[];
  hackathon: TechEvent[];
};*/
function groupEvents(events: TechEvent[]): GroupedEvents {
  const grouped = {
    conference: [],
    meetup: [],
    webinar: [],
    hackathon: [],
  };
  events.forEach((el) => {
    grouped[el.kind].push(el);
  });
  return grouped;
}

/* 
The type GroupedEvents is manually maintained. We see that we
have four different keys based on the events that we work
with, and the moment the original TechEvent union chang-
es, we would have to maintain this type as well.
*/

/* 
In our case, we want the keys hackathon , webinar , meetup ,
and conference to be generated automatically and mapped
to a TechEvent list by running over EventKind :
*/

// 1. The original declaration

type GroupedEvents = {
  [Kind in EventKind]: TechEvent[];
};

/* 
We call this kind of type mapped type. Rather than hav-
ing clear property names, they use brackets to indicate a
placeholder for eventual property keys.
*/

// 2. Resolving the type alias.
// We suddenly get a connection to tech event
type GroupedEvents = {
  [Kind in TechEvent["kind"]]: TechEvent[];
};
// 3. Resolving the union
type GroupedEvents = {
  [Kind in "webinar" | "conference" | "meetup" | "hackathon"]: TechEvent[];
};
// 4. Extrapolating keys
type GroupedEvents = {
  webinar: TechEvent[];
  conference: TechEvent[];
  meetup: TechEvent[];
  hackathon: TechEvent[];
};

/*
The moment we add another kind of event to our list of
tech events, EventKind gets an automatic update and we
get more information for filterByKind.
We also know that we have another entry in GroupedEvents, 
and the function groupEvents won’t compile because the return
value lacks a key. And we get all these benefits at no extra
cost. We just have to be clear with our types and create the
necessary connections.
*/

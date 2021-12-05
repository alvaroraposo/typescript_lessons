type Talk = {
  title: string;
  abstract: string;
  speaker: string;
};

type TechEventBase = {
  title: string;
  description: string;
  date: Date;
  capacity: number;
  rsvp: number;
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

type TechEvent = Conference | Webinar | Meetup | Hackathon;

type Hackathon = TechEventBase & {
  location: string;
  price?: number;
  kind: "hackathon";
};

type UserEvents = {
  watching: TechEvent[];
  rvsp: TechEvent[];
  attended: TechEvent[];
  signedout: TechEvent[];
};

type UserEventCategory = "watching" | "rsvp" | "attended" | "signedoff";
type EventKind = TechEvent["kind"];

// 'speaker' | 'title' | 'abstract'
type TalkProperties = keyof Talk;
// number | 'toString' | 'charAt' | ...
type StringKeys = keyof "speaker";
// number | 'length' | 'pop' | 'push' | ...
type ArrayKeys = keyof [];

function filterUserEvent(
  list: UserEvents,
  category: string,
  filterKind?: EventKind
) {
  if (isUserEventListCategory(list, category)) {
    const filteredList = list[category];
    if (filterKind) {
      return filteredList.filter((event) => event.kind === filterKind);
    }
    return filteredList;
  }
  return list;
}

function isUserEventListCategory(
  list: UserEvents,
  category: string
): category is keyof UserEvents {
  // The type predicate;
  return Object.keys(list).includes(category);
}

// never
/*
function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    case "conference":
      return `${event.title} (Conference), ` + `priced at ${event.price} USD`;
    case "meetup":
      return `${event.title} (Meetup), ` + `hosted at ${event.location}`;
    case "webinar":
      return `${event.title} (Webinar), ` + `available online at ${event.url}`;
    case "hackathon":
      return `${event.title} (Hackathon)`;
    default:
      `${event}`; // hover to see 'never'
  }
}*/

/*  
But, if we checked for all values in our list, why would we
run into a default branch anyway? 
This is highly erroneous, as we indicate by throw-
ing a new error right away! Running into the default
branch can never happen. Never!
'Never' indicates the cases that aren’t supposed to happen,

remove Hackaton
it would be a lot nicer if TypeScript alerted us that we forgot
something. We want to exhaust our entire list, after all.

function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    case "conference":
      return `${event.title} (Conference), ` + `priced at ${event.price} USD`;
    case "meetup":
      return `${event.title} (Meetup), ` + `hosted at ${event.location}`;
    case "webinar":
      return `${event.title} (Webinar), ` + `available online at ${event.url}`;
    default:
      throw new Error("Not sure what to do with that!");
  }
}*/

/**
 * For that, we want to make sure that at the end of a long
switch–case statement, or in else branches that shouldn’t
occur, the type of event is definitely never .
 */
function neverError(
  message: string,
  token: never // The culprit
) {
  return new Error(`${message}. ${token} should not exist`);
}

/**
 * We substitute the neverError function with the actual error
throwing in our switch–case statement:
 
function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    case "conference":
      return `${event.title} (Conference), ` + `priced at ${event.price} USD`;
    case "meetup":
      return `${event.title} (Meetup), ` + `hosted at ${event.location}`;
    case "webinar":
      return `${event.title} (Webinar), ` + `available online at ${event.url}`;
    default:
      throw neverError("Not sure what to do with that", event);
  }
} */

/**
 * At this point, event could potentially be a hackathon. We’re
just not dealing with that. TypeScript gives us a red squig-
gly and tells us that we can’t pass some value to a function
that expects never .

After we add 'hackathon' to the list again, TypeScript will
compile again, and all our exhaustive checks are complete.
 */
function getEventTeaser(event: TechEvent) {
  switch (event.kind) {
    case "conference":
      return `${event.title} (Conference), ` + `priced at ${event.price} USD`;
    case "meetup":
      return `${event.title} (Meetup), ` + `hosted at ${event.location}`;
    case "webinar":
      return `${event.title} (Webinar), ` + `available online at ${event.url}`;
    case "hackathon":
      return `even that: ${event.title}`;
    default:
      throw neverError(
        "Not sure what to do with that",
        event // No complaints
      );
  }
}

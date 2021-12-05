/**
 * Both null and undefined denote the absence of a value.
undefined tells us that a variable or property has been
declared, but no value has been assigned. null , on the
other hand, is an empty value that can be assigned to clear a
variable or property.
Both values are known as bottom values, values that have
no actual value.
Both values are regularly part of each set of types.
 */
// Let's define a number variable
let age: number;
// I'm getting one year older!
age = age + 1; // strictNullChecks;

/* 
The result of this operation is NaN , because we are adding 1
to undefined . Technically, the result is again of type number ,
just not what we expected!


type Talk = {
  title: string;
  abstract: string;
  speaker: string;
}; */

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

function neverError(
  message: string,
  token: never // The culprit
) {
  return new Error(`${message}. ${token} should not exist`);
}

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

/*
We want to create an HTML representation of one of our events
and append it to a list of elements. We create a function that
runs over the common properties and returns a string:
*/
function getTeaserHTML(event: TechEvent) {
  return `<h2>${event.title}</h2>
<p>
${event.description}
</p>`;
}

function getTeaserListElement(event: TechEvent) {
  const content = getTeaserHTML(event);
  const element = document.createElement("li");
  element.classList.add("teaser-card");
  element.innerHTML = content;
  return element;
}

function appendEventToList(event: TechEvent) {
  const list = document.querySelector("#event-list");
  const element = getTeaserListElement(event);
  list?.append(element); // adding ? removes error strictNullChecks
}

/* 
And here’s the problem: we have to be very sure that an
element with the ID event-list exists in our HTML. Oth-
erwise document.querySelector returns null , and append-
ing the list will break the application.

We need a way to make sure that the result of 
document.querySelector is actually available and not null.

In your tsconfig.json we can activate the op-
tion strictNullChecks (which is part of strict mode). Once
we activate this option, all nullish values are excluded from
our types.

There are situations where we need to work with either
undefined or null .


type Talk = {
  title: string;
  speaker: string;
  abstract: string | undefined;
};*/

/* 
Another way to add undefined is to make properties of an
object optional. Optional properties have to be checked for
as well, but without us maintaining too many types.
*/

type Talk = {
  title: string;
  speaker: string;
  abstract?: string;
};

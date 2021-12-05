/* 

1. Users can be watching events they’re interested in.
They can keep up to date on speaker announcements
and more.

2. Users can be actively subscribed to events, meaning
that they either plan to attend or have already paid the
fee. For that, they responded to the event.

3. Users can have attended past events. They want to keep
track of video recordings, feedback, and slides.

4. Users can have signed out of events, meaning they
were either subscribed to an event but changed their
mind, or they just don’t want to see that event in their 
lists anymore. Our application keeps track of those
events as well.

*/

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

/* 
We want to give users the option to filter their events. First
by category: watching , rsvp , attended , and signedout ;
second – and optionally – by the kind of event: conference,
meetup, webinar, or hackathon.

The function we want to create accepts three arguments:
1. The userEventList we want to filter.
2. The category we want to select. This matches one of
the keys of the userEventList object.
3. Optionally, a string of the set EventKind that allows us
to filter even further.
*/

type UserEventCategory = "watching" | "rsvp" | "attended" | "signedoff";
type EventKind = TechEvent["kind"];
/*
function filterUserEvent(
  userEventList: UserEvents,
  category: UserEventCategory,
  filterKind?: EventKind
) {
  const filteredList = userEventList[category];
  if (filterKind) {
    return filteredList.filter((event) => event.kind === filterKind);
  }
  return filteredList;
} */

/* 
This works, but we face the same problems as we did in the
previous lesson: we’re maintaining types manually, which
is prone to errors and typos. Problems of that kind that are
hard to catch. Perhaps you didn’t notice I made a mistake
by using the value type signedoff in UserEventCategory ,
which isn’t a key in UserEvents . That would be signedout.
*/

/* 
We want to create types like this dynamically, and Type-
Script has an operator for that. With keyof we can get the
object keys of every type we define. And I mean every.
We can use keyof even with value types of the string
set and get all string functions. Or with an array and get
all array operators:
*/

// 'speaker' | 'title' | 'abstract'
type TalkProperties = keyof Talk;
// number | 'toString' | 'charAt' | ...
type StringKeys = keyof "speaker";
// number | 'length' | 'pop' | 'push' | ...
type ArrayKeys = keyof [];

/* 
The result is a union type of value types. We want the keys
of our UserEvents , so this is what we do:
*/

/*
function filterUserEvent(
  userEventList: UserEvents,
  category: keyof UserEvents,
  filterKind?: EventKind
) {
  const filteredList = userEventList[category];
  if (filterKind) {
    return filteredList.filter((event) => event.kind === filterKind);
  }
  return filteredList;
}*/

/* 
From both filter operations, the category filter is the prob-
lematic one, as it could access a key that is not available in
userEventList . To keep it type-safe for us, and more flexi-
ble to the outside, we accept that category is not a subset of
string, but the whole set of strings:
*/

/*
function filterUserEvent(
  userEventList: UserEvents,
  category: string,
  filterKind?: EventKind
) {
  const filteredList = userEventList[category];
  if (filterKind) {
    return filteredList.filter((event) => event.kind === filterKind);
  }
  return filteredList;
} */

/* 
But before we access the category, we want to check if this
is a valid key in our list


function isUserEventListCategory(list: UserEvents, category: string) {
  return Object.keys(list).includes(category);
}*/

// so

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

/* 
This is enough safety to not crash the program if we get
input that doesn’t work for us. But TypeScript (especially in
strict mode) is not happy with that. We lose all connections
to UserEvents , and category is still a string. On a type level,
how can we be sure that we access the right properties?
*/

/* Type predicates are a
way to add more information to control flow analysis. We
can extend the possibilities of narrowing down by telling
TypeScript that if we do a certain check, we can be sure our
variables are of a certain type: */

function isUserEventListCategory(
  list: UserEvents,
  category: string
): category is keyof UserEvents {
  // The type predicate;
  return Object.keys(list).includes(category);
}

/*
Type predicates work with functions that return a Bool-
ean. If this function evaluates to true, we can be sure that
category is a key of UserEvents . This means that in the
true branch of the if statement, TypeScript knows the type
better. We narrowed down the set of string to a smaller set
keyof UserEvents .
*/

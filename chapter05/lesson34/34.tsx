type VideoFormatURLs = {
  format360p: URL;
  format480p: URL;
  format720p: URL;
  format1080p: URL;
};

type SubtitleURLs = {
  english: URL;
  german: URL;
  french: URL;
};

type UserPreferences = {
  format: keyof VideoFormatURLs;
  subtitles: {
    active: boolean;
    language: keyof SubtitleURLs;
  };
  theme: "dark" | "light";
};
/*
const defaultUP: UserPreferences = {
  format: "format1080p",
  subtitles: {
    active: false,
    language: "english",
  },
  theme: "light",
};


function combinePreferences(
  defaultP: UserPreferences,
  userP: Partial<UserPreferences>
) {
  return { ...defaultP, ...userP };
}
*/

//const prefs = combinePreferences(defaultUP, { format: "format720p" });
/* 
This is the same as UserPreferences and what we expected.
With one argument being UserPreferences , and the other
being Partial<UserPreferences> , the combination of both
arguments should be the full UserPreferences type again.

Getting UserPreferences in return from combinePrefer-
ences is perfectly fine behavior and will make your app a lot
more type-safe than it was.

Let’s take this as an opportunity
to explore type annotations, type inference, and generic
type binding, and see their effects.

Our user’s preferences are a video format of 720p and a dark
theme. The corresponding object is:
*/

// combinePreferences(defaultUP, { format: "format720p", theme: "dark" });

/* When we assign this value to a variable, things are different.
const userSettings = {
  format: "format720p",
  theme: "dark",
}; */

// combinePreferences(defaultUP, userSettings);
/* 
The moment we assign this value to userSettings , Type-
Script infers its type to the most reasonably widest type. In
our case, strings.

This protects it from change in TypeScript and narrows the
assignment down to its value type, thus being compatible
with Partial<UserPreferences> as it is a subtype. The
other thing we could do is write a type annotation.

Annotations are a magical thing we can use
when our types are very narrow to not comply with prim-
itive types. Type annotations do a type check the moment
we assign a value.

userSettings will always be
Partial<UserPreferences> as long as the values we assign
pass the type check.
*/
const userSettings: Partial<UserPreferences> = {
  format: "format720p",
  theme: "dark",
};

combinePreferences(defaultUP, userSettings);

// The process of substituting a concrete type for a generic is called binding.
// This is combinePreferences with a generic type parameter.
/*
function combinePreferences<UserPref extends Partial<UserPreferences>>(
  defaultP: UserPreferences,
  userP: UserPref
) {
  return { ...defaultP, ...userP };
}
const prefs = combinePreferences(defaultUP, {
  format: "format720p",
  theme: "dark",
});
*/

/*
When we call combinePreferences with an annotated type
Partial<UserPreferences> , we substitute UserPref for its
supertype. We get the same behavior we had originally.

When we call combinePreferences with a literal or a vari-
able in const context, we bind the value type to UserPref .

1. { format: 'format720p', theme: 'dark' } is taken
as literal, therefore we look at the value type.

2. The value type { format: 'format720p', theme:
'dark' } is a subtype of Partial<UserPreferences> ,
so it type-checks.

3. We bind UserPref to { format: 'format720p',
theme: 'dark' } , which means we now work with
the value type, instead of Partial<UserPreferences> .
*/
prefs.theme; // is of type 'dark'
prefs.format; // is of type 'format720p'

/* 
This makes some checks in our code easier. Be careful,
though, with too many value types. If we take the same
pattern for the default preferences and pass a const context
object to it, we might get some unwanted side effects:
*/
function combinePreferences<
  Defaults extends UserPreferences,
  UserPref extends Partial<UserPreferences>
>(defaultP: Defaults, userP: UserPref) {
  return { ...defaultP, ...userP };
}
const defaultUP = {
  // wW know what we have here
} as const;

const prefs = combinePreferences(defaultUP, {
  format: "format720p",
  theme: "dark",
});

/* 
The intersection of two distinct value types always results
in never , which means that both theme and format become
unusable to us.
*/

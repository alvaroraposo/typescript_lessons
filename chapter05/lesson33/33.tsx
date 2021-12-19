/**
 * Our video application allows for signed-in users.
 * Once a user has signed in, they can define preferences on
 * how they want to consume their video content.
 * A simple type modeling user preferences can look like this:
 */
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

//To ensure all keys are set, we provide a set of default user preferences:
const defaultUP: UserPreferences = {
  format: "format1080p",
  subtitles: {
    active: false,
    language: "english",
  },
  theme: "light",
};

// defaultUP can change, and the moment we change it we want to validate it against UserPreferences.
const userPreferences = {
  format: "format720p",
};

/* To get to the full set of preferences, we merge our default
preferences with the user’s preferences in a function: 
function combinePreferences(defaultP, userP) {
  return { ...defaultP, ...userP };
}*/

// Now, let’s add types to this function. defaultP is easy to type:
function combinePreferences(defaultP: UserPreferences, userP: unknown) {
  return { ...defaultP, ...userP };
}

/* But how do we type userP ? We would need a type where
every key can be optional, something like this: */
type OptionalUserPreferences = {
  format?: keyof VideoFormatURLs;
  subtitles?: {
    active?: boolean;
    language?: keyof SubtitleURLs;
  };
  theme?: "dark" | "light";
};

/* But, of course, we don’t want to maintain that type our-
selves. Let’s create a helper type Optional that takes it for
us. This is a mapped type, where we modify the property
features so each key becomes optional: */
type Optional<Obj> = {
  [Key in keyof Obj]?: Obj[Key];
};

function combinePreferencesWithHelper(
  defaultP: UserPreferences,
  userP: Optional<UserPreferences>
) {
  return { ...defaultP, ...userP };
}

/* Now, we get extra autocomplete and type safety when using
combinePreferences.  */
// OK!
const prefs1 = combinePreferencesWithHelper(defaultUP, {
  format: "format720p",
});
// boom!
const prefs2 = combinePreferencesWithHelper(defaultUP, {
  format: "alvaro",
});

/* Optional<Obj> is a built-in type in TypeScript called
Partial<Obj> . It also has a reversed operation Required
<Obj> which makes all keys required by removing the
optional property modifier. It is defined as: 

type Required<Obj> = {
  [Key in Obj]-?: Obj[Key];
};


One thing we want to ensure is that defaultUP cannot
be changed from other parts of our software.

type Const<Obj> = {
  readonly [Key in Obj]: Obj[Key]; KEYOF!!!
};
*/

type Const<Obj> = {
  readonly [Key in keyof Obj]: Obj[Key];
};

const defaultUPConst: Const<UserPreferences> = {
  format: "format1080p",
  subtitles: {
    active: false,
    language: "english",
  },
  theme: "light",
};
defaultUPConst.format = "format720p";

function genDefaults(obj: UserPreferences) {
  return Object.freeze(obj);
}
const defaultUP2 = genDefaults({
  format: "format1080p",
  subtitles: {
    active: false,
    language: "english",
  },
  theme: "light",
});
// defaultUP is Readonly<UserPreferences>
defaultUP2.format = "format720p";

/* There’s one thing to keep in mind with Readonly and
Partial : our nested data structure. For example, this
call will cause some errors in TypeScript: */

const prefs = combinePreferencesWithHelper(defaultUP2, {
  subtitles: { language: "german" },
});

/**
 * TypeScript expects us to provide the full object for subtitles,
 * The call above would override our subtitles property and delete subtitles.active .
 *
 *
 * A similar problem pops up when we look at our default preferences.
 * Readonly only modifies the first level of properties,
 * which means that this call does not cause an error in TypeScript,
 * whereas it breaks once it runs in the browser:
 */

defaultUP.subtitles.language = "german";

/* To make sure our types are what we expect them to be, we
need helper types that go deeper than one level. 

type DeepReadonly<Obj> = {
  readonly [Key in keyof Obj]: DeepReadonly<Obj[Key]>; KEYOF!!!
};
*/

type DeepReadonly<Obj> = {
  readonly [Key in keyof Obj]: DeepReadonly<Obj[Key]>;
};

function genDefaultsDeepReadOnly(
  obj: UserPreferences
): DeepReadonly<UserPreferences> {
  return Object.freeze(obj);
}

/* As Readonly is a subtype of DeepReadonly , the narrower
return type of Object.freeze is compatible with the wider
return type we defined. The same can be done for partials: */
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

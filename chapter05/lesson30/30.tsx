/* type VideoFormatURLs = {
  format360p: URL;
  format480p: URL;
  format720p: URL;
  format1080p: URL;
}; */

declare const videos: VideoFormatURLs;

function isFormatAvailable(
  obj: VideoFormatURLs,
  key: string
): key is keyof VideoFormatURLs {
  return key in obj;
}

/*
function loadFormat(format: string): void {
  if (isFormatAvailable(videos, format)) {
    videos[format];
  }
}

type SubtitleURLs = {
  english: URL;
  german: URL;
  french: URL;
}; */

function isSubtitleAvailable(
  obj: SubtitleURLs,
  key: string
): key is keyof SubtitleURLs {
  return key in obj;
}

/** function isAvailable<Formats>(
  obj: Formats,
  key: string | number | symbol
): key is keyof Formats {
  return key in obj;
} */

async function randomNumber() {
  return Math.random();
}

let anArray: number[];
let anotherArray: Array<number>;
let aMixedArray: Array<number | string | boolean>;
/**
function isAvailable<FormatList>(
  obj: FormatList,
  key: string | number | symbol
): key is keyof FormatList {
  return key in obj;
}

 * This can lead to some undesired behavior, unfortunately.
Our isAvailable type from the last lesson works really well
with the object types we defined:
 */
declare const subtitles: SubtitleURLs;
// An object with video formats
declare const videoFormats: VideoFormatURLs;
/*
function loadFormat(format: string): void {
  if (isFormatAvailable(videos, format)) {
    videos[format];
  }
  if (isAvailable(videoFormats, format)) {
    // Inferred type 'VideoFormatURLs'
    // format is now keyof VideoFormatURLs
  }
  // An object with video formats
  if (isAvailable(subtitles, language)) {
    // Inferred type 'SubtitleURLs'
    // language is now keyof SubtitleURls
  }

  if (isAvailable({ name: "Stefan", age: 38 }, key)) {
    // key is now “name” | “age”
  }

  if (isAvailable("A string", "length")) {
    // Also strings have methods,
    // like length, indexOf, ...
  }
  if (isAvailable(1337, aKey)) {
    // Also numbers have methods
    // aKey is now everything number has to offer
  }
}*/

/**
 * While this is cool, as it makes our types even more com-
patible, it can lead to undesired behavior if we only want to
check objects. Thankfully,

However, there’s the possibility to define boundaries, or
subsets of the type space. This makes generic type param-
eters a little bit narrower before they’re substituted by real
types.

To define generic subsets, TypeScript uses the extends
keyword.
 */

function isAvailable<FormatList extends object>(
  obj: FormatList,
  key: string
): key is keyof FormatList {
  return key in obj;
}

// Red squigglies where they are supposed to be.
function loadFormat(format: string): void {
  if (isAvailable("A string", "length")) {
  }
}

/** 
 * Let’s define a function that loads a file, either a video in
a specific format, or a subtitle in a specific language.
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

/**
 * We would need a constraint to ensure that we only pass
compatible objects, where we don’t know the properties
themselves, but only know that every property is of type URL .
 */
type PossibleKeys = "meetup" | "conference" | "hackathon" | "webinar";
type Groups = {
  [k in PossibleKeys]: any;
};

/**
 * Index types don’t define specific property keys. They just
define a set of keys they iterate over. We can also accept the
entire set of strings as keys.
 */
type AnyObject = {
  [k: string]: any;
};

/**
 * Now that we accept all property keys of type string , we can
explicitly say that the type of each property needs to be URL :
 
type URLList = {
  [k: string]: URL;
};*/

/**
 * A perfect shape that includes VideoFormatURLs as well as
SubtitleURLs . And basically any other list of URLs! There-
fore, also a perfect constraint for our generic type parameter
 */
type URLList = {
  [k: string]: URL;
};
function loadFile<Formats extends URLList>(
  fileFormats: Formats,
  format: string
) {
  // The real work ahead
}
/**
 * With that, every object we pass that doesn’t give an object
with URLs is going to create beautiful, red, squiggly lines
in our editor.
 */

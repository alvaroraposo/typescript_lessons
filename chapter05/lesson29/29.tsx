// Consider the following data structure for a video that exists
// in different formats:

type VideoFormatURLs = {
  format360p: URL;
  format480p: URL;
  format720p: URL;
  format1080p: URL;
};

/**
 * We want to
provide an API where developers can load a specific format
(using declare statements for brevity):
 */

declare const videos: VideoFormatURLs;
// declare function loadFormat(format: string): void;

/** To make sure the incoming format is a valid key in our data
structure, we create a utility function with a type predicate */
function isFormatAvailable(
  obj: VideoFormatURLs,
  key: string
): key is keyof VideoFormatURLs {
  return key in obj;
}

function loadFormat(format: string): void {
  if (isFormatAvailable(videos, format)) {
    // format is now “format360p” | “format480p” |
    // “format720p” | “format1080p”
    // and index accessing perfectly works:
    videos[format];
  }
}

type SubtitleURLs = {
  english: URL;
  german: URL;
  french: URL;
};

// Wait a minute. This is exactly the same function!
function isSubtitleAvailable(
  obj: SubtitleURLs,
  key: string
): key is keyof SubtitleURLs {
  return key in obj;
}

/* the way we would in JavaScript
function isAvailable(obj, key) {
  return key in obj;
} */

/**
 * Generics is a style of computer programming in which
algorithms are written in terms of types to-be-specified-later 
that are then instantiated when needed for specific types provided as
parameters.

angle brackets <>
 
function isAvailable<Formats>(obj, key) {
  return key in obj;
}*/

/**
 * we can use this type parameter with regular types within our function declaration:
 
function isAvailable<Formats>(obj: Formats, key): key is keyof Formats {
  return key in obj;
}*/

/**
 * If we want to type key – which is now implicitly any – we
would need to use a wider set of possible key types:
 */
function isAvailable<Formats>(
  obj: Formats,
  key: string | number | symbol
): key is keyof Formats {
  return key in obj;
}

/** 
 * First, we can explicitly annotate the type
we want to substitute:
 
if (isFormatAvailable<VideoFormatURLs>(videos, format)) {
  // ...
}*/

/** 
 * However, it’s much more interesting and powerful when
we use type inference to substitute our type parameter.
 

// An object with video formats
declare const videoFormats: VideoFormatURLs;
if (isAvailable(videoFormats, format)) {
  // Inferred type 'VideoFormatURLs'
  // format is now keyof VideoFormatURLs
}
// An object with video formats
declare const subtitles: SubtitleURLs;
if (isAvailable(subtitles, language)) {
  // Inferred type 'SubtitleURLs'
  // language is now keyof SubtitleURls
}

This is just writing JavaScript!!!!
*/

//Promise is a generic type
// randomNumber returns a Promise<number>
async function randomNumber() {
  return Math.random();
}

let anArray: number[];
let anotherArray: Array<number>;

/* 
Both do the same thing. You might find it a bit more
convenient, however, to use the generic type when you
deal with union types:
*/
let aMixedArray: Array<number | string | boolean>;

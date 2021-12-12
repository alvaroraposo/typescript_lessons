// declare const videos: VideoFormatURLs;

function isFormatAvailable(
  obj: VideoFormatURLs,
  key: string
): key is keyof VideoFormatURLs {
  return key in obj;
}

function isSubtitleAvailable(
  obj: SubtitleURLs,
  key: string
): key is keyof SubtitleURLs {
  return key in obj;
}

async function randomNumber() {
  return Math.random();
}

let anArray: number[];
let anotherArray: Array<number>;
let aMixedArray: Array<number | string | boolean>;

declare const subtitles: SubtitleURLs;
declare const videoFormats: VideoFormatURLs;

function isAvailable<FormatList extends object>(
  obj: FormatList,
  key: string
): key is keyof FormatList {
  return key in obj;
}

function loadFormat(format: string): void {
  if (isAvailable("A string", "length")) {
  }
}

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

type PossibleKeys = "meetup" | "conference" | "hackathon" | "webinar";
type Groups = {
  [k in PossibleKeys]: any;
};

type AnyObject = {
  [k: string]: any;
};

type URLList = {
  [k: string]: URL;
};
/* function loadFile<Formats extends URLList>(
  fileFormats: Formats,
  format: string
) {
  // The real work ahead
} */

/**
 * However, when we select the right format, we still can
pass every string to the function, even though the format
might not exist.
 */
declare const videos: VideoFormatURLs;
// loadFile(videos, "format4k");
// 4K not available
// TypeScript doesn't squiggle

// In a non-generic world, we would do something like this:
function loadVideoFormat(
  fileFormats: VideoFormatURLs,
  format: keyof VideoFormatURLs
) {
  // You know
}
/*type URLObject = {
  [k: string]: URL;
};
function loadFile<Formats extends URLObject>(
  fileFormats: Formats,
  format: keyof Formats
) {
  // The real work ahead
}

loadFile(videos, "format4k"); // !!!*/

/**
 * We access the URL, fetch some data from it,
 * and return an object that tells us what format
 * we loaded, and if loading was successful.
 
async function loadFile<Formats extends URLObject>(
  fileFormats: Formats,
  format: keyof Formats
) {
  // Fetch the data
  const data = await fetch(fileFormats[format].href);
  return {
    // Return the format
    format,
    // and see if we get an OK response
    loaded: data.status === 200,
  };
}*/

/**
 * Why can’t result be of type { format: "format1080p", loading: boolean } ?
 
async function loadFile<Formats extends URLObject, Key extends keyof Formats>(
  fileFormats: Formats,
  format: Key
) {
  const data = await fetch(fileFormats[format].href);
  return {
    format,
    loaded: data.status === 200,
  };
}*/

loadFile(videos, "format1080p"); // thumbs up!

loadFile(videos, "format1080p"); // OK!

/**
 * To make sure that we’re also implementing the right thing,
we define a return type for the loadFile function where we
expect the Key type to appear.
 */

type URLObject = {
  [k: string]: URL;
};
type Loaded<Key> = {
  format: Key;
  loaded: boolean;
};

/**
 * To make sure that we’re also implementing the right thing,
we define a return type for the loadFile function where we
expect the Key type to appear.
 */
async function loadFile<Formats extends URLObject, Key extends keyof Formats>(
  fileFormats: Formats,
  format: Key
): Promise<Loaded<Key>> {
  const data = await fetch(fileFormats[format].href);
  return {
    format,
    loaded: data.status === 200,
  };
}

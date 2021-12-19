/* 
In the last lesson of this chapter we want to show videos
inside a video element. To make it easier for ourselves and
our co-workers, we decide to abstract handling with the
DOM, and we choose to use classes for this.
The class should behave like this:

1. We can instantiate as many as we like and pass our
user preferences to it. The user preferences are impor-
tant to select the right video format URL.

2. We can attach any HTML element to it. If it’s a video
element, we load the video source directly. If it’s any oth-
er element, we use it as a wrapper for a newly created
video element. video elements are the default, though.

3. The element is not required for instantiation; we can
set it at a later stage. This means the element can be
undefined at the moment we load a video.

First, we create a helper type Nullable that adds undefined
in a union. This makes reading field types of classes much
easier.
*/
type Nullable<G> = G | undefined;

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
Next, we start with the class. We set the type of the element to
HTMLElement as this is the supertype of all HTML elements.

class Container {
  #element: Nullable<HTMLElement>;
  #prefs: UserPreferences;
  // We only require the user preferences
  // to be set at instantiation
  constructor(prefs: UserPreferences) {
    this.#prefs = prefs;
  }
  // We can set the element to an HTML element
  set element(value: Nullable<HTMLElement>) {
    this.#element = value;
  }
  get element(): Nullable<HTMLElement> {
    return this.#element;
  }

  // We load the video inside a video element.
  // If #element isn't an HTMLVideoElement, we
  // create one and append it to #element
  loadVideo(formats: VideoFormatURLs) {
    const selectedFormat = formats[this.#prefs.format].href;
    if (this.#element instanceof HTMLVideoElement) {
      this.#element.src = selectedFormat;
    } else if (this.#element) {
      const vid = document.createElement("video");
      this.#element.appendChild(vid);
      vid.src = selectedFormat;
    }
  }
}*/

/* And this already works wonderfully:
const container = new Container(userPrefs);
container.element = document.createElement("video");
container.loadVideo(videos);

HTMLElement can be way too generic for some tastes. Espe-
cially when we deal with videos, we might want to work
with the video functions of HTMLVideoElement . And when
working with that, we need the right type information.

Generics can help. We can pinpoint the exact type we are
dealing with, and with type constraints we can make sure
it’s an extension of our supertype HTMLElement .

class Container<GElement extends HTMLElement> {
  #element: Nullable<GElement>;
  #prefs: UserPreferences;
  // We only require the user preferences
  // to be set at instantiation
  constructor(prefs: UserPreferences) {
    this.#prefs = prefs;
  }

  set element(value: Nullable<GElement>) {
    this.#element = value;
  }
  get element(): Nullable<GElement> {
    return this.#element;
  }
  // ...abridged...
  loadVideo(formats: VideoFormatURLs) {
    const selectedFormat = formats[this.#prefs.format].href;
    if (this.#element instanceof HTMLVideoElement) {
      this.#element.src = selectedFormat;
    } else if (this.#element) {
      const vid = document.createElement("video");
      this.#element.appendChild(vid);
      vid.src = selectedFormat;
    }
  }
}*/

/*
// container accepts any HTML element
const container = new Container(userPrefs);
// container accepts HTMLVideoElement
const vidcontainer = new Container<HTMLVideoElement>(userPrefs);

This is where generic default parameters come in. If we don’t pro-
vide a generic annotation, TypeScript will use the default
parameter as type.
*/
class Container<GElement extends HTMLElement = HTMLVideoElement> {
  #element: Nullable<GElement>;
  #prefs: UserPreferences;
  // We only require the user preferences
  // to be set at instantiation
  constructor(prefs: UserPreferences) {
    this.#prefs = prefs;
  }

  set element(value: Nullable<GElement>) {
    this.#element = value;
  }
  get element(): Nullable<GElement> {
    return this.#element;
  }
  // ...abridged...
  loadVideo(formats: VideoFormatURLs) {
    const selectedFormat = formats[this.#prefs.format].href;
    if (this.#element instanceof HTMLVideoElement) {
      this.#element.src = selectedFormat;
    } else if (this.#element) {
      const vid = document.createElement("video");
      this.#element.appendChild(vid);
      vid.src = selectedFormat;
    }
  }
}
// container accepts HTMLVideoElement
// const container = new Container(userPrefs);

/* 
While generic default parameters can be extremely pow-
erful, we also have to be very cautious. Take this function
that does something similar to the Container class. It
loads a video in an element, and differentiates between
the following cases:

1. If we don’t provide an element, we create a video
element
2. If we provide a video element, we load the video in
this element
3. If we provide any other element, we use this as a wrap-
per for a new video element.

The function returns the element we passed as an argu-
ment for further operations. With generic default parame-
ters we can beautifully define this behavior, and rely only
on type inference:
*/
declare function createVid<GElement extends HTMLElement = HTMLVideoElement>(
  prefs: UserPreferences,
  formats: VideoFormatURLs,
  element?: GElement
);

declare const userPrefs: UserPreferences;
declare const formats: VideoFormatURLs;
// a is HTMLVideoElement, the default!
const a = createVid(userPrefs, formats);
// b is HTMLDivElement
const b = createVid(userPrefs, formats, document.createElement("div"));
// c is HTMLVideoElement
const c = createVid(userPrefs, formats, document.createElement("video"));

/* 
However, this only works when we rely solely on type infer-
ence. Generics also allow us to bind the type explicitly.
*/
const d = createVid<HTMLAudioElement>(userPrefs, formats);

/* 
d is of type HTMLAudioElement , even though our imple-
mentation will return an HTMLVideoElement . Also, since
we are on the type level, the implementation has no clue
that we want to have an HTMLAudioElement . That’s why we
need to be cautious when we use generic default parame-
ters. Also, we have a much better tool for cases like that, as
we will see in the next chapter.
*/

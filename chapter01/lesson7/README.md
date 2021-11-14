npm install -g typescript
===> yarn global add typescript doesn't make tsc global
With that, we get a tool called tsc, the TypeScript compiler
with tsc, we can also type-check our JavaScript programs
outside of any editor.

Now the TypeScript compiler is configured, it’s time to type-
check. Let’s run the following command in our terminal:
tsc --noEmit

TypeScript reruns type-checking every time you save a file.
tsc --noEmit --watch

The TypeScript playground is located at typescriptlang.org/
play and offers an online IDE that allows you to experiment
with types.
Lots of examples in both JavaScript and TypeScript so
you can dig deeper into the possibilities that the type
system has to offer.
An editor for tsconfig.json, allowing you to set all
compiler flags and get information on possible values.

The ideal place to experiment and work on more complex types before I add them to a project.
The possibility of isolating declarations and types without
any interference from the rest of the project is the ideal
scenario for focus.

/*
• mapped types
• conditional types
• String and Number constructors
• control flow analysis

Dynamic Definitions

We want to provide a helper function for our colleagues so
they can define a service and its service methods through a
JavaScript object that looks a little like a type; for example, a
service definition for opening, closing, and writing to files.
*/
const serviceDefinition = {
  open: { filename: String },
  insert: { pos: Number, text: String },
  delete: { pos: Number, len: Number },
  close: {},
};

/*
The service definition object describes a list of method
definitions. Each property of the service definition is a
method. Each method definition defines a payload and
the accompanying type.

We use capital Number and capital String here, constructor
functions in JavaScript that create values of type number
or string respectively. These are not TypeScript types! But
they look awfully similar.

The goal is to have a function, createService , where we
pass two things:

3. The service definition, in the format we
described above.
4. A request handler. This is a function that receives
messages and payloads, and is implemented by the
users of this function; for example, for the service
definition above we expect to get a message open with
a payload filename , where the file name is a string

In return, we get a service object. This service object expos-
es methods (open, insert, delete, and close, according to the
service definition) that allow for a certain payload (defined
in the service definition). Once we call a method, we set up a
request object that is handled by the request handler.

declare function createService<S extends ServiceDefinition>(
  serviceDef: S,
  handler: RequestHandler<S>
): ServiceObject<S>;*/

// A service definition has keys we don't know
// yet and lots of method definitions
type ServiceDefinition = {
  [x: string]: MethodDefinition;
};

// This is the payload of each method:
// a key we don't know, and either a string or
// a number constructor (the capital String, Number)
type MethodDefinition = {
  [x: string]: StringConstructor | NumberConstructor;
};

/*
This allows for objects with every possible string key. The
moment we bind a concrete service definition to the generic
variable, the keys become defined, and we work with the
narrowed-down type. Next, we work on the second argu-
ment, the request handler. The request handler is a func-
tion with one argument, the request object. It returns a
Boolean if the execution was successful.
*/
type RequestHandler<T extends ServiceDefinition> = (
  req: RequestObject<T>
) => boolean;

/* 
The Request Object

The request object is defined by the service definition we
pass. It’s an object where each key of the service definition
becomes a message. The object after the key of the service
definition becomes the payload.
*/
type RequestObject<T extends ServiceDefinition> = {
  [P in keyof T]: {
    message: P;
    payload: RequestPayload<T[P]>;
  };
}[keyof T];

/*
With the index access type to keyof T , we create a union
out of an object that would contain every key.

The request payload is defined by the object of each key in
the service definition:
*/
type RequestPayload<T extends MethodDefinition> =
  // Is it an empty object?
  {} extends T
    ? // Then we don't have a payload
      undefined
    : // Otherwise we have the same keys, and get the
      // type from the constructor function
      { [P in keyof T]: TypeFromConstructor<T[P]> };
type TypeFromConstructor<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : any;

/*
For the service definition we described earlier, the generated
type looks like this:

{
    req: {
    message: “open”;
    payload: {
    filename: string;
    };
} | {
        message: “insert”;
        payload: {
        pos: number;
        text: string;
    };
} | {
        message: “delete”;
        payload: {
        pos: number;
        len: number;
    };
} | {
        message: “close”;
        payload: undefined;
    }
}

The Service Object

Last, but not least, we type the service object, the return val-
ue. For each entry in the service definition, it creates some
service methods.
*/
type ServiceObject<T extends ServiceDefinition> = {
  [P in keyof T]: ServiceMethod<T[P]>;
};

/*
Each service method takes a payload defined in the object
after each key in the service definition.
*/
type ServiceMethod<T extends MethodDefinition> =
  // The empty object?
  {} extends T
    ? // No arguments!
      () => boolean
    : // Otherwise, it's the payload we already
      // defined
      (payload: RequestPayload<T>) => boolean;

// Implementing createService
function createService<S extends ServiceDefinition>(
  serviceDef: S,
  handler: RequestHandler<S>
): ServiceObject<S> {
  const service: Record<string, Function> = {};
  for (const name in serviceDef) {
    service[name] = (payload: any) =>
      handler({
        message: name,
        payload,
      });
  }
  return service as ServiceObject<S>;
}

/*
Note that we allow ourselves a little type cast at the end to
make sure the very generic creation of a new object is type-
safe. This is how our service definition looks in action:
*/
const service = createService(serviceDefinition, (req) => {
  // req is now perfectly typed and we know
  // which messages we are able to get
  switch (req.message) {
    case "open":
      // Do something
      break;
    case "insert":
      // Do something
      break;
    default:
      // Due to control flow anaysis, this
      // message now can only be close or
      // delete.
      // We can narrow this down until we
      // reach never
      break;
  }
  return true;
});
// We get full autocomplete for all available
// methods, and know which payload to
// expect
service.open({ filename: "text.txt" });
// Even if we don't have a payload
service.close();

/* 
We wrote around 25 lines of type definitions and a few
implementation details, and our colleagues will be able to
write custom services that are completely type-safe. Take
any other service definition and play around yourself!
*/

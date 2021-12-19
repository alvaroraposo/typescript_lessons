Recap
Generics allow us to prepare for types we don’t know up
front. This allows us to design robust APIs with better type
information, and make sure that we only pass values where
our types match certain criteria.

1. With generics we made sure that we don’t have to create
   more functions just to please the type system. Generics
   allow us to generalize functions for broader usage.
2. Generic constraints allow us to create boundaries.
   Instead of accepting anything for our generic types, we
   are allowed to set some criteria, such as the existence
   of certain keys or types of properties.
3. Generics also allow us to work better with object
   keys. Depending on what we pass as an argument to a
   function, we can infer the right keys and let TypeScript
   throw red squigglies at us if we don’t provide the cor-
   rect arguments.
4. Generics work extraordinarily well with mapped
   types. Through maps of union keys, index access types,
   and the Record helper, we are able to create a type that
   allows us to split an object type into a set of unions.
5. Mapped type modifiers allow us to copy an object type,
   but set all properties as optional, required, or read-only.
6. We learned a lot about binding generics. The moment
   we substitute a generic type for a real one is crucial to
   understand the TypeScript type system.
7. We also saw how generic classes work, and how we use
   generic type defaults to make our life a little bit easier.

Working with generics is key to getting the most out of
TypeScript’s type system. Generics were designed to con-
form to the majority of real-world JavaScript scenarios, and
open doors to even better and more robust type information.
The next chapter will take us even further!

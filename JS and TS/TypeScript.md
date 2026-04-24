# Everything I Know About TypeScript

**Started:** _October 16th, 2025_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

## TypeScript as a Superset of JavaScript

TypeScript is a syntactic superset of JavaScript which adds **static typing**. TypeScript uses compile time type checking. Which means it checks if the specified types match before running the code, not while running the code. TypeScript will try to infer as much of the type information as it can in order to give you type safety with minimal cost of productivity during code development. However, you can use annotations to:

1. Help along the compiler, and more importantly document stuff for the next developer who has to read your code (that might be future you!).
2. Enforce that what the compiler sees, is what you thought it should see. That is your understanding of the code matches an algorithmic analysis of the code (done by the compiler).

```ts
var foo: number = 123; //Specifies the data type of "number"
```

TypeScript is a superset of JavaScript. Just with documentation that can actually be used by compilers / IDEs.

Semicolons are optional in TypeScript.
**Functions** can be written like:

```ts
function nameOfFunction(
  parameter1: dataType,
  parameter2: dataType,
): returnDataType {
  //do something
}
```

If our function does not return any value, we can specify `void` as the return data type:

```ts
function nameOfFunction(parameter1: dataType, parameter2: dataType): void {
  //do something
}
```

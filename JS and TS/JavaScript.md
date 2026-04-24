# Everything I Know About JavaScript

**Started:** _October 16th, 2025_

**Note:** This section compiles different lessons and courses I'm taking to develop this project. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [The Modern JavaScript Tutorial](https://javascript.info/)

**Table of Contents**

- [Everything I Know About JavaScript](#everything-i-know-about-javascript)
- [JavaScript Fundamentals](#javascript-fundamentals)
  - [What CAN’T in-browser JavaScript do?](#what-cant-in-browser-javascript-do)
  - [JavaScript Variables](#javascript-variables)
  - [JavaScript Data Types](#javascript-data-types)
    - [Data Type Conversions](#data-type-conversions)
  - [Basic Operators](#basic-operators)
    - [Operator Precedence](#operator-precedence)
    - [Increment/decrement](#incrementdecrement)
    - [Comparisons](#comparisons)
  - [Conditional Branching: if, '?'](#conditional-branching-if-)
    - [`if`, `else`, and `else if` Statements](#if-else-and-else-if-statements)
    - [Conditional Operator `?` for Assigning Variables](#conditional-operator--for-assigning-variables)
  - [Logical Operators](#logical-operators)
  - [Loops: `while` and `for`](#loops-while-and-for)
  - [The `switch` Statement](#the-switch-statement)
  - [Functions in JavaScript](#functions-in-javascript)
    - [Default Parameters](#default-parameters)
    - [Returning a Value](#returning-a-value)
    - [Naming a function](#naming-a-function)
    - [Function Declaration vs. Function Expression](#function-declaration-vs-function-expression)
    - [Callback Functions](#callback-functions)
    - [Arrow Functions](#arrow-functions)
    - [Recap](#recap)
  - [Code Quality in JavaScript](#code-quality-in-javascript)
  - [Objects in JavaScript](#objects-in-javascript)
    - [Computed Properties](#computed-properties)
    - [Property Naming](#property-naming)
    - [The `for...in` loop](#the-forin-loop)
    - [Objects in JavaScript Summary](#objects-in-javascript-summary)

# JavaScript Fundamentals

JavaScript was initially created to “make web pages alive”. The programs in this language are called scripts. They can be written right in a web page’s HTML and run automatically as the page loads. Scripts are provided and executed as plain text. They don’t need special preparation or compilation to run. Today, JavaScript can execute not only in the browser, but also on the server, or actually on any device that has a special program called the JavaScript engine. An engine reads (parses) scripts, converts (compiles) it into machine code, and the machine code runs. Different engines have different “codenames”. For example:

- V8 – in Chrome, Opera and Edge.
- SpiderMonkey – in Firefox.
- …There are other codenames like “Chakra” for IE, “JavaScriptCore”, “Nitro” and “SquirrelFish” for Safari, etc.

In-browser JavaScript can do everything related to webpage manipulation, interaction with the user, and the webserver. For instance, in-browser JavaScript is able to:

- Add new HTML to the page, change the existing content, modify styles.
- React to user actions, run on mouse clicks, pointer movements, key presses.
- Send requests over the network to remote servers, download and upload files (so-called AJAX: "asynchronous JavaScript and XML" and COMET technologies).
- Get and set cookies, ask questions to the visitor, show messages.
- Remember the data on the client-side (“local storage”).

## What CAN’T in-browser JavaScript do?

- JavaScript on a webpage may not read/write arbitrary files on the hard disk, copy them or execute programs. It has no direct access to OS functions.
  Modern browsers allow it to work with files, but the access is limited and only provided if the user does certain actions, like “dropping” a file into a browser window or selecting it via an `<input>` tag.
  There are ways to interact with the camera/microphone and other devices, but they require a user’s explicit permission. So a JavaScript-enabled page may not sneakily enable a web-camera, observe the surroundings and send the information to the NSA.
- Different tabs/windows generally do not know about each other. Sometimes they do, for example when one window uses JavaScript to open the other one. But even in this case, JavaScript from one page may not access the other page if they come from different sites (from a different domain, protocol or port).
  This is called the “Same Origin Policy”. To work around that, both pages must agree for data exchange and must contain special JavaScript code that handles it.
- This limitation is, again, for the user’s safety. A page from `http://anysite.com` which a user has opened must not be able to access another browser tab with the URL `http://gmail.com`, for example, and steal information from there.
- JavaScript can easily communicate over the net to the server where the current page came from. But its ability to receive data from other sites/domains is crippled. Though possible, it requires explicit agreement (expressed in HTTP headers) from the remote side. Once again, that’s a safety limitation.

## JavaScript Variables

A semicolon may be omitted in most cases when a line break exists. It is **possible** to leave out semicolons most of the time. But it’s **safer** – especially for a beginner – to use them.

`let` – is a modern variable declaration.
`var` – is an old-school variable declaration. Normally we don’t use it at all, found only in legacy code.
`const` – is like `let`, but the value of the variable can’t be changed.

To create a variable in JavaScript, use the `let` keyword. We can put some data into it by using the assignment operator `=`.

```js
let message; //Or let message = "Hello!";
message = "Hello!";
```

The `var` declaration is similar to `let`. Most of the time we can replace `let` by `var` or vice-versa and expect things to work. But internally `var` is a very different beast, that originates from very old times. It’s generally **not used in modern scripts**, but still lurks in the old ones. There are two main differences of `var` compared to `let`/`const`:

- `var` variables have no block scope, their visibility is scoped to current function, or global, if declared outside function.
- `var` declarations are processed at function start (script start for globals).

We can also declare two variables and copy data from one into the other.

```js
let hello = "Hello world!";

let message;

// copy 'Hello world' from hello into message
message = hello;

// now two variables hold the same data
alert(hello); // Hello world!
alert(message); // Hello world!
```

A variable should be declared only once. A repeated declaration of the same variable is an error:

```js
let message = "This";

// repeated 'let' leads to an error
let message = "That"; // SyntaxError: 'message' has already been declared
```

So, we should declare a variable once and then refer to it without `let`.

**Variable naming in JavaScript:**

1. The name must contain only letters, digits, or the symbols `$` and `_`.
2. The first character must not be a digit.
3. camelCase is commonly used.
4. Case matters. `apple` and `APPLE` are different variables.
5. List of some reserved words: `let`, `class`, `return`, and `function`

To declare a **constant** (unchanging) variable, use `const` instead of `let`. Variables declared using `const` are called “constants”. They cannot be reassigned. An attempt to do so would cause an error. There is a widespread practice to use constants as aliases for difficult-to-remember values that are known before execution. Such constants are named using capital letters and underscores, such as `const COLOR_RED = "#F00"`.

**When should we use capitals for a constant and when should we name it normally?** Let’s make that clear. Being a “constant” just means that a variable’s value never changes. But some constants are known **before execution** (like a hexadecimal value for red) and some constants are calculated in run-time, **during the execution**, but do not change after their initial assignment. These constants should be named normally. In other words, capital-named constants are only used as aliases for “hard-coded” values.

## JavaScript Data Types

There are **8 basic data types** in JavaScript.
Seven **primitive** data types (contain only one thing):

- `number` for numbers of any kind: integer or floating-point, integers are limited by ±(253-1).
  - `Infinity` is a special value that's greater than any number.
  - `Nan` (not a number) represents a computational error. It is a result of an incorrect or an undefined mathematical operation.
- `bigint` for integer numbers of arbitrary length.
  - A `BigInt` value is created by appending `n` to the end of an integer like `const bigInt = 1234567890123456789012345678901234567890n;`.
- `string` for strings. A string in JavaScript must be surrounded by quotes.
  - A string may have zero or more characters, there’s no **separate single-character type**
  - Double ("") and single ('') quotes are “simple” quotes. There’s practically no difference between them in JavaScript.
  - **Backticks** are “extended functionality” quotes. They allow us to embed variables and expressions into a string by wrapping them in `${…}`, for example: ``alert( `Hello, ${name}!` );``
- `boolean` for true/false.
- `null` for unknown values – a standalone type that has a single value `null`. In JavaScript, `null` is not a “reference to a non-existing object” or a “null pointer” like in some other languages. It’s just a special value which represents “nothing”, “empty” or “value unknown”.
- `undefined` for unassigned values – a standalone type that has a single value `undefined`. The meaning of `undefined` is “value is not assigned”.
  Normally, one uses `null` to assign an “empty” or “unknown” value to a variable, while `undefined` is reserved as a default initial value for unassigned things.
- `symbol` for unique identifiers.
  And one **non-primitive** data type (contain multiple things):
- `object` for more complex data structures. All other types are called “primitive” because their values can contain only a single thing. In contrast, `objects` are used to store collections of data and more complex entities.

The `typeof` operator allows us to see which type is stored in a variable.

- Usually used as `typeof x`, but `typeof(x)` is also possible.
- Returns a `string` with the name of the type, like `"string"`.
- For `null` returns` "object"` – this is an error in the language, it’s not actually an object.

### Data Type Conversions

Most of the time, operators and functions automatically convert the values given to them to the right type. For example, `alert` automatically converts any value to a string to show it. Mathematical operations convert values to numbers. There are also cases when we need to explicitly convert a value to the expected type.

**String conversion** happens when we need the string form of a value. We can call the `String(value)` function to convert a value to a string like `let value = true; value = String(value)`.

**Numeric conversion** in mathematical functions and expressions happens automatically. For example, when division `/` is applied to non-numbers: `alert( "6" / "2" ); // 3, strings are converted to numbers`. We can use the `Number(value)` function to explicitly convert a value to a number. Explicit conversion is usually required when we read a value from a string-based source like a text form but expect a number to be entered. Numeric conversion rules:

- `undefined` --> `NaN`
- `null` --> 0
- `true` and `false` --> 1 and 0
- `string` --> Whitespaces (includes spaces, tabs \t, newlines \n etc.) from the start and end are removed. If the remaining string is empty, the result is 0. Otherwise, the number is “read” from the string. An error gives NaN.

**Boolean conversion** can be performed by writing `Boolean(value)`. Values that are intuitively “empty”, like 0, an empty string, `null`, `undefined`, and `NaN`, become `false`. Other values become `true`. In JavaScript, a non-empty string is always `true`. `"0"` and space-only strings like `" "` are `true` as a boolean.

## Basic Operators

An **operand** – is what **operators** are applied to. For instance, in the multiplication of `5 * 2` there are two operands: the left operand is `5` and the right operand is `2`. Sometimes, people call these “arguments” instead of “operands”.

An **operator** is **unary** if it has a single operand. For example, the unary negation `-` reverses the sign of a number (`x = -x`). An operator is **binary** if it has two operands. The same minus exists in binary form as well: `alert( y - x );`.

The following **math operations** are supported:

- Addition `+`: Usually, the plus operator `+` sums numbers. But, if the binary `+` is applied to strings, it merges (concatenates) them like `let s = "my" + "string"; //s = "mystring"`. Note that if any of the operands is a string, then the other one is converted to a string too like `let result = 2 + '1'; // "21"`. However, operators work one after another, so `let result = 1 + 2 + '3'; //"33"`, and not `"123"`. But if the string is positioned at the beginning, the compiler treats the other operands as a string like `let result = "1" + 2 + 3//"123"`. The binary `+` is the **only operator that supports strings** in such a way. Other arithmetic operators work only with numbers and always convert their operands to numbers.
  - The **unary plus** or, in other words, the plus operator `+` applied to a single value, doesn’t do anything to numbers. But if the operand is not a number, the unary plus converts it into a number like `alert( +true ); // 1` or `alert( +"" ); // 0`. It actually does the same thing as `Number(...)`, but is shorter.
- Subtraction `-`
- Multiplication `*`
- Division `/`
- Remainder `%`: The result of `a % b` is the remainder of the integer division of `a` by `b`.
- Exponentiation `**`: The exponentiation operator `a ** b` raises `a` to the power of `b`.

### Operator Precedence

All operators return a value. If an expression has more than one operator, the execution order is defined by their **precedence**, or, in other words, the default priority order of operators. There are many operators in JavaScript. Every operator has a corresponding precedence number. The one with the larger number executes first. If the precedence is the same, the execution order is from left to right. Note that unary operators are **higher** than corresponding binary ones.

Let’s note that an assignment `=` is also an operator that returns a value. It is listed in the precedence table with the very low priority of 2. That’s why, when we assign a variable, like `x = 2 * 2 + 1`, the calculations are done first and then the `=` is evaluated, storing the result in `x`.
**Chained assignments** evaluate from **right** to **left**. In `a = b = c = 2 + 2;`, the rightmost expression `2 + 2` is evaluated and then assigned to the variables on the left: `c`, `b` and `a`. At the end, all the variables share a single value.

We often need to apply an operator to a variable and store the new result in that same variable. We can use `+=` and `*=`:

```js
let n = 2;
n += 5; // now n = 7 (same as n = n + 5)
n *= 2; // now n = 14 (same as n = n * 2)

alert(n); // 14
```

Short “modify-and-assign” operators exist for all arithmetical and bitwise operators: `/=`, `-=`, etc. Such operators have the same precedence as a normal assignment, so they run after most other calculations.

### Increment/decrement

- Increment `++` increases a variable by 1: If `let counter = 1;`, `counter++;` increases the `counter` variable to `2`.
- Decrement `--` decreases a variable by 1: If `let counter = 1;`, `counter--;` decreases the `counter` variable to `0`.
  Increment/decrement can only be applied to **variables**. Trying to use it on a value like `5++` will give an error.

- When the operator goes after the variable, it is in “postfix form”: `counter++`.
- The “prefix form” is when the operator goes before the variable: `++counter`. The prefix form returns the new value while the postfix form returns the old value (prior to increment/decrement).

If the result of increment/decrement is not used, there is no difference in which form to use. If we’d like to increase a value and immediately use the result of the operator, we need the prefix form, for example if `let counter = 0;`, then `alert( ++counter ); // 1`. But is we’d like to increment a value but use its previous value, we need the postfix form like `let counter = 0;` then `alert( counter++ ); // 0`.

### Comparisons

In JavaScript, comparison operators are written like this:

- Greater/less than: `a > b`, `a < b`.
- Greater/less than or equals: `a >= b`, `a <= b`.
- Equals: `a == b`, please note the double equality sign `==` means the equality test, while a single one `a = b` means an assignment.
- Not equals: In maths the notation is ≠, but in JavaScript it’s written as `a != b`.

All comparison operators return a boolean value, which can be assigned to a variable:

- `true` – means “yes”, “correct” or “the truth”.
- `false` – means “no”, “wrong” or “not the truth”.

To see whether a **string** is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order. In other words, strings are compared letter-by-letter.

The algorithm compares each letter's value following the Unicode characters order list,from lowest score to highest: special characters, `0-9`, `A-Z`, `a-z`, etc.

The algorithm to compare two strings is simple:

- Compare the first character of both strings. If the first character from the first string is greater (or less) than the other string’s, then the first string is greater (or less) than the second. We’re done.
- Otherwise, if both strings’ first characters are the same, compare the second characters the same way.
- Repeat until the end of either string.
- If both strings end at the same length, then they are equal. Otherwise, the longer string is greater.

For example, the comparison `'Z' > 'A'` returns `true`. The comparison `'Glow'` and `'Glee'` needs more steps as strings are compared character-by-character:
`G` is the same as `G`.
`l` is the same as `l`.
`o` is greater than `e`. Stop here. The first string is greater.

When comparing values of **different types**, JavaScript converts the values to **numbers**. For example:

- `let result = '2' > 1 ; // true, string '2' becomes a number 2`
- `let result = '01' == 1 ; // true, string '01' becomes a number 1`

For **boolean** values, `true` becomes `1` and `false` becomes `0`. A regular equality check `==` has a problem. It cannot differentiate `0` from `false`. This happens because operands of different types are converted to numbers by the equality operator `==`. An empty string, just like `false`, becomes a zero. What to do if we’d like to differentiate `0` from `false`?

**A strict equality operator `===` checks the equality without type conversion.** In other words, if `a` and `b` are of different types, then `a === b` immediately returns `false` without an attempt to convert them. There is also a “strict non-equality” operator `!==` analogous to `!=`.

There’s a non-intuitive behavior when null or undefined are compared to other values.

- For a **strict equality** check `===:` These values are different, because each of them is a different type.
- For a **non-strict check** `==:` There’s a special rule. These two are a “sweet couple”: they equal each other (in the sense of `==`), but not any other value.

For maths and other comparisons `< > <= >=`, null/undefined are converted to numbers: `null` becomes `0`, while `undefined` becomes `NaN`.

Summary on comparisons:

- Comparison operators return a `boolean` value.
- Strings are compared letter-by-letter in the “dictionary” order.
- When values of different types are compared, they get converted to numbers (with the exclusion of a strict equality check).
- The values `null` and `undefined` equal `==` each other and do not equal any other value.
- Be careful when using comparisons like `>` or `<` with variables that can occasionally be `null`/`undefined`. Checking for null/undefined separately is a good idea.

## Conditional Branching: if, '?'

### `if`, `else`, and `else if` Statements

The `if(...)` statement evaluates a condition in parentheses and, if the result is `true`, executes a block of code. For example, `if (year == 2025) alert('Yes!');`.

If we want to execute more than one statement, we have to wrap our code block inside curly braces:

```js
if (year == 2025) {
  alert("That's correct!");
  alert("You're so smart!");
}
```

We recommend wrapping your code block **with curly braces `{}` every time** you use an `if` statement, even if there is only one statement to execute. Doing so improves readability.

The `if (…)` statement evaluates the expression in its parentheses and converts the result to a `boolean`:

- A number `0`, an empty string `""`, `null`, `undefined`, and `NaN` all become `false`. Because of that they are called “falsy” values.
- Other values become `true`, so they are called “truthy”.

The `if` statement may contain an optional `else` block. It executes when the condition is falsy. Sometimes, we’d like to test several variants of a condition. The `else if` clause lets us do that:

```js
let year = prompt(
  "In which year was the ECMAScript-2015 specification published?",
  "",
);

if (year < 2015) {
  alert("Too early...");
} else if (year > 2015) {
  alert("Too late");
} else {
  alert("Exactly!");
}
```

There can be more `else if` blocks. The final `else` is optional.

### Conditional Operator `?` for Assigning Variables

Sometimes, we need to **assign a variable** depending on a condition. The so-called “conditional” or “question mark” operator lets us do that in a shorter and simpler way. The operator is represented by a question mark `?`. Sometimes it’s called “ternary”, because the operator has three operands. The syntax is:

```js
let result = condition ? value1 : value2;

//Example:
let accessAllowed = age > 18 ? true : false;
```

A sequence of question mark operators `?` can return a value that depends on more than one condition:

```js
let age = prompt("age?", 18);

let message =
  age < 3
    ? "Hi, baby!"
    : age < 18
      ? "Hello!"
      : age < 100
        ? "Greetings!"
        : "What an unusual age!";

alert(message);
```

When wanting to execute code based on conditional logic, use `if`, `else` and `else if` statements. When wanting to assign a variable depending on a condition, use `?` and `:`.

## Logical Operators

There are four logical operators in JavaScript: `||` (OR),`&&` (AND), `!` (NOT), `??` (Nullish Coalescing). Although they are called “logical”, they can be applied to values of any type, not only boolean. Their result can also be of any type. If an operand is not a boolean, it’s converted to a boolean for the evaluation. For instance, the number `1` is treated as `true`, the number `0` as `false`.

In JavaScript, the OR `||` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to boolean. If the result is `true`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were `false`), returns the last operand. A value is returned in its original form, without the conversion.

For example:

```js
alert(1 || 0); // 1 (1 is truthy)

alert(null || 1); // 1 (1 is the first truthy value)
alert(null || 0 || 1); // 1 (the first truthy value)

alert(undefined || null || 0); // 0 (all falsy, returns the last value)
```

In other words, a chain of OR `||` returns the first truthy value or the last one if no truthy value is found. Another feature of OR `||` operator is the so-called “short-circuit” evaluation. It means that `||` processes its arguments until the first truthy value is reached, and then the value is returned immediately, without even touching the other argument. The importance of this feature becomes obvious if an operand isn’t just a value, but an expression with a side effect, such as a variable assignment or a function call, meaning only one function/variable assignment will happen.

The AND `&&` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to a boolean. If the result is `false`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were truthy), returns the last operand.

In other words, AND returns the first falsy value or the last value if none were found. The rules above are similar to OR. The difference is that AND returns the first falsy value while OR returns the first truthy one. The precedence of AND `&&` operator is higher than OR `||`.

For example:

```js
// if the first operand is truthy,
// AND returns the second operand:
alert(1 && 0); // 0
alert(1 && 5); // 5

// if the first operand is falsy,
// AND returns it. The second operand is ignored
alert(null && 5); // null
alert(0 && "no matter what"); // 0
```

The operator `!` accepts a single argument and does the following:

- Converts the operand to boolean type: true/false.
- Returns the inverse value.

For example:

```js
alert(!true); // false
alert(!0); // true

//A double NOT `!!` is sometimes used for converting a value to a boolean type
alert(!!"non-empty string"); // true
alert(!!null); // false
```

The precedence of NOT `!` is the highest of all logical operators, so it always executes first, before `&&` or `||`.

A value is “defined” when it’s neither `null` nor `undefined`. The result of `a ?? b` is:

- if `a` is defined, then `a`,
- if `a` isn’t defined, then `b`.
  In other words, `??` returns the first argument if it’s not `null`/`undefined`. Otherwise, the second one.

The common use case for ?? is to provide a default value. For example, here we show `user` if its value **isn’t** `null`/`undefined`, otherwise `Anonymous`:

```js
let user;

alert(user ?? "Anonymous"); // Anonymous (user is undefined)
```

We can also use a sequence of `??` to select the first value from a list that isn’t `null`/`undefined`. Let’s say we have a user’s data in variables `firstName`, `lastName` or `nickName`. All of them may be not defined, if the user decided not to fill in the corresponding values. We’d like to display the user name using one of these variables, or show `“Anonymous”` if all of them are `null`/`undefined`. Let’s use the `??` operator for that:

```js
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// shows the first defined value:
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder

//The OR || can be used the same way as ??
// shows the first truthy value:
alert(firstName || lastName || nickName || "Anonymous"); // Supercoder
```

The important difference between them is that:

- `||` returns the first **truthy** value.
- `??` returns the first **defined** value.

For example:

```js
let height = 0;

alert(height || 100); // 100, it checks height for being a falsy value. Since 0 is falsy, returns the second argument: 100
alert(height ?? 100); // 0, it checks height for being null/undefined, which it's not, so returns: 0
```

The precedence of the `??` operator is the same as `||`. That means that, just like `||`, the nullish coalescing operator `??` is evaluated before `=` and `?`, but after most other operations, such as `+`, `*`.

So we may need to add parentheses in expressions like this:

```js
let height = null;
let width = null;

// important: use parentheses
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

## Loops: `while` and `for`

Loops are a way to repeat the same code multiple times.

The **while** loop:

```js
while (condition) {
  //While the condition is truthy, the code from the loop body is executed.
  // code
  // so-called "loop body"
}

//For instance, the loop below outputs i while i < 3:
let i = 0;
while (i < 3) {
  // shows 0, then 1, then 2
  alert(i);
  i++;
}
```

A single execution of the loop body is called an iteration. If `i++` was missing from the example above, the loop would repeat (in theory) forever. In practice, the browser provides ways to stop such loops, and in server-side JavaScript, we can kill the process.

Any expression or variable can be a loop condition, not just comparisons: the condition is evaluated and converted to a boolean by `while`:

```js
let i = 3;
while (i) {
  // when i becomes 0, the condition becomes falsy, and the loop stops
  alert(i);
  i--;
}
```

If the loop body has a single statement, we can omit the curly braces `{…}`.

The condition check can be moved below the loop body using the `do..while` syntax. This form of syntax should only be used when you want the body of the loop to execute **at least once** regardless of the condition being truthy. Usually, the other form is preferred: `while(…) {…}`:

```js
do {
  // loop body
} while (condition);
```

The **for** loop:

```js
for (begin; condition; step) {
  // ... loop body ...
}

//For example, the loop below runs alert(i) for i from 0 up to (but not including) 3:
for (let i = 0; i < 3; i++) {
  // shows 0, then 1, then 2
  alert(i);
}
```

- **begin**: `let i = 0 ` -> Executes once upon entering the loop. This is called an “inline” variable declaration. Such variables are visible only **inside** the loop.
- **condition**: `i < 3` -> Checked before every loop iteration. If `false`, the loop stops.
- **body**: `alert(i)` -> Runs again and again while the condition is truthy.
- **step**: `i++` -> Executes after the body on each iteration.

Any part of `for` can be skipped. For example, we can omit `begin` if we don’t need to do anything at the loop start:

```js
let i = 0; // we have i already declared and assigned

for (; i < 3; i++) {
  // no need for "begin"
  alert(i); // 0, 1, 2
}

for (; i < 3; ) {
  //We can also remove the step part
  alert(i++); //Shows old variable because postfix form
}
```

Normally, a loop exits when its condition becomes falsy. But we can force the exit at any time using the special `break` directive. For example, the loop below asks the user for a series of numbers, “breaking” when no number is entered:

```js
let sum = 0;

while (true) {
  let value = +prompt("Enter a number", "");
  if (!value) break; // (*)
  sum += value;
}
alert("Sum: " + sum);
```

The combination “infinite loop + `break` as needed” is great for situations when a loop’s condition must be checked not in the beginning or end of the loop, but in the **middle** or even in several places of its body.

The `continue` directive is a “lighter version” of `break`. It doesn’t stop the whole loop. Instead, it stops the current iteration and forces the loop to start a new one (if the condition allows). We can use it if we’re done with the current iteration and would like to move on to the next one. The loop below uses `continue` to output only odd values:

```js
for (let i = 0; i < 10; i++) {
  // if true, skip the remaining part of the body
  if (i % 2 == 0) continue;

  alert(i); // 1, then 3, 5, 7, 9
}
```

## The `switch` Statement

A `switch` statement can replace multiple `if` checks. The `switch` has one or more `case` blocks and an **optional** `default`.

```js
switch(x) {
  case 'value1':  // if (x === 'value1'), strict equality check
    ...
    [break]

  case 'value2':  // if (x === 'value2'), if the equality is found, switch starts to execute the code starting from the corresponding case, until the nearest break (or until the end of switch)
    ...
    [break]

  default: //If no case is matched then the default code is executed (if it exists)
    ...
    [break]
}

//For example:
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
    break;
  case 4:
    alert( 'Exactly!' ); //Case runs and loop breaks
    break;
  case 5:
    alert( 'Too big' );
    break;
  default:
    alert( "I don't know such values" );
}
```

If there is no `break` then the execution **continues** with the next case without any checks.

Several variants of case which share the same code can be **grouped**. For example, if we want the same code to run for `case 3` and `case 5`:

```js
let a = 3;

switch (a) {
  case 4:
    alert("Right!");
    break;

  case 3: // (*) grouped two cases, now both 3 and 5 show the same message, because there is no break
  case 5:
    alert("Wrong!");
    alert("Why don't you take a math class?");
    break;

  default:
    alert("The result is strange. Really.");
}
```

Let’s emphasize that the equality check is **always strict**. The values must be of the same type to match.

## Functions in JavaScript

Quite often we need to perform a similar action in many places of the script. For example, we need to show a nice-looking message when a visitor logs in, logs out and maybe somewhere else. Functions are the main “building blocks” of the program. They allow the code to be called many times without repetition. To create a function we can use a function declaration:

```js
function name(parameter1, parameter2, ...parameterN) {
  // body
}

//For example:
function showMessage() {
  alert("Hello everyone!");
}
```

A variable declared inside a function (**local** variable) is only visible inside that function. A variable declared outside of the function (**global** variable) can still be read and changed by the function:

```js
let userName = "John";

function showMessage() {
  //It can access the outer variable
  let message = "Hello, " + userName; // Hello, John

  //Or it can modify it as well
  userName = "Addison";

  alert(message);
}

showMessage(); // Hello, Addison
```

If a same-named variable is declared inside the function then it **shadows** the outer one. For instance, in the code below the function uses the local `userName`. The outer one is ignored:

```js
let userName = "John";

function showMessage() {
  let userName = "Bob"; // declare a local variable

  let message = "Hello, " + userName; // Bob
  alert(message);
}

// the function will create and use its own userName
showMessage();

alert(userName); // John, unchanged, the function did not access the outer variable
```

We can pass arbitrary data to functions using **parameters**. For example, we have a variable `from` and pass it to the function. Please note: the function changes `from`, but the change is not seen outside, because a function always gets a copy of the value:

```js
function showMessage(from, text) {
  from = "*" + from + "*"; // make "from" look nicer

  alert(from + ": " + text);
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
alert(from); // Ann
```

When a value is passed as a function parameter, it’s also called an **argument**.

In other words, to put these terms straight:

- A **parameter** is the variable listed inside the parentheses in the function declaration (it’s a declaration time term).
- An **argument** is the value that is passed to the function when it is called (it’s a call time term).

We declare functions listing their parameters, then call them passing arguments. In the example above, one might say: “the function `showMessage` is declared with two parameters, then called with two arguments: `from` and `"Hello"”`.

### Default Parameters

If a function is called, but an argument is not provided, then the corresponding value becomes `undefined`. For instance, the aforementioned function `showMessage(from, text)` can be called with a single argument like `showMessage("Ann");`. That’s not an error. Such a call would output `"*Ann*: undefined"`. As the value for `text` isn’t passed, it becomes `undefined`. We can specify the so-called “default” (to use if omitted) value for a parameter in the function declaration, using `=`:

```js
function showMessage(from, text = "no text given") {
  //Now if the text parameter is not passed, it will get the value "no text given"
  alert(from + ": " + text);
}

showMessage("Ann"); // Ann: no text given
```

The default value also jumps in if the parameter exists, but strictly equals undefined, like this: `showMessage("Ann", undefined); // Ann: no text given`.
Here `"no text given"` is a `string`, but it can be a more complex expression, which is only evaluated and assigned if the parameter is missing. So, this is also possible:

```js
function showMessage(from, text = anotherFunction()) {
  // anotherFunction() only executed if no text given
  // its result becomes the value of text
}
```

In JavaScript, a default parameter is evaluated every time the function is called without the respective parameter. In the example above, `anotherFunction()` isn’t called at all, if the `text` parameter is provided. On the other hand, it’s independently called every time when `text` is missing.

Sometimes it makes sense to assign default values for parameters at a later stage after the function declaration.

```js
function showMessage(text) {
  // ...

  if (text === undefined) {
    // if the parameter is missing, apply default value
    text = "empty message";
  }

  // or we can use ||: if text is undefined or otherwise falsy, set it to 'empty', this assumes an empty string = false
  text = text || "empty";

  alert(text);
}

showMessage(); // empty message

//Modern JavaScript engines support the nullish coalescing operator ??, it’s better when most falsy values, such as 0, should be considered “normal”:
function showCount(count) {
  // if count is undefined or null, show "unknown"
  alert(count ?? "unknown");
}

showCount(0); // 0
showCount(null); // unknown
showCount(); // unknown
```

### Returning a Value

A function can `return` a value back into the calling code as the result. The directive `return` can be in any place of the function. When the execution reaches it, the function stops, and the value is returned to the calling code. There may be many occurrences of `return` in a single function, when adding conditional logic. It is possible to use `return` without a value. That causes the function to exit immediately. If a function does not `return` a value, it is the same as if it returns `undefined`. An empty `return` is also the same as no `return` like `function doNothing() {return;}`. Never add a newline between `return` and the `value`. JavaScript assumes a semicolon after `return`.

### Naming a function

Functions are actions, so their name is usually a verb. It is a widespread practice to start a function with a verbal prefix which vaguely describes the action:
Functions starting with…

- `"show…"` - usually show something,
- `"get…"` – return a value,
- `"calc…"` – calculate something,
- `"create…"` – create something,
- `"check…"` – check something and return a boolean, etc

**One function, one action.** A function should do exactly what is suggested by its name, no more. Two independent actions usually deserve two functions, even if they are usually called together (in that case we can make a 3rd function that calls those two). For example, `getAge` – would be bad if it shows an `alert` with the `age` (should only get) or `checkPermission` – would be bad if it displays the `access granted/denied` message (should only perform the check and return the result).

### Function Declaration vs. Function Expression

A function is a special kind of **value**.

```js
//This is a function declaration:
function sayHi() {
  alert("Hello");
}

//This is a function expression:
let sayHi = function () {
  alert("Hello");
};
```

As the function creation happens in the context of the assignment expression (to the right side of `=`), this is a **Function Expression**. Please note, **there’s no name after the `function` keyword**. Omitting a name is allowed for Function Expressions. We are essentially saying "create a `function` and put it into the variable `sayHi”`.

**No matter how the function is created, a function is a value. Both examples above store a function in the `sayHi` variable.** In JavaScript, a function is a value (source code of the function in string form), so we can deal with it as a value. For example, we can copy a function to another variable:

```js
function sayHi() {
  //1) Function Declaration creates the function and puts it into the variable named sayHi
  alert("Hello");
}

let func = sayHi; //2) Copies it into the variable func. NOTE: There are no parentheses after sayHi. If there were, then func = sayHi() would write the **result** of the call sayHi() into func, not the function sayHi itself.

func(); // Hello     // (3) run the copy (it works)!
sayHi(); // Hello    //     this still works too (why wouldn't it)
```

why do Function Expressions have a semicolon `;` at the end, but Function Declarations do not? The semicolon would be there for a simpler assignment, such as `let sayHi = 5;`, and it’s also there for a function assignment.

In summary:

- A **Function Expression** is created when the execution reaches it and is usable only from that moment.
  Once the execution flow passes to the right side of the assignment `let sum = function…` – here we go, the function is created and can be used (assigned, called, etc. ) from now on. When a Function Declaration is within a code block, it’s visible everywhere inside that block. But not outside of it.
- **Function Declarations** are different. A Function Declaration can be called earlier than it is defined. That’s due to internal algorithms. When JavaScript prepares to run the script, it first looks for global Function Declarations in it and creates the functions. We can think of it as an “initialization stage”. And after all Function Declarations are processed, the code is executed. So it has access to these functions.

As a rule of thumb, when we need to declare a function, the first thing to consider is Function Declaration syntax. It gives more freedom in how to organize our code, because we can call such functions before they are declared. That’s also better for readability, as it’s easier to look up `function f(…) {…}` in the code than `let f = function(…) {…};`. Function Declarations are more “eye-catching”. …But if a Function Declaration does not suit us for some reason, or we need a conditional declaration (we’ve just seen an example), then Function Expression should be used.

### Callback Functions

We’ll write a function `ask(question, yes, no)` with three parameters:

- `question`: Text of the question
- `yes`: Function to run if the answer is “Yes”
- `no`: Function to run if the answer is “No”

```js
function ask(question, yes, no) {
  if (confirm(question)) yes();
  else no();
}

function showOk() {
  alert("You agreed.");
}

function showCancel() {
  alert("You canceled the execution.");
}

// usage: functions showOk, showCancel are passed as arguments to ask
ask("Do you agree?", showOk, showCancel);
```

**The arguments `showOk` and `showCancel` of `ask` are called callback functions or just callbacks.** The idea is that we pass a function and expect it to be “called back” later if necessary. In our case, `showOk` becomes the callback for “yes” answer, and `showCancel` for “no” answer.

We can use Function Expressions to write an equivalent, shorter function:

```js
function ask(question, yes, no) {
  //Passes the question and two functions as arguments
  if (confirm(question))
    yes(); //Grabs a copy of what is passed as "yes" and calls it, since it's a function with ()
  else no();
}

ask(
  "Do you agree?",
  function () {
    alert("You agreed.");
  },
  function () {
    alert("You canceled the execution.");
  },
);
```

### Arrow Functions

There’s another very simple and concise syntax for creating functions, that’s often better than Function Expressions.

```js
let func = (arg1, arg2, ..., argN) => expression;

//Shorter form of:
let func = function(arg1, arg2, ..., argN) {
  return expression;
};

//For example:
let sum = (a, b) => a + b;

/* This arrow function is a shorter form of:

let sum = function(a, b) {
  return a + b;
};
*/

alert( sum(1, 2) ); // 3
```

As you can see, `(a, b) => a + b` means a function that accepts two arguments named `a` and `b`. Upon the execution, it evaluates the expression `a + b` and returns the result. If we have only one argument, then parentheses around parameters can be omitted, making that even shorter: `let double = n => n * 2;`. f there are no arguments, parentheses are empty, but they must be present: `let sayHi = () => alert("Hello!");`.

Arrow functions can be used in the same way as Function Expressions. For instance, to dynamically create a function:

```js
let age = prompt("What is your age?", 18);

let welcome = age < 18 ? () => alert("Hello!") : () => alert("Greetings!");

welcome();
```

Sometimes we need a more complex function, with multiple expressions and statements. In that case, we can enclose them in curly braces. The major difference is that curly braces require a `return` within them to return a value (just like a regular function does).

```js
let sum = (a, b) => {
  // the curly brace opens a multiline function
  let result = a + b;
  return result; // if we use curly braces, then we need an explicit "return"
};

alert(sum(1, 2)); // 3
```

Summary:
Arrow functions are handy for simple actions, especially for one-liners. They come in two flavors:

- Without curly braces: `(...args) => expression` – the right side is an expression: the function evaluates it and returns the result. Parentheses can be omitted, if there’s only a single argument, e.g. `n => n*2`.
- With curly braces: `(...args) => { body }` – brackets allow us to write multiple statements inside the function, but we need an explicit `return` to return something.

### Recap

Statements are delimited with a semicolon `;`. Most codestyle guides agree that we should put a semicolon after each statement. Semicolons are not required after code blocks `{...}` and syntax constructs with them like loops, such as `function () {}`, or `for (;;) {}`.

[JavaScript Fundamentals - Cheat Sheet](https://javascript.info/javascript-specials)

## Code Quality in JavaScript

https://javascript.info/debugging-chrome

## Objects in JavaScript

Objects are used to store keyed collections of various data and more complex entities. An object can be created with figure brackets `{…}` with an optional list of properties. A property is a `“key: value”` pair, where `key` is a `string` (also called a “property name”), and `value` can be anything. An empty object can be created using one of two syntaxes:

```js
let user = new Object(); // "object constructor" syntax
let user = {}; // "object literal" syntax

//We can also put some properties into {...} as "key: value" pairs
let user = {
  //an object
  name: "John", // by key "name" store value "John"
  age: 30, // by key "age" store value 30
  //The last property in the list may end with a comma, called a "trailling" or "hanging" comma
};
```

Property values are accessible using the **dot notation**:

```js
// get property values of the object:
alert(user.name); // John
alert(user.age); // 30
```

To **remove** a property, we can use the `delete` operator:

```js
delete user.age;
```

We can also use multiword property names, but then they must be quoted:

```js
let user = {
  name: "John",
  age: 30,
  "likes birds": true, // multiword property name must be quoted
};
```

For multiword properties, the dot access doesn’t work. The dot requires the `key` to be a valid variable identifier. That implies: contains no spaces, doesn’t start with a digit and doesn’t include special characters (`$` and `_` are allowed). There’s an alternative “square bracket notation” that works with any string:

```js
let user = {};

//Set  value
user["likes birds"] = true;

//Get value
alert(user["likes birds"]);

//Delete
delete user["likes birds"];
```

Square brackets also provide a way to obtain the property name as the result of any expression – as opposed to a literal string – like from a variable as follows:

```js
let key = "likes birds";

//Setting a value, same as user["likes birds"] = true
user[key] = true;

//This offers flexibility, since we can calculate the key to access at run-time, depending on user input or calculations
let user = {
  name: "John",
  age: 30,
};

let key = prompt("Which key do you want to kow?", "");

alert(user[key]); // John (if enter "name")
```

The dot notation **cannot** be used in a similar way.

### Computed Properties

We can use square brackets in an object literal, when creating an object. That’s called **computed properties**.

```js
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert(bag.apple); // 5 if fruit="apple"

//This computed property can also be accessed with []
alert(bag[fruit]);
```

We can use more complex expressions inside square brackets:

```js
let fruit = "apple";
let bag = {
  [fruit + "Computer"]: 5, //bag.appleComputer = 5
};
```

Most of the time, when property names are known and simple, the dot is used. And if we need something more complex, then we switch to square brackets.

### Property Naming

In real code, we often use existing variables as values for property names. The use-case of making a property from a variable is so common, that there’s a special property value shorthand to make it shorter.

```js
function makeUser(name, age) {
  return {
    name: name,
    age: age,
    // ...other properties
  };
}

let user = makeUser("John", 30); //Function creates an object with name, age properties and stores it in user variable
alert(user.name); // John

//The shortcut version of this is:
function makeUser(name) {
  name, //equivalent to name: name,
  age: 30, //We can use both normal properties and shorthands in the same object
}
```

As we already know, a variable cannot have a name equal to one of the language-reserved words like `“for”`, `“let”`, `“return”` etc. But for an object property, there’s no such restriction. They can be any strings or symbols. Other types are automatically converted to strings. For instance, a number `0` becomes a string `"0"` when used as a property key.

```js
let object = {
  for: "value", //Values can be of any data type
  0: 232, //The key 0 will be converted to a string "0"
  return: 2123,
};
```

A notable feature of objects in JavaScript, compared to many other languages, is that it’s possible to access any property. There will be no error if the property doesn’t exist! Reading a non-existing property just returns undefined. So we can easily test whether the property exists. There’s also a special operator `"in"` for that. The syntax is: `"key" in object`. For example:

```js
let user = {
  name: "John",
  age: 30,
};

alert("age" in user); // true, user.age exists
alert("blabla" in user); // returns false
//note that on the left side of in there must be a property name. That’s usually a quoted string.
//If we omit quotes, that means a variable should contain the actual name to be tested. For instance:
let user = { age: 30 };

let key = "age";
alert(key in user); // true, property "age" exists
```

### The `for...in` loop

To walk over all keys of an object, there exists a special form of the loop: `for..in`. This is a completely different thing from the `for(;;)` construct.

```js
for (key in object) {
  // executes the body for each key among object properties
}

//For example:
let user = {
  name: "John",
  age: 30,
  isAdmin: true,
};

for (let prop in user) {
  // keys
  alert(prop); // name, age, isAdmin
  // values for the keys
  alert(user[prop]); // John, 30, true
}
```

Are objects ordered? In other words, if we loop over an object, do we get all properties in the same order they were added? Can we rely on this?

The short answer is: “ordered in a special fashion”: **integer properties are sorted**, others appear in **creation order**. For example, let's consider an object with the phone codes:

```js
let codes = {
  49: "Germany",
  41: "Switzerland",
  44: "Great Britain",
  // ..,
  1: "USA",
};

for (let code in codes) {
  alert(code); // 1, 41, 44, 49
}
```

The phone codes go in the ascending sorted order, because they are `integers`. So we see 1, 41, 44, 49. The **“integer property”** term here means a string that can be converted to-and-from an integer without a change. So, `"49"` is an integer property name, because when it’s transformed to an integer number and back, it’s still the same. But `"+49"` and `"1.2"` are not.

…On the other hand, if the keys are non-integer, then they are listed in the creation order.

```js
let user = {
  name: "John",
  surname: "Smith",
};
user.age = 25; // add one more

// non-integer properties are listed in the creation order
for (let prop in user) {
  alert(prop); // name, surname, age
}
```

### Objects in JavaScript Summary

Objects are associative arrays with several special features.
They store properties (key-value pairs), where:

- Property keys must be strings or symbols (usually strings).
- Values can be of any type.

To access a property, we can use:

- The dot notation: `obj.property`.
- Square brackets notation `obj["property"]`. Square brackets allow taking the key from a variable, like `obj[varWithKey]`.

Additional operators:

- To delete a property: `delete obj.prop`.
- To check if a property with the given key exists: `"key" in obj`.
- To iterate over an object: `for (let key in obj)` loop.

What we’ve studied in this chapter is called a “plain object”, or just `Object`.
There are many other kinds of objects in JavaScript:

- `Array` to store ordered data collections,
- `Date` to store the information about the date and time,
- `Error` to store the information about an error.
- …And so on.

https://javascript.info/object-copy

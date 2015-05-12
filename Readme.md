# Lexer

---

## Thank you, Matt!
Inspired by [Matt Might's GREAT McLexer][1]. This is a toy lexer which has a similar grammar compared with LEX.
I rewrite this on my own to understand javascript basics and how scanners work better. The core part of this lexer is done
by javascript's bultin `RegExp`. Maybe someday I will try to construct a new one in `clojurescript` which can utilize 
the power of macro to build an automaton at compile time.

---

## API
This Toy Lexer exposes three functions:
* `run`: starts the whole lexer from a starting state and the given input.
* `createState`: create a state which can be further customized.
* `setVerbose`: switch if the output should be verbose (noisy).

---

## Example
```
/* foo.js */
var lexer = require("./Lexer");

//lexer.setVerbose(true);

var INIT = lexer.createState("INIT State");
var END  = lexer.createState("END");


/* Lexer Rules Start */

/* State */					/* Pattern */								/* Action */
INIT						( /\d+/ )									( function (t) { console.log(t); } );
INIT						( /\(/ )									( function (t) { console.log(t); } );
//INIT						( /\)/ )									( function (t) { console.log(t); return END; } );
INIT						( /\)/ )									( function (t) { console.log(t); return END; } );
//END						( /\d+/ )									( function (t) { console.log(t); } );	

/* Lexer Rules End */

lexer.run(INIT, "123(123)123");
```

This program will give the following output.
```
123
(
123
)
```

Just play around with the code in `foo.js`. More examples will be provided in the near future.

---

## TODO
* Needs a cleaner code style.
* Rules with same regex may cause trouble.



[1]: http://matt.might.net/articles/lexing-and-syntax-highlighting-in-javascript/
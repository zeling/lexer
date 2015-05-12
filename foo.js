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
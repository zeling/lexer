/**
 * A Toy Lexer inspired by Matt Might's awesome McLexer.
 * http://matt.might.net/
 * 
 * author: zeling
 * mail:   zeling.feng@hotmail.com
 */

var Lexer = (function () {
	var states = 0, verbose = false;
	
	Function.prototype.longestMatch = function (input) {
		if (this.rules && this.rules instanceof Array) {
			var longestMatched="", regex, action, match, m, i;
			for (i in this.rules) {
				regex = this.rules[i].regex;
				action = this.rules[i].action;
				match = regex.exec(input);
				if (match !== null) {
					m = match.shift();
					if (m.length > longestMatched.length) {
						longestMatched = m;
					}
				}
			}
			return {
				longestMatched: longestMatched,
				restOfInput: input.slice(longestMatched.length)
			};
		}
	};
	
	
	Array.prototype.longest = function (f, cmp) {
		f   = f   || function (x) { return x; };
		cmp = cmp || function (a, b) { return a - b; };
		return this.map(f).reduce( function (a, b){
			if (cmp(a, b) < 0) {
				return b;
			} else {
				return a;
			}
		});
	};
	
	var run 		= function (start, input) {
		var kont = nextState(start, input);
		while (typeof kont === "function") {
			kont = kont();
		}
	}
	
	var nextState 	= function (state, input) {
		if (verbose) {
			console.log("Currently at " + state.stateName);
		}
		if (input.length === 0) {
			if (verbose) {
				console.log("Awesome! I've dealed with the whole string.");
			}
			return;
		}
		var longest = state.rules.longest(
			function (rule) {
				var m;
				if ((m = rule.regex.exec(input)) !== null) {
					return {
						matched: m.shift(),
						rule: rule	
					};		
				} else {
					return {
						matched: "",
						rule: rule
					}
				}
			},
			function (a, b) {
				return a.matched.length - b.matched.length;
			}
		);
		var next = longest.rule.action(longest.matched);
		/* assuming that is a state */
		if (next && next.rules && next.rules.length !== 0 && next.stateName) {
			return function () {
				return nextState(next, input.slice(longest.matched.length));
			};
		} else if (next && next.rules && next.rules.length === 0) {
			/* Empty rule set leads to termination of the lexer */
			if (verbose) {
				console.log("Awesome! I've dealed with the whole string.");
			}
			return;
		} else {
			return function () {
				return nextState(state, input.slice(longest.matched.length));
			};
		}
	};
	
	var createState = function (name) {
		name = name || ("State_" + (states++));

		var rules = new Array();
		var ret = function (regex) {
			if (!(regex instanceof RegExp)) {
				throw new Error("You shold always put an instance of RegExp for the FIRST argument");
			}
			return function (action) {
				if (!(action instanceof Function)) {
					throw new Error("You shold always put an instance of Function for the SECOND argument");
				}
				rules.push({
					regex: new RegExp("^" + regex.source),
					action: action
				});
			};
		};
		
		ret.rules = rules;
		ret.stateName = name;
		
		return ret;
	};
	
	var setVerbose = function (_verbose) {
		verbose = _verbose;
	}
	
	return {
		createState:	createState,
		run:			run,
		setVerbose:		setVerbose
	};
	
})();

module.exports = Lexer;


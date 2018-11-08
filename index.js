'use strict';

/**
 * Convert jQuery QueryBuilder rules to String Rule
 * @param {input} Rule output from jQuery QueryBuilder
 * @return {object}
 */
module.exports = function(input) {
    return convertRule(input);
};

function convertRule(input) {
    /** Settings **/
    var defaultCondition = 'AND';

    /** Private Functions **/
    var escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };

    var mongoOperators = {
        equal: '$eq',
        not_equal: '$neq',
        less: '$lt',
        less_or_equal: '$lte',
        greater: '$gt',
        greater_or_equal: '$gte'
    };

    var mongoOperatorsFns = {

        equal: function(v) {

			if(typeof v[1] == 'string'){
				v[1] = "'" + v[1] + "'";
			}
            
			var getValue = parseFloat(v[1]);

            if(!isNaN(getValue)){
                if(typeof getValue == 'number'){
                    v[1] = getValue;
                }
            }
			
			return v[0] + " == " + v[1]; 
        },
        not_equal: function(v) {

            if(typeof v[1] == 'string'){
				v[1] = "'" + v[1] + "'";
			}
			
			var getValue = parseFloat(v[1]);

            if(!isNaN(getValue)){
                if(typeof getValue == 'number'){
                    v[1] = getValue;
                }
            }
			
			return v[0] + " != " + v[1]; 
        },
        less: function(v) {
		
	    var getValue = parseFloat(v[1]);
		
            if (typeof getValue == 'number') {
                v[1] = parseFloat(getValue);
            }
			
			return v[0] + " < " + v[1];           
			
        },
        less_or_equal: function(v) {

            var getValue = parseFloat(v[1]);
		
            if (typeof getValue == 'number') {
                v[1] = parseFloat(getValue);
            }
			
			return v[0] + " <= " + v[1]; 

        },
        greater: function(v) {

            var getValue = parseFloat(v[1]);
		
            if (typeof getValue == 'number') {
                v[1] = parseFloat(getValue);
            }
			
			return v[0] + " > " + v[1]; 

        },
        greater_or_equal: function(v) {

            var getValue = parseFloat(v[1]);
		
            if (typeof getValue == 'number') {
                v[1] = parseFloat(getValue);
            }
			
			return v[0] + " >= " + v[1]; 

        }
    }

    var output = [];

    if (!input) {
        return null;
    }

    var self = this;

    return (function parse(group) {

        if (!group.condition) {
            group.condition = defaultCondition;
        }

        if (['AND', 'OR'].indexOf(group.condition.toUpperCase()) === -1) {
            throw new Error('Unable to build rule with condition ' + group.condition);
        }

        if (!group.rules) {
            return {};
        }

        var parts = [];

        group.rules.forEach(function(rule) {
            if (rule.rules && rule.rules.length > 0) {
                parts.push(parse(rule));
            } else {
                var expFunction = mongoOperatorsFns[rule.operator];
				
				var ruleExpression = {};

                if (expFunction === undefined) {
                    throw new Error('Unknown rule operation for operator ' + rule.operator);
                }

				ruleExpression = expFunction.call(self, [rule.id, rule.value]);

                parts.push(ruleExpression);
            }
        });

        var groupExpression = {};

		var output = '';
		
		for(var i=0; i < parts.length; i++) {
			if(typeof parts[i+1] != 'undefined') {
				output += parts[i] + (group.condition.toLowerCase() == 'and' ? ' && ' : ' || ');
			} else {
				output += parts[i];
			}
		}	
		
		output = '(' + output + ')';
		
        return (output);

    })(input);
}

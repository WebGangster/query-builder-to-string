# [query-builder-to-string](https://github.com/aravindnc/query-builder-to-string)

This is a simple library to convert rules created from jQuery Query Builder to String Format

Dependencies
- jQuery Query Builder - http://querybuilder.js.org
- Node Rules Engine - https://github.com/mithunsatheesh/node-rules

## Installation

  `npm install query-builder-to-string`

## Create Rule using Query Builder

### Step 1 - Create rule
Navigate to https://querybuilder.js.org/demo.html for a demo or implement a rule builder using query builder. 

### Step 2 - Get the rule output
After creating your rule, click the 'Get Rules' button and you will get below JSON as the output. You can use your own custom implementation to get the output from query builder.

The output form Query Builder will be like below,
```javascript
{
    "condition": "AND",
    "rules": [{
            "id": "price",
            "field": "price",
            "type": "double",
            "input": "number",
            "operator": "less",
            "value": 10.25
        },
        {
            "condition": "OR",
            "rules": [{
                    "id": "category",
                    "field": "category",
                    "type": "integer",
                    "input": "select",
                    "operator": "equal",
                    "value": 2
                },
                {
                    "id": "category",
                    "field": "category",
                    "type": "integer",
                    "input": "select",
                    "operator": "equal",
                    "value": 1
                },
                {
                    "condition": "AND",
                    "rules": [{
                        "id": "in_stock",
                        "field": "in_stock",
                        "type": "integer",
                        "input": "radio",
                        "operator": "equal",
                        "value": 1
                    }]
                }
            ]
        }
    ],
    "valid": true
};
```
### Step 3 - Build the input for rules engine
So, we have the query builder input and now we are going to convert it to a rule defenition which is the input for durable rules engine.

```javascript
    const RuleConverter = require('query-builder-to-string');

    // output from jQuery Query Builder
    var ruleInput = {
        "condition": "AND",
        "rules": [{
                "id": "price",
                "field": "price",
                "type": "double",
                "input": "number",
                "operator": "less",
                "value": 10.25
            },
            {
                "condition": "OR",
                "rules": [{
                        "id": "category",
                        "field": "category",
                        "type": "integer",
                        "input": "select",
                        "operator": "equal",
                        "value": 2
                    },
                    {
                        "id": "category",
                        "field": "category",
                        "type": "integer",
                        "input": "select",
                        "operator": "equal",
                        "value": 1
                    },
                    {
                        "condition": "AND",
                        "rules": [{
                            "id": "in_stock",
                            "field": "in_stock",
                            "type": "integer",
                            "input": "radio",
                            "operator": "equal",
                            "value": 1
                        }]
                    }
                ]
            }
        ],
        "valid": true
    };

    var output = RuleConverter(ruleInput);
```
And the output will be string,
```javascript
   // "price < 10.25 && (category == 2 || category == 1 || (in_stock == 1))"
```

You can use the above definition in node rules engine like below format,
```javascript
    var RuleEngine = require("node-rules");
 
/* Creating Rule Engine instance */
var R = new RuleEngine();
 
/* Add a rule */
var rule = {
    "condition": (R) => {
        console.log(this);
        R.when(eval([<PUT-THE-ABOVE-OUTPUT-HERE>]));
    },
    "consequence": (R) => {
        this.result = false;
        this.reason = "Put some reason message as needed.";
        R.stop();
    }
};
 
/* Register Rule */
R.register(rule);
```

Here is a runkit example: https://runkit.com/aravindnc/query-builder-to-string

Reference for JSON rules for Node Rules,
- https://www.npmjs.com/package/node-rules


## Supported Operations

Currently the library support below operations only,

- Equal
- Less Than
- Less Than or Equal To
- Greater Than
- Greater Than or Equal To

This is the draft version of the library, which you can use for your basic needs if you are using Node Rules.

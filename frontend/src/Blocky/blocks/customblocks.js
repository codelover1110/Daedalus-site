/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks



import * as Blockly from 'blockly/core';
import {v4 as uuidv4} from "uuid"

// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';
// import {returnCryptoList} from './AssetLists/cryptoList';
// var cryptoList = require('./AssetLists/cryptoList');
var cryptoList = require('./AssetLists/cryptoListAlpaca');
var stockList = require('./AssetLists/stockList');
let coinList = require("../../_services/thirdparty/coinbase").getAllCoinbaseAssets
cryptoList = cryptoList.list;
stockList = stockList.list;
// cryptoList =stockList;
var loaded = {loaded: false, data:[["Loading...", ""]]}
let a = (async function(){
  // let loadingData = await coinList()
  // let sortedData = loadingData.data.filter(asset=> asset.match(/USD$/)).sort().map(x=> [x.match(/.*(?=-)/)[0], x])
  let sortedData = cryptoList
  if(sortedData){
    loaded.loaded = true
    loaded.data = [...sortedData]
  }
})()
  console.log(cryptoList[0][1]);

//Dynamic Rendering of this list in the crypto  drop down menu
  Blockly.Extensions.register('cryptoList_extension',
    function() {
      // let y = await coinList()
      // let z= y.data.filter(asset=> asset.match(/USD$/)).sort().map(x=> [x.match(/.*(?=-)/)[0], x])
      let x =0;
      this.getInput('CRYPTOLIST')
        .appendField(new Blockly.FieldDropdown(
          function() {
            var options = [];
       
            for(var i = 0; i < loaded.data.length; i++) {
x++;
              options.push(loaded.data[i]);

            }
            return options;
            console.log(options);
          }), "CRYPTO");
    });

let priceOf_block = {
  "type": "priceOf_dropdown",
  "message0": "Price of %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",

    }
  ],
  "extensions": ["cryptoList_extension"],
  "output": true,
}

let constant_block = {
  "type": "constant",
  "message0": "%1",
  "args0": [
    {
      "type": "field_input",
      "name": "constantvalue",

    }
  ],
  "output": true,
}

let boolean_block = {
  "type": "buul",
  "message0": "%1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "buulean",
      "options": [
        ["True", "True"],
        ["False", "False"]
      ]

    }
  ],
  "output": true,
}

let tweetContains_block = {

    "type": "send_tweet_block",
    "message0": "Tweet from Twitter User @%1",
    "args0": [
      {
        "type": "field_input",
        "name": "USER",
      }
    ],
    "message1": "contains: %1 ",
    "args1": [
      {
        "type": "input_dummy",
        "name": "CRYPTOLIST",

      }
    ],
    "message2": "and Sentiment: %1 ",
    "args2": [
      {
        "type": "field_dropdown",
        "name": "SENTIMENT",
        "options": [
          [ 'Positive', 'POS' ],
  [ 'Negative', 'NEG' ],

        ]
      }
    ],

      "output": true,
      "extensions": ["cryptoList_extension"],

}
let subredditContains_block = {

    "type": "subredditContains",
    "message0": "Subreddit r/%1",
    "args0": [
      {
        "type": "field_input",
        "name": "USER",

      }
    ],
    "message1": " 's discussion contains: %1 ",
    "args1": [
      {
        "type": "input_dummy",
        "name": "CRYPTOLIST",
      }
    ],
    "message2": "and Sentiment: %1 ",
    "args2": [
      {
        "type": "field_dropdown",
        "name": "SENTIMENT",
        "options": [
          [ 'Positive', 'POS' ],
  [ 'Negative', 'NEG' ],

        ]
      }
    ],

      "output": true,
      "extensions": ["cryptoList_extension"],

}

let newsOutletContains_block = {

    "type": "newsOutletContains_block",
    "message0": "The latest article from News Outlet ",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "News Outlet",
        "options": [
          ['CNN', 'CNN'],
          ['Bloomberg', 'Bloomberg'],
          ['NBC','NBC'],
          ['FOX NEWS', 'FOX News']

        ]

      }
    ],
    "message1": "contains: %1 ",
    "args1": [
      {
        "type": "input_dummy",
        "name": "CRYPTOLIST",
      }
    ],
    "message2": "and Sentiment: %1 ",
    "args2": [
      {
        "type": "field_dropdown",
        "name": "FIELDNAME",
        "options": [
          [ 'Positive', 'POS' ],
  [ 'Negative', 'NEG' ],

        ]
      }
    ],

      "output": true,
      "extensions": ["cryptoList_extension"],

}

let SMA200_block = {
  "type": "SMA200_dropdown",
  "message0": "Price of %2 %1 Simple Moving Avg (200) ",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDSMA200CROSSOVER"],
        ["crossunder", "INDSMA200CROSSUNDER"]
      ]
    },
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}


let SMA50_block = {
  "type": "SMA50_dropdown",
  "message0": "Price of %2 %1 Simple Moving Avg (50)",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDSMA50CROSSOVER"],
        ["crossunder", "INDSMA50CROSSUNDER"]
      ]
    }, 
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let RSI_block = {
  "type": "RSI_dropdown",
  "message0": "RSI (14) of %1",
  "args0": [
    {"type": "input_dummy",
    "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}


let MACD1226_block = {
  "type": "MACD1226",
  "message0": "MACD (9,12,26) histogram of %2 %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDMACDCROSSOVER"],
        ["crossunder", "INDMACDCROSSUNDER"]
      ]
    }, 
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}


let MACD9Day_block = {
  "type": "MACD9Day",
  "message0": "MACD 9 Day Signal of %1",
  "args0": [
    {"type": "input_dummy",
    "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let VWAP_block = {
  "type": "VWAP_dropdown",
  "message0": "VWAP of %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}



let PriceChange = {
  "type": "PricePercentChange",
  "message0": "Price Percent Change of %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}



let ExponentialMovingAvg20Day= {
  "type": "ExponentialMovingAvg20Day",
  "message0": "Price of %2 %1 Exponential Moving Avg (20)",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDEMA20CROSSOVER"],
        ["crossunder", "INDEMA20CROSSUNDER"]
      ]
    }, {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let ExponentialMovingAvg9Day= {
  "type": "ExponentialMovingAvg9Day",
  "message0": "Price of %2 %1 Exponential Moving Avg (9)",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDEMA9CROSSOVER"],
        ["crossunder", "INDEMA9CROSSUNDER"]
      ]
    }, {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let ExponentialMovingAvg55Day= {
  "type": "ExponentialMovingAvg55Day",
  "message0": "Price of %2 %1 Exponential Moving Avg (55)",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDEMA55CROSSOVER"],
        ["crossunder", "INDEMA55CROSSUNDER"]
      ]
    }, {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let ExponentialMovingAvg89Day= {
  "type": "ExponentialMovingAvg89Day",
  "message0": "Price of %2 %1 Exponential Moving Avg (89)",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "strat",
      "options": [
        ["crossover", "INDEMA89CROSSOVER"],
        ["crossunder", "INDEMA89CROSSUNDER"]
      ]
    }, {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let UpperBoilingerBand20= {
  "type": "UpperBoilingerBand20",
  "message0": "Upper Boilinger Band (20 Day Period) of %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let LowerBoilingerBand20= {
  "type": "LowerBoilingerBand20",
  "message0": "Lower Boilinger Band (20 Day Period) of%1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "output": true,
  "extensions": ["cryptoList_extension"],
}

let dollar_value_block ={
  "type": "dollar_value",
  "message0": "$ %1",
  "args0": [
    {
      "type": "field_number",
      "name": "DOLLAR_VALUE",

    }
  ],
    "output": true,
}


let sell_block = {
  "type": "sell_block",
  "message0": "Sell $ %1 worth",
  "args0": [
    {
      "type": "field_number",
      "name": "SELL_AMOUNT",

    }
  ],
  "message1": "of%1 ",
  "args1": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
  "extensions": ["cryptoList_extension"],
}

let buy_block = {
  "type": "buy_block",
  "message0": "Buy $ %1 worth",
  "args0": [
    {
      "type": "field_number",
      "name": "BUY_AMOUNT",

    }
  ],
  "message1": "of%1 ",
  "args1": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
  "extensions": ["cryptoList_extension"],
}

let sell_qty_block = {
  "type": "sell_qty_block",
  "message0": "Sell %1 ",
  "args0": [
    {
      "type": "field_number",
      "name": "SELL_AMOUNT",

    }
 
  ],
  "message1": "%1 ",
  "args1": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
  "extensions": ["cryptoList_extension"],
}

let buy_qty_block = {
  "type": "buy_qty_block",
  "message0": "Buy %1 ",
  "args0": [
    {
      "type": "field_number",
      "name": "BUY_AMOUNT",

    }
    // , {
    //   "type": "input_dummy",
    //   "name": "CRYPTOLIST",
    // }
  ],
  "message1": "%1 ",
  "args1": [
    {
      "type": "input_dummy",
      "name": "CRYPTOLIST",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
  "extensions": ["cryptoList_extension"],
}

let send_email = {
  "type": "send_email_block",
  "message0": "Send message:%1",
  "args0": [
    {
      "type": "field_input",
      "name": "MESSAGE",

    }
  ],
  "message1": "to email address: %1 ",
  "args1": [
    {
      "type": "field_input",
      "name": "EMAIL_ADDRESS",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
}
let send_text = {
  "type": "send_text_block",
  "message0": "Send Text:%1",
  "args0": [
    {
      "type": "field_input",
      "name": "MESSAGE",

    }
  ],
  "message1": "to phone number: %1 ",
  "args1": [
    {
      "type": "field_number",
      "name": "PHONE_NUMBER",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
}
let send_tweet = {
  "type": "send_tweet_block",
  "message0": "Send Tweet:%1",
  "args0": [
    {
      "type": "field_input",
      "name": "Send Text",

    }
  ],
  "message1": "from twitter user: %1 ",
  "args1": [
    {
      "type": "field_input",
      "name": "FIELDNAME",
    }
  ],
  "previousStatement": true,
  "nextStatement": "Action",
}

Blockly.Blocks['LowerBoilingerBand20'] = {
  init: function() {
    this.jsonInit(LowerBoilingerBand20);
  }
};

Blockly.Blocks['priceOf_dropdown'] = {
  init: function() {
    this.jsonInit(priceOf_block);
  }
};

Blockly.Blocks['constant'] = {
  init: function() {
    this.jsonInit(constant_block);
  }
};

Blockly.Blocks['buul'] = {
  init: function() {
    this.jsonInit(boolean_block);
  }
};

Blockly.Blocks['UpperBoilingerBand20'] = {
  init: function() {
    this.jsonInit(UpperBoilingerBand20);
  }
};
Blockly.Blocks['ExponentialMovingAvg89Day'] = {
  init: function() {
    this.jsonInit(ExponentialMovingAvg89Day);
  }
};
Blockly.Blocks['ExponentialMovingAvg55Day'] = {
  init: function() {
    this.jsonInit(ExponentialMovingAvg55Day);
  }
};
Blockly.Blocks['ExponentialMovingAvg9Day'] = {
  init: function() {
    this.jsonInit(ExponentialMovingAvg9Day);
  }
};
Blockly.Blocks['ExponentialMovingAvg20Day'] = {
  init: function() {
    this.jsonInit(ExponentialMovingAvg20Day);
  }
};
Blockly.Blocks['PricePercentChange'] = {
  init: function() {
    this.jsonInit(PriceChange);
  }
};
Blockly.Blocks['MACD9Day'] = {
  init: function() {
    this.jsonInit(MACD9Day_block);
  }
};
Blockly.Blocks['dollar_value'] = {
  init: function() {
    this.jsonInit(dollar_value_block);
  }
};
Blockly.Blocks['send_tweet_block'] = {
  init: function() {
    this.jsonInit(send_tweet);
  }
};

Blockly.Blocks['send_email_block'] = {
  init: function() {
    this.jsonInit(send_email);
  }
};

Blockly.Blocks['send_text_block'] = {
  init: function() {
    this.jsonInit(send_text);
  }
};


Blockly.Blocks['buy_block'] = {
  init: function() {
    this.jsonInit(buy_block);
  }
};
Blockly.Blocks['sell_block'] = {
  init: function() {
    this.jsonInit(sell_block);
  }
};

Blockly.Blocks['buy_qty_block'] = {
  init: function() {
    this.jsonInit(buy_qty_block);
  }
};
Blockly.Blocks['sell_qty_block'] = {
  init: function() {
    this.jsonInit(sell_qty_block);
  }
};

Blockly.Blocks['MACD1226'] = {
  init: function() {
    this.jsonInit(MACD1226_block);
  }
};
Blockly.Blocks['VWAP_dropdown'] = {
  init: function() {
    this.jsonInit(VWAP_block);
  }
};
Blockly.Blocks['RSI_dropdown'] = {
  init: function() {
    this.jsonInit(RSI_block);
  }
};
Blockly.Blocks['SMA50_dropdown'] = {
  init: function() {
    this.jsonInit(SMA50_block);
  }
};
Blockly.Blocks['SMA200_dropdown'] = {
  init: function() {
    this.jsonInit(SMA200_block);
  }
};
Blockly.Blocks['newsOutletContains_block'] = {
  init: function() {
    this.jsonInit(newsOutletContains_block);
  }
};


Blockly.Blocks['subredditContains'] = {
  init: function() {
    this.jsonInit(subredditContains_block);
  }
};

Blockly.Blocks['tweet_contains'] = {
  init: function() {
    this.jsonInit(tweetContains_block);
  }
};

// Block's javascript code
Blockly.JavaScript['tweet_contains'] = function(block) {
  var text_user = block.getFieldValue('USER');
  var dropdown_crypto = block.getFieldValue('CRYPTO');
  var dropdown_sentiment = block.getFieldValue('SENTIMENT');
  // TODO: Assemble JavaScript into code variable.
  var code = `${text_user}: send tweet ${dropdown_crypto} with ${dropdown_sentiment}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['subredditContains'] = function(block) {
  var text_user = block.getFieldValue('USER');
  var dropdown_crypto = block.getFieldValue('CRYPTO');
  var dropdown_sentiment = block.getFieldValue('SENTIMENT');
  // TODO: Assemble JavaScript into code variable.
  var code = `${text_user}: post reddit ${dropdown_crypto} with ${dropdown_sentiment}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['UpperBoilingerBand20'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  let asset = block.getFieldValue("CRYPTO")
  var code = `INDUPPERBOLLINGERBANDSx${asset}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['LowerBoilingerBand20'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  let asset = block.getFieldValue("CRYPTO")
  var code = `INDLOWERBOLLINGERBANDSx${asset}`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

  Blockly.JavaScript['priceOf_dropdown'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    var code = `INDPRICE`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['ExponentialMovingAvg89Day'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['ExponentialMovingAvg55Day'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['ExponentialMovingAvg9Day'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['ExponentialMovingAvg20Day'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['PricePercentChange'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    var code = `PRICEPERCENTCHANGE`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['MACD9Day'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    var code = `INDMACD`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['buy_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let amount = block.getFieldValue("BUY_AMOUNT")
    let asset = block.getFieldValue("CRYPTO")
    // var code = `result= ACTBUY`;
    // var code = `result = {action: "buy", amount:${amount}, id: "${uuidv4()}"}`
    let code = `executeTrade({action: "buy", amount:${amount}, id: "${uuidv4()}", asset:"${asset}", qtySpecified: false})`
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };

  Blockly.JavaScript['sell_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let amount = block.getFieldValue("SELL_AMOUNT")
    let asset = block.getFieldValue("CRYPTO")
    // var code = `result= ACTSELL`;
    // var code = `result = {action: "sell", amount:${amount}, id: "${uuidv4()}"}`
    let code = `executeTrade({action: "sell", amount:${amount}, id: "${uuidv4()}",asset:"${asset}", qtySpecified: false})`
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };

  Blockly.JavaScript['buy_qty_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let amount = block.getFieldValue("BUY_AMOUNT")
    let asset = block.getFieldValue("CRYPTO")
    // var code = `result= ACTBUY`;
    // var code = `result = {action: "buy", amount:${amount}, id: "${uuidv4()}"}`
    let code = `executeTrade({action: "buy", amount:${amount}, id: "${uuidv4()}",asset:"${asset}", qtySpecified: true})`
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };

  Blockly.JavaScript['sell_qty_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let amount = block.getFieldValue("SELL_AMOUNT")
    let asset = block.getFieldValue("CRYPTO")
    // var code = `result= ACTSELL`;
    // var code = `result = {action: "sell", amount:${amount}, id: "${uuidv4()}"}`
    let code = `executeTrade({action: "sell", amount:${amount}, id: "${uuidv4()}",asset:"${asset|| ""}", qtySpecified: "t"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };

  Blockly.JavaScript['MACD1226'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['RSI_dropdown'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    var code = `await calculateIndicatorValues({indicator:"INDRSI14", asset:"${asset|| ""}"})`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['VWAP_dropdown'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    var code = `INDVWAP`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['dollar_value'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("DOLLAR_VALUE")
    var code = `INDPRICE`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['SMA50_dropdown'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['SMA200_dropdown'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("CRYPTO")
    let indicator = block.getFieldValue("strat")
    var code = `await calculateIndicatorValues({indicator:"${indicator}", asset:"${asset|| ""}"})`
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['constant'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("constantvalue")
    var code = asset;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['buul'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let asset = block.getFieldValue("buulean")
    var code = asset;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['send_text_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let pn = block.getFieldValue("PHONE_NUMBER")
    let message = block.getFieldValue("MESSAGE")
    var code = `result= ACTmessage:${message} phoneNumber:${pn}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };

  Blockly.JavaScript['send_email_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    let message = block.getFieldValue("MESSAGE")
    let email = block.getFieldValue("EMAIL_ADDRESS")
    var code = `result= ACTmessage: ${message} email:${email}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return code
  };
const ccxt = require("ccxt");

// MAINNET
const mainnet = new ccxt.binance({
    apiKey: "t2FXKzeJjm4WlKqmfzt1qHmJfAp98kELICtuHTBmF8NouiEilwAWHJNxxMW92Iki",
    secret: "MLRC835naVSV6pM2JAUXvLCcLeLcxWwxEQOgrVD2Joztm0oBtEmaHKqyFExaJR8B",
    // apiKey: process.env.BINANCE_API_KEY,
    // secret: process.env.BINANCE_API_SECRET,
    options: { adjustForTimeDifference: true, defaultType: "future", hedgeMode: false }
});

// TESTNET
const testnet = new ccxt.binance({
    apiKey: process.env.BINANCE_TEST_API_KEY,
    secret: process.env.BINANCE_TEST_API_SECRET,
    options: { adjustForTimeDifference: true, defaultType: "future", hedgeMode: false }
});

// SANDBOX
testnet.setSandboxMode(true);

// EXCHANGE
const debug = false;
const exchange = debug ? testnet : mainnet;

// EXPORT
module.exports = exchange;
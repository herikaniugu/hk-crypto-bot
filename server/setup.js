const exchange = require("./exchange");

// ASSET
const quote = "BTC", base = "USDT";
const symbol = [quote, base].join("");

// EXPORT
module.exports = (request, response) => {
    // LEVERAGE
    const leverage = 20;
    // SETUP
    exchange.fapiPrivateGetPositionSideDual().then((data) => {
        // DUAL
        if (data.dualSidePosition) return exchange.fapiPrivatePostPositionSideDual({ dualSidePosition: false });
    }).then(() => {
        // RISK
        return exchange.fapiPrivateGetPositionRisk().then((data) => data.filter((item) => item.symbol === symbol).shift());
    }).then((data) => {
        // MARGIN
        if (data?.marginType === "cross") return exchange.fapiPrivatePostMarginType({ symbol: symbol, marginType: "ISOLATED", leverage: leverage });
    }).then(() => exchange.fapiPrivatePostLeverage({ symbol: symbol, leverage: leverage })).then((data) => {
        // DATA
        response.json(data);
    }).catch((error) => {
        // ERROR
        console.log(error);
        response.json(error);
    });
};
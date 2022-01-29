const exchange = require("./exchange");

module.exports = (request, response) => {
    // BALANCE
    exchange.fapiPrivateGetBalance().then((fapi) => {
        return exchange.dapiPrivateGetBalance().then((dapi) => {
            const data = fapi.concat(dapi).filter((item) => parseFloat(item.balance)).map((item) => {
                return {
                    account: item.accountAlias,
                    asset: item.asset,
                    balance: item.balance
                };
            });
            response.json(data);
        });
    }).catch((error) => {
        // ERROR
        response.json(error);
    });
};
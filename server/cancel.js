const exchange = require("./exchange");

// EXPORT
module.exports = (request, response) => {
    exchange.fetchPositions().then(async (data) => {
        const positions = data.filter((item) => item.entryPrice > 0);
        return await Promise.all(positions.map((position) => exchange.createOrder(position.symbol, "MARKET", position.side === "long" ? "SELL" : "BUY", position.notional, undefined, { reduceOnly : true }))).then(async (allpositions) => {
            return await exchange.fapiPrivateGetOpenOrders().then(async (orders) => {
                return await Promise.all(orders.map((order) => exchange.cancelOrder(order.orderId, order.symbol))).then((allorders) => {
                    response.json({ positions: allpositions, orders: allorders });
                });
            });
        });
    }).catch((error) => {
        // ERROR
        console.log(error);
        response.json(error);
    });
};
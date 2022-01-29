const exchange = require("./exchange");

// PRECISION
const precision = (number, position = 2) => {
    const factor = Math.pow(10, position);
    return Math.floor((position < 0 ? number : 0.01 / factor + number) * factor) / factor;
};

module.exports = (request, response) => {
    /*
    {
        "pair": "BTCUSDT",
        "action": "long",
        "amount": 100,
        "price": 37739.78,
        "stop": 37418.19,
        "limit": 38048.83
    }
    */
    const pair = request.body.pair;
    const amount = request.body.amount;
    const action = request.body.action;
    const symbol = pair;
    // POSITIONS
    if (["long", "short"].indexOf(action) >= 0) return exchange.fetchPositions().then(async (positions) => {
        // AVAILABLE
        const available = positions.filter((item) => item.info.symbol === symbol && item.entryPrice > 0).length === 0;
        // VIEW
        if (available) return await exchange.fapiPrivateGetOpenOrders(pair).then(async (orders) => {
            // CANCEL
            return await Promise.all(orders.filter((order) => order.symbol === symbol).map((order) => exchange.cancelOrder(order.orderId, order.symbol))).then(async () => {
                // ORDER
                response.json({ available: available, positions: positions, orders: orders });
                // // ORDER
                // return await exchange.createOrder(pair, "MARKET", action.type === "long" ? "BUY" : "SELL", precision(amount / price, decimal.amount), undefined, { positionSide: "BOTH" }).then(async (order) => {
                //     // return await exchange.createOrder(pair, "TRAILING_STOP_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, resistance, { activationPrice: resistance, callbackRate: 0.08 * 3 }).then(() => {
                //     return await exchange.createOrder(pair, "TAKE_PROFIT_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, resistance, { closePosition: true, stopPrice: resistance }).then(async () => {
                //         return await exchange.createOrder(pair, "STOP_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, support, { closePosition: true, stopPrice: support }).then(async () => {
                //             console.log(runtime, { pair: pair, order: order });
                //         });
                //     });
                // });
            });
        });
        response.json(request.body);
    });
    response.json(request.body);
};
const exchange = require("./exchange");

// PRECISION
const precision = (number, position) => {
    const factor = Math.pow(10, position);
    return Math.floor((position < 0 ? number : 0.01 / factor + number) * factor) / factor;
};

module.exports = (request, response) => {
    // POST
    const action = request.body.action;
    const amount = request.body.amount;
    const price = request.body.price;
    const limit = request.body.data?.slit("/")[0];
    const stop = request.body.data?.slit("/")[1];
    // ASSET
    const quote = "BTC", base = "USDT";
    const pair = [quote, base].join("/");
    const symbol = [quote, base].join("");
    // POSITIONS
    if (["long", "short"].indexOf(action) >= 0 && amount && price && limit && stop) return exchange.fetchPositions().then(async (positions) => {
        // AVAILABLE
        const available = positions.filter((item) => item.info.symbol === symbol && item.entryPrice > 0).length === 0;
        // VIEW
        if (available) return await exchange.fapiPrivateGetOpenOrders(pair).then(async (orders) => {
            // CANCEL
            return await Promise.all(orders.filter((order) => order.symbol === symbol).map((order) => exchange.cancelOrder(order.orderId, order.symbol))).then(async () => {
                // ORDER
                return await exchange.createOrder(pair, "MARKET", action === "long" ? "BUY" : "SELL", precision(amount / price, 3), undefined, { positionSide: "BOTH" }).then(async (order) => {
                    return await exchange.createOrder(pair, "TAKE_PROFIT_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, limit, { closePosition: true, stopPrice: limit }).then(async () => {
                        return await exchange.createOrder(pair, "STOP_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, stop, { closePosition: true, stopPrice: stop }).then(async () => {
                            response.json({ request: request.body, order: order });
                        });
                    });
                });
            });
        });
        response.json(request.body);
    });
    response.json(request.body);
};
const exchange = require("./exchange");

module.exports = (request, response) => {
    response.json({ done: true });


    
            /*
            // PAIR
            const pair = [quote, base].join("/");
            const symbol = [quote, base].join("");
            // RUNTIME
            runtime += 1;
            // DATA
            exchange.fetchOHLCV(pair, "1m").then(async (data) => {
                // STRATEGY
                const action = strategy(data.map((item) => item[4]));
                // CONFIRMATION
                const confirmation = ["long", "short"].indexOf(action.type) >= 0;
                // POSITION
                if (confirmation) return await exchange.fetchPositions().then(async (positions) => {
                    // PRICE
                    const price = action.price;
                    // RESISTANCE
                    const resistance = action.resistance;
                    // SUPPORT
                    const support = action.support;
                    // AVAILABLE
                    const available = positions.filter((item) => item.info.symbol === symbol && item.entryPrice > 0).length === 0;
                    // VIEW
                    if (available) return await exchange.fapiPrivateGetOpenOrders(pair).then(async (orders) => {
                        // CANCEL
                        return await Promise.all(orders.filter((order) => order.symbol === symbol).map((order) => exchange.cancelOrder(order.orderId, order.symbol))).then(async () => {
                            // ORDER
                            return await exchange.createOrder(pair, "MARKET", action.type === "long" ? "BUY" : "SELL", precision(amount / price, decimal.amount), undefined, { positionSide: "BOTH" }).then(async (order) => {
                                // return await exchange.createOrder(pair, "TRAILING_STOP_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, resistance, { activationPrice: resistance, callbackRate: 0.08 * 3 }).then(() => {
                                return await exchange.createOrder(pair, "TAKE_PROFIT_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, resistance, { closePosition: true, stopPrice: resistance }).then(async () => {
                                    return await exchange.createOrder(pair, "STOP_MARKET", order.side === "buy" ? "SELL" : "BUY", order.amount, support, { closePosition: true, stopPrice: support }).then(async () => {
                                        console.log(runtime, { pair: pair, order: order });
                                    });
                                });
                            });
                        });
                    });
                    console.log(runtime, { pair: pair, confirmation: true });
                });
                console.log(runtime, { pair: pair, confirmation: false });
            }).catch((error) => {
                // ERROR
                console.log(error);
            });
            */
};
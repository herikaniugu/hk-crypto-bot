const exchange = require("./exchange");
const indicator = require("./indicator");

const backtest = new Object();
backtest.each = (data, atr, alpha = 15, beta = 45) => {
    const cluster = new Array(), order = new Object(); let initiate = true;
    indicator.cross(data, indicator.sma(data, alpha), indicator.sma(data, beta)).forEach((item) => {
        if (initiate) {
            if (item.type === "short") {
                initiate = false; order.type = "short"; order.entry = item.close; order.atr = atr[item.index];
                order.risk = item.high + atr[item.index]; order.reward = item.low - atr[item.index] * 2;
            } else if (item.type === "long") {
                initiate = false; order.type = "long"; order.entry = item.close; order.atr = atr[item.index];
                order.risk = item.low - atr[item.index]; order.reward = item.high + atr[item.index] * 2;
            }
        }
        if (!initiate) {
            if (order.type === "short") {
                if (order.risk >= item.low && order.risk <= item.high) {
                    order.high = item.high; order.open = item.open; order.close = item.close; order.low = item.low;
                    order.value = (order.entry - order.risk) / order.entry * 100; order.outcome = "loss";
                    cluster.push(Object.assign({}, order)); initiate = true;
                } else if (order.reward >= item.low && order.reward <= item.high) {
                    order.high = item.high; order.open = item.open; order.close = item.close; order.low = item.low;
                    order.value = (order.entry - order.reward) / order.entry * 100; order.outcome = "profit";
                    cluster.push(Object.assign({}, order)); initiate = true;
                }
            } else if (order.type === "long") {
                if (order.risk >= item.low && order.risk <= item.high) {
                    order.high = item.high; order.open = item.open; order.close = item.close; order.low = item.low;
                    order.value = (order.risk - order.entry) / order.risk * 100; order.outcome = "loss";
                    cluster.push(Object.assign({}, order)); initiate = true;
                } else if (order.reward >= item.low && order.reward <= item.high) {
                    order.high = item.high; order.open = item.open; order.close = item.close; order.low = item.low;
                    order.value = (order.reward - order.entry) / order.reward * 100; order.outcome = "profit";
                    cluster.push(Object.assign({}, order)); initiate = true;
                }
            }
        }
    });
    const income = cluster.map((item) => indicator.precision(item.value));
    const win = income.filter((value) => value > 0).reduce((a, b) => a + b, 0);
    const loss = income.filter((value) => value < 0).reduce((a, b) => a + b, 0), total = income.reduce((a, b) => a + b, 0);
    return { alpha: alpha, beta: beta, win: win, loss: loss, total: total, count: cluster.length, data: cluster };
};
backtest.scanner = (data) => {
    const stack = new Array(), atr = indicator.atr(data);
    for (let alpha = 10; alpha < 50; alpha++) {
        for (let beta = 10; beta < 50; beta++) {
            const item = backtest.each(data, atr, alpha, beta);
            stack.push({ count: item.count, alpha: item.alpha, beta: item.beta, win: item.win, loss: item.loss, total: item.total });
        }
    }
    return stack.sort((a, b) => b.total - a.total).filter((none, index) => index < 10);
};
backtest.experiment = (data, alpha, beta) => backtest.each(data, indicator.atr(data), alpha, beta);

module.exports = (request, response) => {
    exchange.fetchOHLCV("BTC/USDT", "5m").then((data) => {
        response.json(backtest.scanner(indicator.ohlc(data)));
    }).catch((error) => {
        response.json(error);
        console.log(error);
    });
};
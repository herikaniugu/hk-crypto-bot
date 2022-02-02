const exchange = require("./exchange");
const indicator = require("./indicator");

const strategy = (data) => {
    const scanner = async (alpha = 50, beta = 100) => {
        const cluster = new Array(), order = new Object(); let initiate = true;
        indicator.cross(data, indicator.sma(data, alpha), indicator.sma(data, beta)).forEach((item) => {
            if (initiate) {
                if (item.type === "short") {
                    initiate = false; order.type = "short"; order.source = item.price;
                    order.limit = order.source - 400; order.stop = order.source + 400;
                } else if (item.type === "long") {
                    initiate = false; order.type = "long"; order.source = item.price;
                    order.limit = order.source + 400; order.stop = order.source - 400;
                }
            } else {
                if (order.type === "short") {
                    if (item.bounce <= order.limit) {
                        order.price = item.price; order.bounce = item.bounce; order.outcome = "profit";
                        order.value = indicator.precision((order.source - order.price) / order.source * 100);
                        cluster.push(Object.assign({}, order)); initiate = true;
                    } else if (item.bounce >= order.stop) {
                        order.price = item.price; order.bounce = item.bounce; order.outcome = "loss";
                        order.value = indicator.precision((order.source - order.price) / order.source * 100);
                        cluster.push(Object.assign({}, order)); initiate = true;
                    }
                } else if (order.type === "long") {
                    if (item.bounce >= order.limit) {
                        order.price = item.price; order.bounce = item.bounce; order.outcome = "profit";
                        order.value = indicator.precision((order.price - order.source) / order.price * 100);
                        cluster.push(Object.assign({}, order)); initiate = true;
                    } else if (item.bounce <= order.stop) {
                        order.price = item.price; order.bounce = item.bounce; order.outcome = "loss";
                        order.value = indicator.precision((order.price - order.source) / order.price * 100);
                        cluster.push(Object.assign({}, order)); initiate = true;
                    }
                }
            }
        });
        const income = cluster.map((item) => item.value);
        const win = income.filter((value) => value > 0).reduce((a, b) => a + b, 0);
        const loss = income.filter((value) => value < 0).reduce((a, b) => a + b, 0), total = income.reduce((a, b) => a + b, 0);
        return { alpha: alpha, beta: beta, win: win, loss: loss, total: total, count: cluster.length, data: cluster };
    };
    const cluster = new Array();
    for (let alpha = 10; alpha < 200; alpha++) {
        for (let beta = 10; beta < 200; beta++) {
            const item = await scanner(alpha, beta);
            cluster.push({ count: item.count, alpha: item.alpha, beta: item.beta, win: item.win, loss: item.loss, total: item.total });
        }
    }
    return cluster.sort((a, b) => b.total - a.total).filter((none, index) => index < 10);
};
module.exports = (request, response) => {
    exchange.fetchOHLCV("BTC/USDT", "5m").then((data) => {
        response.json(strategy(indicator.ohlc(data)));
    }).catch((error) => {
        response.json(error);
        console.log(error);
    });
};
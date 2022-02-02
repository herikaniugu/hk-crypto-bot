const exchange = require("./exchange");
const indicator = require("./indicator");

const strategy = (data) => {
    const scanner = (alpha = 50, beta = 100) => {
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
        return { alpha: alpha, beta: beta, income: cluster.map((item) => item.value).reduce((a, b) => a + b, 0), count: cluster.length, data: cluster };
    };
    const array = new Array();
    for (let x = 10; x < 200; x++) {
        for (let y = 10; y < 200; y++) {
            const item = scanner(x, y);
            array.push({ count: item.count, alpha: item.alpha, beta: item.beta, income: item.income });
        }
    }
    return array.sort((a, b) => b.income - a.income).filter((none, index) => index < 10);
};
module.exports = (request, response) => {
    exchange.fetchOHLCV("BTC/USDT", "5m").then((data) => {
        response.json(strategy(indicator.ohlc(data)));
    }).catch((error) => {
        response.json(error);
        console.log(error);
    });
};
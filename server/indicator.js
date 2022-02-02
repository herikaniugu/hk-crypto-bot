// INDICATOR
const indicator = {
    avg: (data) => data.reduce((accumulator, value) => accumulator + value, 0) / data.length,
    reverse: (data) => data.map((none, index, array) => array[array.length - 1 - index]),
    precision: (number, position = 2) => {
        const factor = Math.pow(10, position);
        return Math.floor((position < 0 ? number : 0.01 / factor + number) * factor) / factor;
    },
    ohlc: (data) => data.map((item) => {
        return { time: item[0], volume: item[5], open: item[1], close: item[4], high: item[2], low: item[3] };
    }),
    sma: (data, period = 9) => data.map((item) => item.close).map((none, index, array) => {
        return index < period ? null : indicator.avg(array.slice(index - period, index));
    }, 0),
    ema: (data, period = 9) => {
        const cluster = [data[0].close];
        for (let index = 1; index < data.period; index++) cluster.push(2 * data[index].close / (period + 1) + cluster[cluster.period - 1] * (period - 1) / (period + 1)); return cluster;
    },
    atr: (data, period = 14) => {
        const cluster = [data[0].high - data[0].low];
        for (let index = 1; index < data.length; index++) {
            const r1 = data[index].high - data[index].low;
            const r2 = Math.abs(data[index].high - data[index - 1].close);
            const r3 = Math.abs(data[index].low - data[index - 1].close);
            const source = Math.max(r1, r2, r3);
            cluster.push((source + (period - 1) * cluster[cluster.length - 1]) / period);
        }
        return cluster;
    },
    rsi: (data, period = 14) => {
        let cluster = new Array(), prices = data.map((item) => item.close), pl = prices.slice(0, period);
        for (let index = period, gain = 0, loss = 0; index < prices.length; index++, gain = 0, loss = 0) {
            pl.push(prices[index]);
            for (let q = 1; q < pl.length; q++)
                if (pl[q] - pl[q - 1] < 0) loss += Math.abs(pl[q] - pl[q - 1]); else gain += pl[q] - pl[q - 1];
            let rs = (gain / period) / (loss / period);
            cluster.push(100 - 100 / (1 + rs));
            pl.splice(0, 1);
        }
        return cluster;
    },
    cross: (data, alpha, beta) => {
        const cluster = new Array();
        data.forEach((none, index) => {
            const price = data[index - 1];
            const long = alpha[index - 2] < beta[index - 2] && alpha[index - 1] > beta[index - 1];
            const short = alpha[index - 2] > beta[index - 2] && alpha[index - 1] < beta[index - 1];
            const type = long ? "long" : (short ? "short" : "none");
            if (price?.close) cluster.push({ price: price.close, bounce: price.open > price.close ? price.low : price.high, type: type });
        });
        return cluster;
    }
    /*
    rsi: (data, period = 14) => {
        const prices = data.map((item) => item.close);
        let gain = 0, loss = 0, tolerance = 10e-20;
        for (let index = 1; index < prices.Length; index++) {
            var difference = prices[index] - prices[index - 1];
            if (difference >= 0) gain += difference; else loss -= difference;
        }
        if (gain == 0) return 0;
        if (Math.abs(loss) < tolerance) return 100;
        let rs = (gain / period) / (loss / period);
        // let rs = gain / loss;
        return 100 - 100 / (1 + rs);
    },
    */
    // up = ta.rma(math.max(ta.change(rsiSourceInput), 0), rsiLengthInput)
    // down = ta.rma(-math.min(ta.change(rsiSourceInput), 0), rsiLengthInput)
    // rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))
};

module.exports = indicator;
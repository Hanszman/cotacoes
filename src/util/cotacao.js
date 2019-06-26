const request = require('request');

const api_token = '7eS5k4nGGsw3Kstp8D8zjMSTODXWmU0JCFgwiiMD15nKRwjcqkZoiNTb5GoF';

const cotacao = (symbol, callback) => {
    
    const url = `https://api.worldtradingdata.com/api/v1/stock?symbol=${symbol}&api_token=${api_token}`;
    
    request({url: url , json: true}, (err, response) => {
        if (err){
            callback({
                message: `Something went wrong: ${err}`,
                code: 500 // status de erro
            }, undefined);
        }

        if (response.body === undefined || response.body.data === undefined){
            callback({
                message: `No data found`,
                code: 404 // status de não encontrado
            }, undefined);
        }

        const parsedJSON = response.body.data[0];

        const {symbol, price_open, price, day_high, day_low} = parsedJSON;
        
        callback(undefined, {symbol, price_open, price, day_high, day_low});
    });
}

module.exports = cotacao
process.env.TZ = 'Asia/Kuala_Lumpur';
require('babel-core/polyfill');

import fs from 'fs';
import ftp from 'ftp-get';
import path from 'path';
import restify from 'restify';

let serverPort = 3000;
let serverIp   = '127.0.0.1';
let nasdaqUrl  = 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt';
let yahooApi   = {
    url: 'https://query.yahooapis.com',
    path: '/v1/public/yql?q='
};
let symbols = [];

const NL  = '\r\n';
const NL2 = NL + NL;

let clean = () => {
    console.log('\r\n');
    process.stdout.write("\x1B[2J\x1B[0f");
};
let drawline = () => {
    console.log(`${NL}= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =`);
};
let getAllSymbols = (symbol) => {
	return new Promise((resolve, reject) => {
		drawline();
	    console.error(NL + `[ * ] Getting Nasdaq data from ${nasdaqUrl}`);
	    ftp.get({
	    	url: nasdaqUrl,
            bufferType: 'buffer'
	    }, (err, result) => {
	    	if (err) {
	    		reject(err);
	    		return
	    	}
	    	let data  = result.toString();
	    	let lines = data.split('\r\n');
	    	lines.slice(1, -2).map(line => {
	    		let values = line.split('|');
	    		symbols.push(values[0]);
	    	});
	    	resolve(symbols);
	    });
	});
};
let getTrade = (symbols='yhoo') => {
	return new Promise((resolve, reject) => {
	    let client = restify.createJsonClient({
	        url: yahooApi.url,
	        agent: false,
	        version: '~1.1'
	    });
	    let sb = symbols.toUpperCase();
	    let dd = `select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${sb}%22)%0A%09%09&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=`;

	    client.get(yahooApi.path+dd, function (err, req1, res1, data) {
	    	if (err) {
	        	reject(err);
	    		return
	    	}
		    resolve(data);
	    });
	});
};

//
// Configure and Start Restify server
//
let server = restify.createServer({
    name: 'Webservice',
    version: '0.1.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS({
    origins: [
        'http://localhost:9000'
    ],
    credentials: true,
    headers: ['x-requested-With', 'x-foo']
}));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

server.get('/trade/:symbol', async function(req, res, next) {
    let params  = req.params;
    let options = params.options || {};
    let trades  = {};

    try {
    	if (symbols.length == 0) {
    		symbols = await getAllSymbols(params.symbol);
    	}

	    if (symbols.indexOf(params.symbol.toUpperCase()) === -1) {
	        let error = `Symbol "${params.symbol}" is not found in Nasdaq`;
	        drawline();
	        console.error(NL + `[ X ] ${error}`);
	        res.send(400, { error });
	        return next();
	    }
		let result = await getTrade(params.symbol);
		trades = result.query;
    } catch (error) {
    	res.send(400, { status:false, error });
        return next();
    }

    res.send(200, { trades });
    return next();
});

server.listen(serverPort, serverIp, () => {
    console.log(`Listening on ${serverIp}, port ${serverPort}`);
});

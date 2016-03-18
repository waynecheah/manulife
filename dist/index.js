'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ftpGet = require('ftp-get');

var _ftpGet2 = _interopRequireDefault(_ftpGet);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

process.env.TZ = 'Asia/Kuala_Lumpur';
require('babel-core/polyfill');

let serverPort = 3000;
let serverIp = '127.0.0.1';
let nasdaqUrl = 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt';
let yahooApi = {
				url: 'https://query.yahooapis.com',
				path: '/v1/public/yql?q='
};
let symbols = [];

const NL = '\r\n';
const NL2 = NL + NL;

let clean = function clean() {
				console.log('\r\n');
				process.stdout.write("\x1B[2J\x1B[0f");
};
let drawline = function drawline() {
				console.log(`${ NL }= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =`);
};
let getAllSymbols = function getAllSymbols(symbol) {
				return new Promise(function (resolve, reject) {
								drawline();
								console.error(NL + `[ * ] Getting Nasdaq data from ${ nasdaqUrl }`);
								_ftpGet2['default'].get({
												url: nasdaqUrl,
												bufferType: 'buffer'
								}, function (err, result) {
												if (err) {
																reject(err);
																return;
												}
												let data = result.toString();
												let lines = data.split('\r\n');
												lines.slice(1, -2).map(function (line) {
																let values = line.split('|');
																symbols.push(values[0]);
												});
												resolve(symbols);
								});
				});
};
let getTrade = function getTrade() {
				let symbols = arguments.length <= 0 || arguments[0] === undefined ? 'yhoo' : arguments[0];

				return new Promise(function (resolve, reject) {
								let client = _restify2['default'].createJsonClient({
												url: yahooApi.url,
												agent: false,
												version: '~1.1'
								});
								let sb = symbols.toUpperCase();
								let dd = `select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${ sb }%22)%0A%09%09&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=`;

								client.get(yahooApi.path + dd, function (err, req1, res1, data) {
												if (err) {
																reject(err);
																return;
												}
												resolve(data);
								});
				});
};

//
// Configure and Start Restify server
//
let server = _restify2['default'].createServer({
				name: 'Webservice',
				version: '0.1.1'
});
server.use(_restify2['default'].acceptParser(server.acceptable));
server.use(_restify2['default'].CORS({
				origins: ['http://localhost:9000'],
				credentials: true,
				headers: ['x-requested-With', 'x-foo']
}));
server.use(_restify2['default'].queryParser());
server.use(_restify2['default'].gzipResponse());
server.use(_restify2['default'].bodyParser());

server.get('/trade/:symbol', function callee$0$0(req, res, next) {
				var params, options, trades, error, result;
				return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
								while (1) switch (context$1$0.prev = context$1$0.next) {
												case 0:
																params = req.params;
																options = params.options || {};
																trades = {};
																context$1$0.prev = 3;

																if (!(symbols.length == 0)) {
																				context$1$0.next = 8;
																				break;
																}

																context$1$0.next = 7;
																return regeneratorRuntime.awrap(getAllSymbols(params.symbol));

												case 7:
																symbols = context$1$0.sent;

												case 8:
																if (!(symbols.indexOf(params.symbol.toUpperCase()) === -1)) {
																				context$1$0.next = 14;
																				break;
																}

																error = `Symbol "${ params.symbol }" is not found in Nasdaq`;

																drawline();
																console.error(NL + `[ X ] ${ error }`);
																res.send(400, { error });
																return context$1$0.abrupt('return', next());

												case 14:
																context$1$0.next = 16;
																return regeneratorRuntime.awrap(getTrade(params.symbol));

												case 16:
																result = context$1$0.sent;

																trades = result.query;
																context$1$0.next = 24;
																break;

												case 20:
																context$1$0.prev = 20;
																context$1$0.t0 = context$1$0['catch'](3);

																res.send(400, { status: false, error: context$1$0.t0 });
																return context$1$0.abrupt('return', next());

												case 24:

																res.send(200, { trades });
																return context$1$0.abrupt('return', next());

												case 26:
												case 'end':
																return context$1$0.stop();
								}
				}, null, this, [[3, 20]]);
});

server.listen(serverPort, serverIp, function () {
				console.log(`Listening on ${ serverIp }, port ${ serverPort }`);
});
//# sourceMappingURL=data:application/json;base64,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USxFQUFDLE9BQU8sR0FBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDL0QsQ0FBQyxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsicHJvY2Vzcy5lbnYuVFogPSAnQXNpYS9LdWFsYV9MdW1wdXInO1xyXG5yZXF1aXJlKCdiYWJlbC1jb3JlL3BvbHlmaWxsJyk7XHJcblxyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgZnRwIGZyb20gJ2Z0cC1nZXQnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHJlc3RpZnkgZnJvbSAncmVzdGlmeSc7XHJcblxyXG5sZXQgc2VydmVyUG9ydCA9IDMwMDA7XHJcbmxldCBzZXJ2ZXJJcCAgID0gJzEyNy4wLjAuMSc7XHJcbmxldCBuYXNkYXFVcmwgID0gJ2Z0cDovL2Z0cC5uYXNkYXF0cmFkZXIuY29tL1N5bWJvbERpcmVjdG9yeS9uYXNkYXFsaXN0ZWQudHh0JztcclxubGV0IHlhaG9vQXBpICAgPSB7XHJcbiAgICB1cmw6ICdodHRwczovL3F1ZXJ5LnlhaG9vYXBpcy5jb20nLFxyXG4gICAgcGF0aDogJy92MS9wdWJsaWMveXFsP3E9J1xyXG59O1xyXG5sZXQgc3ltYm9scyA9IFtdO1xyXG5cclxuY29uc3QgTkwgID0gJ1xcclxcbic7XHJcbmNvbnN0IE5MMiA9IE5MICsgTkw7XHJcblxyXG5sZXQgY2xlYW4gPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnXFxyXFxuJyk7XHJcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShcIlxceDFCWzJKXFx4MUJbMGZcIik7XHJcbn07XHJcbmxldCBkcmF3bGluZSA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGAke05MfT0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPSA9ID0gPWApO1xyXG59O1xyXG5sZXQgZ2V0QWxsU3ltYm9scyA9IChzeW1ib2wpID0+IHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0ZHJhd2xpbmUoKTtcclxuXHQgICAgY29uc29sZS5lcnJvcihOTCArIGBbICogXSBHZXR0aW5nIE5hc2RhcSBkYXRhIGZyb20gJHtuYXNkYXFVcmx9YCk7XHJcblx0ICAgIGZ0cC5nZXQoe1xyXG5cdCAgICBcdHVybDogbmFzZGFxVXJsLFxyXG4gICAgICAgICAgICBidWZmZXJUeXBlOiAnYnVmZmVyJ1xyXG5cdCAgICB9LCAoZXJyLCByZXN1bHQpID0+IHtcclxuXHQgICAgXHRpZiAoZXJyKSB7XHJcblx0ICAgIFx0XHRyZWplY3QoZXJyKTtcclxuXHQgICAgXHRcdHJldHVyblxyXG5cdCAgICBcdH1cclxuXHQgICAgXHRsZXQgZGF0YSAgPSByZXN1bHQudG9TdHJpbmcoKTtcclxuXHQgICAgXHRsZXQgbGluZXMgPSBkYXRhLnNwbGl0KCdcXHJcXG4nKTtcclxuXHQgICAgXHRsaW5lcy5zbGljZSgxLCAtMikubWFwKGxpbmUgPT4ge1xyXG5cdCAgICBcdFx0bGV0IHZhbHVlcyA9IGxpbmUuc3BsaXQoJ3wnKTtcclxuXHQgICAgXHRcdHN5bWJvbHMucHVzaCh2YWx1ZXNbMF0pO1xyXG5cdCAgICBcdH0pO1xyXG5cdCAgICBcdHJlc29sdmUoc3ltYm9scyk7XHJcblx0ICAgIH0pO1xyXG5cdH0pO1xyXG59O1xyXG5sZXQgZ2V0VHJhZGUgPSAoc3ltYm9scz0neWhvbycpID0+IHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdCAgICBsZXQgY2xpZW50ID0gcmVzdGlmeS5jcmVhdGVKc29uQ2xpZW50KHtcclxuXHQgICAgICAgIHVybDogeWFob29BcGkudXJsLFxyXG5cdCAgICAgICAgYWdlbnQ6IGZhbHNlLFxyXG5cdCAgICAgICAgdmVyc2lvbjogJ34xLjEnXHJcblx0ICAgIH0pO1xyXG5cdCAgICBsZXQgc2IgPSBzeW1ib2xzLnRvVXBwZXJDYXNlKCk7XHJcblx0ICAgIGxldCBkZCA9IGBzZWxlY3QlMjAqJTIwZnJvbSUyMHlhaG9vLmZpbmFuY2UucXVvdGVzJTIwd2hlcmUlMjBzeW1ib2wlMjBpbiUyMCglMjIke3NifSUyMiklMEElMDklMDkmZm9ybWF0PWpzb24mZW52PWh0dHAlM0ElMkYlMkZkYXRhdGFibGVzLm9yZyUyRmFsbHRhYmxlcy5lbnYmY2FsbGJhY2s9YDtcclxuXHJcblx0ICAgIGNsaWVudC5nZXQoeWFob29BcGkucGF0aCtkZCwgZnVuY3Rpb24gKGVyciwgcmVxMSwgcmVzMSwgZGF0YSkge1xyXG5cdCAgICBcdGlmIChlcnIpIHtcclxuXHQgICAgICAgIFx0cmVqZWN0KGVycik7XHJcblx0ICAgIFx0XHRyZXR1cm5cclxuXHQgICAgXHR9XHJcblx0XHQgICAgcmVzb2x2ZShkYXRhKTtcclxuXHQgICAgfSk7XHJcblx0fSk7XHJcbn07XHJcblxyXG4vL1xyXG4vLyBDb25maWd1cmUgYW5kIFN0YXJ0IFJlc3RpZnkgc2VydmVyXHJcbi8vXHJcbmxldCBzZXJ2ZXIgPSByZXN0aWZ5LmNyZWF0ZVNlcnZlcih7XHJcbiAgICBuYW1lOiAnV2Vic2VydmljZScsXHJcbiAgICB2ZXJzaW9uOiAnMC4xLjEnXHJcbn0pO1xyXG5zZXJ2ZXIudXNlKHJlc3RpZnkuYWNjZXB0UGFyc2VyKHNlcnZlci5hY2NlcHRhYmxlKSk7XHJcbnNlcnZlci51c2UocmVzdGlmeS5DT1JTKHtcclxuICAgIG9yaWdpbnM6IFtcclxuICAgICAgICAnaHR0cDovL2xvY2FsaG9zdDo5MDAwJ1xyXG4gICAgXSxcclxuICAgIGNyZWRlbnRpYWxzOiB0cnVlLFxyXG4gICAgaGVhZGVyczogWyd4LXJlcXVlc3RlZC1XaXRoJywgJ3gtZm9vJ11cclxufSkpO1xyXG5zZXJ2ZXIudXNlKHJlc3RpZnkucXVlcnlQYXJzZXIoKSk7XHJcbnNlcnZlci51c2UocmVzdGlmeS5nemlwUmVzcG9uc2UoKSk7XHJcbnNlcnZlci51c2UocmVzdGlmeS5ib2R5UGFyc2VyKCkpO1xyXG5cclxuc2VydmVyLmdldCgnL3RyYWRlLzpzeW1ib2wnLCBhc3luYyBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgbGV0IHBhcmFtcyAgPSByZXEucGFyYW1zO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBwYXJhbXMub3B0aW9ucyB8fCB7fTtcclxuICAgIGxldCB0cmFkZXMgID0ge307XHJcblxyXG4gICAgdHJ5IHtcclxuICAgIFx0aWYgKHN5bWJvbHMubGVuZ3RoID09IDApIHtcclxuICAgIFx0XHRzeW1ib2xzID0gYXdhaXQgZ2V0QWxsU3ltYm9scyhwYXJhbXMuc3ltYm9sKTtcclxuICAgIFx0fVxyXG5cclxuXHQgICAgaWYgKHN5bWJvbHMuaW5kZXhPZihwYXJhbXMuc3ltYm9sLnRvVXBwZXJDYXNlKCkpID09PSAtMSkge1xyXG5cdCAgICAgICAgbGV0IGVycm9yID0gYFN5bWJvbCBcIiR7cGFyYW1zLnN5bWJvbH1cIiBpcyBub3QgZm91bmQgaW4gTmFzZGFxYDtcclxuXHQgICAgICAgIGRyYXdsaW5lKCk7XHJcblx0ICAgICAgICBjb25zb2xlLmVycm9yKE5MICsgYFsgWCBdICR7ZXJyb3J9YCk7XHJcblx0ICAgICAgICByZXMuc2VuZCg0MDAsIHsgZXJyb3IgfSk7XHJcblx0ICAgICAgICByZXR1cm4gbmV4dCgpO1xyXG5cdCAgICB9XHJcblx0XHRsZXQgcmVzdWx0ID0gYXdhaXQgZ2V0VHJhZGUocGFyYW1zLnN5bWJvbCk7XHJcblx0XHR0cmFkZXMgPSByZXN1bHQucXVlcnk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgXHRyZXMuc2VuZCg0MDAsIHsgc3RhdHVzOmZhbHNlLCBlcnJvciB9KTtcclxuICAgICAgICByZXR1cm4gbmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcy5zZW5kKDIwMCwgeyB0cmFkZXMgfSk7XHJcbiAgICByZXR1cm4gbmV4dCgpO1xyXG59KTtcclxuXHJcbnNlcnZlci5saXN0ZW4oc2VydmVyUG9ydCwgc2VydmVySXAsICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGBMaXN0ZW5pbmcgb24gJHtzZXJ2ZXJJcH0sIHBvcnQgJHtzZXJ2ZXJQb3J0fWApO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

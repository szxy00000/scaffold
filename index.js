var express = require('express');
var http = require('http');
var path = require('path');
var url = require('url');

var app = express();

//环境变量
app.set('port', 2233);
// app.use(express.static(path.join(__dirname, 'views')))
var arr = [];
app.get('/', function(req, res) {
	var html = '';
	arr.forEach(function(one) {
		html += '<a href="http://' + one.ip + ':' + one.port + '">' + one.name + '</a><br>';
	})
	res.send(html);
});

app.get('/getBird', function(req, res) {
	var ipStr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var ip = ipStr.match(/\d+\.\d+\.\d+\.\d+/)[0];
    res.send('get')
    arr.forEach(function(one) {
    	if (one.ip === ip) {
    		return;
    	}
    })
	arr.push({
		ip: ip,
		port: req.query.port,
		name: req.query.name
	})
	setTimeout(function() {
		removeBy(arr, 'ip', ip);
	},20000)
});

// 启动及端口
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

function removeBy(arr, key, val) {
	arr.forEach(function(one) {
		if (one[key] === val) {
			arr.splice(arr.indexOf(one), 1);
		}
	})
}

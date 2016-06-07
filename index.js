var express = require('express');
var http = require('http');
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var swig = require('swig');
var checkIp = require('./lib/checkip');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//环境变量
app.set('port', 8301);
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 数组存放当前有哪些localhost被启动
var feList = [];
// feList-example:[{
//      ip: xxx,
//      port: xxx,
//      name: xxx,
//      demos: [{
//          path: desc
//      },{}]
// }]
// 
app.get('/nemo', function(req, res) {
    var html = swig.compileFile('views/index.html')({ feList: feList })
    res.send(html);
});
app.get('/demo', function(req, res) {
    var html = swig.compileFile('views/pages/demo.html')()
    res.send(html);
});
app.get('*', function(req, res) {
    res.redirect('/nemo')
})

var sendSocketMsg = function() {}
io.sockets.on('connection', function(socket) {
    sendSocketMsg = function() {
        var html = swig.compileFile('views/pages/nav.html')({ feList: feList })
        socket.emit('updateList', html);
    }
});

// 用于获取并解析已开启的localhost并放入feList
var ipTimeoutObj = {};
app.post('/getBird', function(req, res) {
    var repeat = false;
    var ipStr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var ip = ipStr.match(/\d+\.\d+\.\d+\.\d+/)[0];

    if (req.body.port && req.body.name) {
        res.send('your info is ok');
    } else {
        res.send('please send right data');
        return false;
    }

    // ip去重
    feList.forEach(function(one) {
        if (one.ip === ip) {
            repeat = true;
        }
    })

    // 把demos的key和value转成path和desc
    var demos = [];
    var j = 0;
    for (var i in req.body.demos) {
        demos[j] = {};
        demos[j].path = regPath(i);
        demos[j].desc = req.body.demos[i];
        j++;
    }

    // 添加localhost信息
    if (!repeat) {
        feList.push({
            ip: ip || req.body.ip,
            ipType: checkIp(ip),
            port: req.body.port,
            name: req.body.name,
            demos: demos
        })
        
        // socket更新页面列表
        sendSocketMsg();
    }

    // 过30秒后删除。如果没有每隔20秒收到东西说明那个localhost挂了
    clearTimeout(ipTimeoutObj[ip])
    ipTimeoutObj[ip] = setTimeout(function() {
        removeBy(feList, 'ip', ip);
        sendSocketMsg();
    }, 30000)
});

// 启动及端口
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

function removeBy(arr, key, val) {
    arr.forEach(function(one) {
        if (one[key] === val) {
            arr.splice(arr.indexOf(one), 1);
        }
    })
}

function regPath(path) {
    var first = path.toString()[0];
    if (first === '/') {
        return path.substr(1);
    } else {
        return path;
    }
}

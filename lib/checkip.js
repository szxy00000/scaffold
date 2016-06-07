// 只写了百度大厦和科技园3号楼。剩余去当前目录 按图添加
var ips = require('./ip-config.json');
module.exports = function (ip) {
	var yourIp = ip;
	var numIp = parseIntIp(ip);
	for (var ip in ips) {
		var ip0 = parseIntIp(ip.split('~')[0]);
		var ip1 = parseIntIp(ip.split('~')[1]);
		if (ip0 <= numIp && numIp <= ip1) {
			return ips[ip];
		}
	}
	return {
		location: yourIp,
		wifi: '未知'
	}
}
// 把ip转成12位整数。以便比较大小
function parseIntIp(ip) {
	var arr = ip.toString().match(/\d+/g);
	arr.forEach(function(one, key) {
		if (one.length === 0) {
			arr[key] = '000'
		}
		else if (one.length === 1) {
			arr[key] = '00' + one;
		}
		else if (one.length === 2) {
			arr[key] = '0' + one;
		}
	})
	return parseInt(arr.join(''))
}
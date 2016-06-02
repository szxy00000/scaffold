### 如何使用
在bird的入口js里加上这段代码

	// 这段代码用来向UIUE平台发送本机信息
	sendIpInfo();
	setInterval(sendIpInfo, 20000)
	function sendIpInfo() {
	    request.post('http://athena.eux.baidu.com:8301/getBird', {
	        form: {
	            name: config.name,
	            port: 4000,
	            demos: {
	                '/my-context/login.html': '登录页面',
	                '/other-module/list.html': '查看所有item的页面'
	            },
	            ip: 'xxx' // 可选项
	        }
	    })
	}

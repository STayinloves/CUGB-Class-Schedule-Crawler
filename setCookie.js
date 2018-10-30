var axios = require('axios')
var setCookie = function (callback) {
    axios.get('http://jwc.cugb.edu.cn/academic/common/security/login.jsp', {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh,en-US;q=0.8,en;q=0.6,zh-CN;q=0.4',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Host': 'jwc.cugb.edu.cn',
            'Pragma': 'no-cache',
            'Referer': 'http://jwc.cugb.edu.cn/',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
        }
    })
        .then((res) => {
            let cookie = res.headers['set-cookie'][0].substr(0, 47)
            callback.send(cookie)
        })
        .catch((err) => {
            console.log('init cookie error')
            console.log(err)
        })
}
module.exports = setCookie
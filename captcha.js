var axios = require('axios')
var getCaptcha = (cookie, callback) => {
    cookie = 'jsessionid=' + cookie.split('=')[1]
    axios.get(`http://jwc.cugb.edu.cn/academic/getCaptcha.do;${cookie}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            'Connection': 'keep-alive',
            'Referer': 'http://jwc.cugb.edu.cn/academic/common/security/login.jsp',
            'Cookie': cookie
        },
        responseType: 'arraybuffer'
    })
        .then((res) => {
            let img = new Buffer(res.data, 'binary').toString('base64')
            callback.send(img.toString())
        })
}
module.exports = getCaptcha
var axios = require('axios')
var getCaptcha = (cookie, callback) => {
    axios.get('http://202.204.105.22/academic/getCaptcha.do', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                'Connection': 'keep-alive',
                'Referer': 'http://202.204.105.22/academic',
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
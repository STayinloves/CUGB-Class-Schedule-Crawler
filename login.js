var axios = require('axios')
var login = function (q, callback) {
    var data = `j_username=${q.id}&j_password=${q.password}&j_captcha=${q.captcha}`
    axios.post('http://202.204.105.22/academic/j_acegi_security_check', data, {
            headers: {
                'Cookie': q.cookie,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh,en-US;q=0.8,en;q=0.6,zh-CN;q=0.4',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': '202.204.105.22',
                'Origin': 'http://202.204.105.22',
                'Pragma': 'no-cache',
                'Referer': 'http://202.204.105.22/academic',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            },
            maxRedirects: 0
        })
        .catch(err => {
            if (err.response.headers.location.search(/error/) !== -1)
                callback.send("<script>alert('帐号密码或验证码错误，请重试');window.location.assign('/');</script>")
            else {
                callback.append('Set-Cookie', q.cookie)
                callback.redirect('/course.html')
            }
        })
}
module.exports = login
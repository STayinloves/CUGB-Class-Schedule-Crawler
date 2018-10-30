var axios = require('axios')
var login = function (q, callback) {
    const headers = {
        'Cookie': q.cookie,
        'Accept': 'text/plain, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,en;q=0.9,en-US;q=0.8,zh-CN;q=0.7,zh-TW;q=0.6',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Length': '0',
        'Host': 'jwc.cugb.edu.cn',
        'Origin': 'http://jwc.cugb.edu.cn',
        'Pragma': 'no-cache',
        'Referer': 'http://jwc.cugb.edu.cn/academic/common/security/login.jsp',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.20 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    }


    let cookieStr = 'jsessionid=' + q.cookie.split('=')[1]
    axios.post(`http://jwc.cugb.edu.cn/academic/checkCaptcha.do;${cookieStr}?captchaCode=${q.captcha}`, null, {
        headers
    })
        .then(res => {
            if (!res.data) {
                callback.send("<script>alert('验证码错误，请刷新页面重试');window.location.assign('/');</script>")
            }
            else {
                postPassword(q, callback)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function postPassword(q, callback) {
    const headers = {
        'Cookie': q.cookie,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,en;q=0.9,en-US;q=0.8,zh-CN;q=0.7,zh-TW;q=0.6',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Length': 58,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'jwc.cugb.edu.cn',
        'Origin': 'http://jwc.cugb.edu.cn',
        'Pragma': 'no-cache',
        'Referer': 'http://jwc.cugb.edu.cn/academic/common/security/login.jsp',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }

    let cookieStr = 'jsessionid=' + q.cookie.split('=')[1]
    var data = `j_username=${q.id}&j_password=${q.password}&j_captcha=${q.captcha}`
    axios.post(`http://jwc.cugb.edu.cn/academic/j_acegi_security_check;${cookieStr}`, data, {
        headers,
        maxRedirects: 0
    })
        .catch(err => {
            if (err.response.headers.location.search(/error/) !== -1)
                callback.send("<script>alert('帐号密码错误，请刷新页面重试');window.location.assign('/');</script>")
            else {
                callback.append('Set-Cookie', err.response.headers['set-cookie'][0].substr(0, 47))
                callback.redirect('/course.html')
            }
        })
}
module.exports = login
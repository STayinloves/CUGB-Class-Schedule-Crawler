var axios = require('axios')
var iconv = require('iconv-lite')
var cheerio = require('cheerio')
var fs = require('fs')

var getRawHTML = function (r, callback) {
    if (!(r.headers && r.headers.cookie)) {
        return callback.status(401).send('No cookie');
    }

    axios.get('http://jwc.cugb.edu.cn/academic/student/currcourse/currcourse.jsdo?groupId=&moduleId=2000', {
        headers: {
            'Cookie': r.headers.cookie
        },
        responseType: 'arraybuffer'
    })
        .then((res) => {
            let data = iconv.decode(res.data, 'gbk')
            getCourses(data, callback)
        })
        .catch((err) => {
            console.log(err)
        })
}

var getCourses = function (rawHTML, callback) {
    let $ = cheerio.load(rawHTML)
    let course = {}
    let cnt = 0
    $('tr.infolist_common').each((i, item) => {
        let td = $(item).children('td');
        if (td.length === 12) {
            let current_course = course[(cnt++).toString()] = new Object()
            current_course['id'] = /\d*/.exec($(td[0]).text())[0]
            current_course['index'] = $(td[1]).text().replace(/\s+/, "")
            current_course['name'] = $(td[2]).first().text().replace(/[ \n]*/g, "")
            let teachers = []
            $(td[3]).children('a').each((i, item) => {
                teachers.push($(item).text())
            })
            current_course['teachers'] = teachers
            current_course['credit'] = $(td[4]).text().replace(/\s+/, "")
            let time = new Array()
            let timeSource = $(td[9]).find('td')
            for (let i = 0; i < timeSource.length; i += 4) {
                let newTime = {}

                let weekText = $(timeSource[i]).text()
                newTime.week = weekText.replace(/[ \n]*/g, "").replace(/、/, "-").replace(/[^-\d]/g, "").split('-').map(e => Number.parseInt(e))
                // 单双周判断
                if (newTime.week.length > 1) {
                    let a = Array.apply(null, Array(100)).map((item, i) => i + 1)
                    let limit = 0
                    if (weekText.includes('单')) {
                        limit = 1
                    } else if (weekText.includes('双')) {
                        limit = 2
                    }
                    newTime.week = a.reduce((i, j) => {
                        if (((limit === 1 && j % 2 === 1) || (limit === 2 && j % 2 === 0) || (!limit)) && j >= newTime.week[0] && j <= newTime.week[1]) {
                            return i.concat(j)
                        } else return i
                    }, [])
                }

                transDate = {
                    '一': 1,
                    '二': 2,
                    '三': 3,
                    '四': 4,
                    '五': 5,
                    '六': 6,
                    '日': 7
                }
                newTime.date = transDate[$(timeSource[i + 1]).text().replace(/[ \n]*/g, "").substr(2)]
                newTime.class = $(timeSource[i + 2]).text().replace(/[ \n]*/g, "").replace(/、/, "-").replace(/[^-\d]/g, "").split('-').map(e => {
                    if (Number.parseInt(e) === 0) return 10
                    else
                        return Number.parseInt(e)
                })
                newTime.room = $(timeSource[i + 3]).text().replace(/[ \n]*/g, "")
                if (newTime.class[0])
                    time.push(newTime)
            }
            current_course['time'] = time
        }
    })
    callback.send(JSON.stringify(course))
}
module.exports = getRawHTML
var express = require('express')
var app = express()
var login = require('./login')
var setCookie = require('./setCookie')
var getCaptcha = require('./captcha')
var bodyParser = require('body-parser')
var getCourse = require('./setCourses')
var getWeek = require('./getWeek')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

app.get('/api/setcookie', (req, res) => {
    setCookie(res)
})

app.get('/api/captcha', (req, res) => {
    getCaptcha(req.query['cookie'], res)
})

app.get('/api/getCourse', (req, res) => {
    getCourse(req, res)
})

app.get('/api/getWeek', (req, res) => {
    getWeek(req, res)
})

app.post('/login', (req, res) => {
    login(req.body, res)
})

app.use(express.static(__dirname + '/public'));

app.listen(80, () => {
    console.log('server starts at localhost:3000')
})
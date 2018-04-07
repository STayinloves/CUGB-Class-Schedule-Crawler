var axios = require("axios");
var iconv = require("iconv-lite");
var getWeek = (r, callback) => {
    if (!(r.headers && r.headers.cookie)) {
        return callback.status(401).send('No cookie');
    }
    axios
        .get("http://202.204.105.22/academic/listLeft.do", {
            responseType: "arraybuffer"
        })
        .then(res => {
            callback.send(/第(\d)*周/.exec(iconv.decode(res.data, "gbk"))[0]);
        });
};
module.exports = getWeek;

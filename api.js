const request = require('request')
module.exports.getUser = (accessToken, cb) => {
    request({
        url: "https://blue.openapi.sys.dom/openapi/port/v1/users/me",
        headers: {
            authorization: "bearer " + accessToken
        },
        json: true
    }, (err, response, body) => {
        cb(err, body)
    });
}
module.exports.getInstruments = (accessToken, cb) => {
    request({
        url: "https://blue.openapi.sys.dom/openapi/ref/v1/instruments/?$top=10&AssetTypes=Stock",
        headers: {
            authorization: "bearer " + accessToken
        },
        json: true
    }, (err, response, body) => {
        cb(err, body.Data)
    });
}
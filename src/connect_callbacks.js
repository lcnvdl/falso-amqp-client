const connect = require("./connect");
const Connection = require("./amqp/connection_callbacks");

module.exports = (url, callback, customSettings) => {
    connect(url, customSettings).then(connection => {
        callback && callback(null, new Connection(connection));
    }, err => {
        callback && callback(err, null);
    });
};
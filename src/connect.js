const SocketClientLayer = require("./sockets/client-io.layer");
const Connection = require("./amqp/connection");

module.exports = async (url, callback, settings) => {
    url = correctUrl(url);
    settings = settings || {};

    const { timeout = 15000 } = settings;

    const client = new SocketClientLayer();

    client.connect(url, timeout).then(() => {
        const connection = new Connection(client);
        callback(null, connection);
    }, err => {
        callback(err, null);
    });
};

function correctUrl(url) {
    let finalUrl;
    
    if (url.indexOf("amqp://") === 0) {
        finalUrl = "ws" + url.substr(url.indexOf(":"));
    }
    else if (url.indexOf("amqps://") === 0) {
        finalUrl = "wss" + url.substr(url.indexOf(":"));
    }
    else {
        finalUrl = url;
    }

    return finalUrl;
}
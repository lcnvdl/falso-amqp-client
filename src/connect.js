const SocketClientLayer = require("./sockets/client-io.layer");
const Connection = require("./amqp/connection");
const { correctUrl } = require("./helpers/url.helper");

module.exports = async (url, customSettings) => {
    if (typeof url !== 'string') {
        url = url[0];
    }
    
    url = correctUrl(url);
    customSettings = customSettings || {};

    const { timeout = 15000 } = customSettings;

    const client = new SocketClientLayer();

    await client.connect(url, timeout);
    return new Connection(client);
};
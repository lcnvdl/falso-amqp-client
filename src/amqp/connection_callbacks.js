const Channel = require("./channel_callbacks");

class Connection {
    constructor(proxy) {
        this._proxy = proxy;
    }

    createChannel(callback) {
        this._proxy.createChannel().then(channel => {
            callback && callback(null, new Channel(channel));
        }, err => {
            callback && callback(err);
        });
    }

    close() {
        this._proxy.close();
    }
}

module.exports = Connection;
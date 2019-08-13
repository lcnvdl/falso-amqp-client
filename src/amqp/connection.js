const Communication = require("./communication");
const Channel = require("./channel");

class Connection {
    constructor(socketClient) {
        this.communication = new Communication(socketClient);
    }

    createChannel(callback) {
        this.communication.sendAndWait("new-channel", {}).then(() => {
            const channel = new Channel(this.communication);
            callback(null, channel);
        }, err => {
            callback(err);
        });
    }
}

module.exports = Connection;
const Communication = require("./communication");
const Channel = require("./channel");

class Connection {
    constructor(socketClient) {
        this.communication = new Communication(socketClient);
    }

    async createChannel() {
        await this.communication.sendAndWait("new-channel", {});
        return new Channel(this.communication);
    }

    close() {
        this.communication.close();
    }
}

module.exports = Connection;
const Protocol = require("../protocols/protocol-v1");
const uuid = require("uuid/v1");

class Communication {
    /**
     * @param {*} socketClient Socket client
     * @param {*} [settings] Settings
     */
    constructor(socketClient, settings) {
        this.socket = socketClient;
        this.waiters = {};
        this.timeout = (settings ? settings.timeout : null) || 30000;

        this.socket.onMessage(msg => {
            const { cmd, data, msgID } = Protocol.parse(msg);

            let waiter = this.waiters[msgID];
            if (waiter) {
                waiter.resolve({ cmd, data, msgID });
                delete this.waiters[msgID];
            }
        });

        this.socket.onClose(() => {
            Object.values(this.waiters).forEach(w => w.reject("Connection lost"));
            this.waiters = {};
        });
    }

    send(cmd, content) {
        const packageToSend = Protocol.prepare(cmd, content);
        this.socket.send(packageToSend);
    }

    sendAndWait(cmd, content) {
        return new Promise((resolve, reject) => {
            const id = uuid();
            const packageToSend = Protocol.prepare(cmd, content, id);

            this.waiters[id] = {
                timeout: this.timeout,
                timestamp: new Date(),
                id: id,
                resolve: data => resolve(data),
                reject: err => reject(err)
            };

            setTimeout(() => {
                let waiter = this.waiters[id];
                if (waiter) {
                    waiter.reject("Timeout");
                    delete this.waiters[id];
                }
            }, this.timeout);

            this.socket.send(packageToSend);
        });
    }

    close() {
        this.socket.close();
    }
}

module.exports = Communication;

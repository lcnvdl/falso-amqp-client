const Protocol = require("../protocols/protocol-v1");

class Channel {
    constructor(communication) {
        this.communication = communication;

        this.consumeCallbacks = {};

        this.communication.socket.onMessage(msg => {
            const { cmd, data } = Protocol.parse(msg);

            if (cmd === "from-queue") {
                const { queue, content } = data;
                const callback = this.consumeCallbacks[queue];

                if (callback) {
                    callback({
                        content
                    });
                }
            }
        });
    }

    async prefetch(number) {
        await this.communication.sendAndWait("prefetch", { number });
    }

    async assertQueue(name, settings) {
        settings = settings || {};
        await this.communication.sendAndWait("assert-queue", { name, settings });
    }

    async assertExchange(name, type, settings) {
        settings = settings || {};
        await this.communication.sendAndWait("assert-exchange", { name, type, settings });
    }

    async bindQueue(queueName, exchangeName, routingKey) {
        await this.communication.sendAndWait("bind-queue", { queueName, exchangeName, routingKey });
    }

    async publish(exchangeName, routingKey, buffer, settings) {
        const content = buffer.toString();
        await this.communication.sendAndWait("publish", { exchangeName, routingKey, content, settings });
    }

    async consume(queueName, callback, settings) {
        settings = settings || {};
        this.consumeCallbacks[queueName] = callback;
        await this.communication.sendAndWait("consume", { queueName, settings });
    }

    close() {
        this.communication.close();
    }
}

module.exports = Channel;

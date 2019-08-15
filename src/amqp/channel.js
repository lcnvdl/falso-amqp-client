const Protocol = require("../protocols/protocol-v1");
const ChannelHistory = require("./channel-history");

class Channel {
    constructor(communication) {
        this.communication = communication;

        this._history = new ChannelHistory();

        this.consumeCallbacks = {};

        let isRecovering = false;

        this.communication.socket.onReconnect(() => {
            this.communication.send("ping", {});
        });

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
            else if (cmd === "need-channel") {
                if (!isRecovering) {
                    console.info("Recovering channel...");
                    this._recover().then(() => isRecovering = false, err => isRecovering = false);
                }
            }
        });
    }

    async prefetch(number) {
        await this.communication.sendAndWait("prefetch", { number });
        this._history.prefetch = number;
    }

    async assertQueue(name, settings) {
        settings = settings || {};
        await this.communication.sendAndWait("assert-queue", { name, settings });
        this._history.queueAssertions.push({ name, settings });
        return { queue: name };
    }

    async assertExchange(name, type, settings) {
        settings = settings || {};
        await this.communication.sendAndWait("assert-exchange", { name, type, settings });
        this._history.exchangeAssertions.push({ name, type, settings });
        return { exchange: name };
    }

    async bindQueue(queueName, exchangeName, routingKey) {
        await this.communication.sendAndWait("bind-queue", { queueName, exchangeName, routingKey });
        this._history.bindings.push({ queueName, exchangeName, routingKey });
    }

    async sendToQueue(queueName, buffer, settings) {
        settings = settings || {};
        const content = buffer.toString();
        await this.communication.sendAndWait("send-to-queue", { queueName, content, settings });
    }

    async publish(exchangeName, routingKey, buffer, settings) {
        const content = buffer.toString();
        await this.communication.sendAndWait("publish", { exchangeName, routingKey, content, settings });
    }

    async consume(queueName, callback, settings) {
        settings = settings || {};
        this.consumeCallbacks[queueName] = callback;
        await this.communication.sendAndWait("consume", { queueName, settings });
        this._history.consuming.push({ queueName, callback, settings });
    }

    close() {
        this.communication.close();
    }

    async _recover() {
        await this.communication.sendAndWait("new-channel", {});

        let history = this._history.clone();

        this._history.clear();

        if (history.prefetch !== null) {
            await this.prefetch(history.prefetch);
        }

        for (let i = 0; i < history.exchangeAssertions.length; i++) {
            await this.assertExchange(
                history.exchangeAssertions[i].name,
                history.exchangeAssertions[i].type,
                history.exchangeAssertions[i].settings);
        }

        for (let i = 0; i < history.queueAssertions.length; i++) {
            await this.assertQueue(
                history.queueAssertions[i].name,
                history.queueAssertions[i].settings);
        }

        for (let i = 0; i < history.bindings.length; i++) {
            await this.bindQueue(
                history.bindings[i].queueName,
                history.bindings[i].exchangeName,
                history.bindings[i].routingKey);
        }

        for (let i = 0; i < history.queueAssertions.length; i++) {
            await this.consume(
                history.consuming[i].queueName,
                history.consuming[i].callback,
                history.consuming[i].settings);
        }
    }
}

module.exports = Channel;

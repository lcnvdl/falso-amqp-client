/** @typedef {import("./communication")} Communication*/

const Protocol = require("../protocols/protocol-v1");
const ChannelHistory = require("./channel-history");

class Channel {
    /**
     * Constructor.
     * @param {Communication} communication Communication.
     */
    constructor(communication) {
        this.communication = communication;
        this._history = new ChannelHistory();

        this.consumeCallbacks = {};

        let isRecovering = false;
        let isConnected = false;

        this.communication.socket.onConnect(() => {
            if (!isConnected) {
                // console.log("Connected to the server");
                isConnected = true;
            }
            else {
                // console.log("Ping sent (reason: reconnection)");
                this.communication.send("ping", {});
            }
        });

        this.communication.socket.onReconnect(() => {
            // console.log("Ping sent (reason: reconnection)");
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
                    isRecovering = true;

                    this._recover().then(() => {
                        isRecovering = false;
                    }, err => {
                        isRecovering = false;
                        console.warn("Error recovering channel", err);
                    });
                }
            }
            else if (cmd === "error") {
                console.error(data.message);
                console.log("Details", data);
            }
            else if (cmd === "warning") {
                console.warning(data.message);
            }
        });
    }

    async prefetch(number) {
        await this.communication.sendAndWait("prefetch", { number });
        this._history.prefetch = number;
    }

    async assertQueue(name, settings) {
        if (!name) {
            throw new Error("Assert queue: Missing queue name");
        }

        settings = settings || {};

        const { data: status } = await this.communication.sendAndWait("assert-queue", { name, settings });

        if (name === "" && (!status.queue || status.queue === "")) {
            throw new Error("Unknown queue name.");
        }

        this._history.queueAssertions.push({ name: status.queue, settings });
        return status;
    }

    async assertExchange(name, type, settings) {
        settings = settings || {};
        await this.communication.sendAndWait("assert-exchange", { name, type, settings });
        this._history.exchangeAssertions.push({ name, type, settings });
        return { exchange: name };
    }

    async bindQueue(queueName, exchangeName, routingKey) {
        if (!queueName) {
            throw new Error("Bind queue: Missing queue name");
        }

        await this.communication.sendAndWait("bind-queue", { queueName, exchangeName, routingKey });
        this._history.bindings.push({ queueName, exchangeName, routingKey });
    }

    async sendToQueue(queueName, buffer, settings) {
        if (!queueName) {
            throw new Error("Send to queue: Missing queue name");
        }

        settings = settings || {};
        const content = buffer.toString();
        await this.communication.sendAndWait("send-to-queue", { queueName, content, settings });
    }

    async publish(exchangeName, routingKey, buffer, settings) {
        const content = buffer.toString();
        await this.communication.sendAndWait("publish", { exchangeName, routingKey, content, settings });
    }

    async consume(queueName, callback, settings) {
        if (!queueName) {
            throw new Error("Consume: Missing queue name");
        }

        settings = settings || {};

        //  Patch: when you restore a "consume", I don't know why but the new callback doesn't work, so we keep the older one
        if (typeof callback === "function") {
            this.consumeCallbacks[queueName] = callback;
        }

        await this.communication.sendAndWait("consume", { queueName, settings });

        this._history.consuming.push({ queueName, callback, settings });
    }

    ack(message, allToUp) {
        this.communication.send("ack", { id: message.id, allToUp });
    }

    nack(message, allToUp, requeue) {
        this.communication.send("nack", { id: message.id, allToUp, requeue });
    }

    close() {
        this.communication.close();
    }

    async _recover() {
        console.log("Recovering...");

        await this.communication.sendAndWait("new-channel", {});

        const history = this._history.clone();

        this._history.clear();

        if (history.prefetch !== null) {
            console.log("Recover: prefetch", history.prefetch);
            await this.prefetch(history.prefetch);
        }

        for (let i = 0; i < history.exchangeAssertions.length; i++) {
            console.log("Recover: assert exchange", history.exchangeAssertions[i]);
            await this.assertExchange(
                history.exchangeAssertions[i].name,
                history.exchangeAssertions[i].type,
                history.exchangeAssertions[i].settings);
        }

        for (let i = 0; i < history.queueAssertions.length; i++) {
            console.log("Recover: assert queue", history.queueAssertions[i]);
            await this.assertQueue(
                history.queueAssertions[i].name,
                history.queueAssertions[i].settings);
        }

        for (let i = 0; i < history.bindings.length; i++) {
            console.log("Recover: bind", history.bindings[i]);
            await this.bindQueue(
                history.bindings[i].queueName,
                history.bindings[i].exchangeName,
                history.bindings[i].routingKey);
        }

        for (let i = 0; i < history.consuming.length; i++) {
            console.log("Recover: consume", history.consuming[i]);
            await this.consume(
                history.consuming[i].queueName,
                history.consuming[i].callback,
                history.consuming[i].settings);
        }

        console.log("Recovering completed");
    }
}

module.exports = Channel;

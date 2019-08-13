const EventEmitter = require("events");

class SocketClientLayer {

    constructor() {
        this.events = new EventEmitter();
        this.connections = {};
    }

    /**
     * @returns {string} Name of the socket layer.
     */
    get name() {
        throw new Error("Abstract property");
    }

    /**
     * Connectes to a server
     * @param {string} url Server address
     * @param {number} [timeout] Timeout
     */
    connect(url, timeout) {
        return Promise.reject("Abstract method");
    }

    /**
     * Sends a message
     * @param {string} msg Message
     */
    send(msg) {
        throw new Error("Abstract method");
    }

    close() {
        throw new Error("Abstract method");
    }

    triggerOnMessage(msg) {
        this.events.emit("message", msg);
    }

    onMessage(callback) {
        this.events.on("message", callback);
    }

    triggerOnConnect(socket) {
        this.events.emit("connect", socket);
    }

    onConnect(callback) {
        this.events.on("connect", callback);
    }

    triggerOnClose() {
        this.events.emit("close", this);
    }

    onClose(callback) {
        this.events.on("close", callback);
    }
}

module.exports = SocketClientLayer;
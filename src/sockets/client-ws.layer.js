const SocketClientLayer = require("./socket-client-layer");

const WebSocket = require("ws");

class ClientWSLayer extends SocketClientLayer {

    constructor() {
        super();
        this.socket = null;
    }

    get name() {
        return "client ws layer";
    }

    connect(url, timeout) {
        let p = new Promise((resolve, reject) => {
            let socket = new WebSocket(url);
            let finished = false;

            socket.once("open", () => {
                finished = true;
                this._attach(socket);
                this.triggerOnConnect(socket);
                resolve();
            });

            socket.once("error", err => {
                if (!finished) {
                    finished = true;
                    reject(err);
                }
            });

            if (timeout !== 0) {
                setTimeout(() => {
                    if (!finished) {
                        finished = true;
                        reject("Timeout");
                    }
                }, timeout);
            }
        });

        return p;
    }

    send(msg) {
        this.socket.send(msg);
    }

    close() {
        this.socket.terminate();
        this.socket = null;
    }

    _attach(socket) {

        this.socket = socket;

        socket.on("open", () => {
            this.triggerOnConnect(this.socket);
        });

        socket.on("message", msg => {
            this.triggerOnMessage(msg);
        });

        socket.on("close", () => {
            this.triggerOnClose();
        });
    }
}

module.exports = ClientWSLayer;

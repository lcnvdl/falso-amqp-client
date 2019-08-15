class Channel {
    constructor(proxy) {
        this._proxy = proxy;
    }

    prefetch(number, callback) {
        this._proxy.prefetch(number).then(() => {
            callback && callback(null, true);
        }, err => {
            callback && callback(err);
        });
    }

    assertQueue(name, settings, callback) {
        this._proxy.assertQueue(name, settings).then(result => {
            callback && callback(null, result);
        }, err => {
            callback && callback(err);
        });
    }

    assertExchange(name, type, settings, callback) {
        this._proxy.assertExchange(name, type, settings).then(result => {
            callback && callback(null, result);
        }, err => {
            callback && callback(err);
        });
    }

    bindQueue(queueName, exchangeName, routingKey, callback) {
        this._proxy.bindQueue(queueName, exchangeName, routingKey).then(() => {
            callback && callback(null, true);
        }, err => {
            callback && callback(err);
        });
    }

    sendToQueue(queueName, buffer, settings, callback) {
        this._proxy.sendToQueue(queueName, buffer, settings).then(result => {
            callback && callback(null, result);
        }, err => {
            callback && callback(err);
        });
    }

    publish(exchangeName, routingKey, buffer, settings, callback) {
        this._proxy.publish(exchangeName, routingKey, buffer, settings).then(() => {
            callback && callback(null, true);
        }, err => {
            callback && callback(err);
        });
    }

    consume(queueName, callback, settings, statusCallback) {
        this._proxy.consume(queueName, callback, settings).then(() => {
            statusCallback && statusCallback(null, true);
        }, err => {
            statusCallback && statusCallback(err);
        });
    }

    close() {
        this._proxy.close();
    }
}

module.exports = Channel;
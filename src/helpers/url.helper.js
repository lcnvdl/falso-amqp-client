module.exports = {
    correctUrl(url) {
        let finalUrl;

        if (url.indexOf("amqp://") === 0) {
            finalUrl = "ws" + url.substr(url.indexOf(":"));
        }
        else if (url.indexOf("amqps://") === 0) {
            finalUrl = "wss" + url.substr(url.indexOf(":"));
        }
        else {
            finalUrl = url;
        }

        return finalUrl;
    }
};

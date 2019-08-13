class ChannelHistory {
    constructor() {
        this.clear();
    }

    clear() {
        this.prefetch = null;
        this.queueAssertions = [];
        this.exchangeAssertions = [];
        this.bindings = [];
        this.consuming = [];
    }

    clone() {
        let clone = new ChannelHistory();
        clone.prefetch = this.prefetch;
        clone.queueAssertions = JSON.parse(JSON.stringify(this.queueAssertions));
        clone.exchangeAssertions = JSON.parse(JSON.stringify(this.exchangeAssertions));
        clone.bindings = JSON.parse(JSON.stringify(this.bindings));
        clone.consuming = JSON.parse(JSON.stringify(this.consuming));

        return clone;
    }
}

module.exports = ChannelHistory;
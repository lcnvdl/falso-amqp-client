const { expect } = require("chai");
const ChannelHistory = require("../src/amqp/channel-history");

describe("channel-history", () => {
    describe("Import", () => {
        it("import should be ok", () => {
            expect(ChannelHistory).to.be.ok;
        });

        it("instance should be ok", () => {
            expect(new ChannelHistory()).to.be.ok;
        });
    });

    describe("ChannelHistory", () => {

        //  TODO    This tests are not testing for expected results. Fix.

        let instance = new ChannelHistory();

        it("clear should be ok", () => {
            instance.clear();
        });

        it("clone should be ok", () => {
            instance.clone();
        });
    });
});
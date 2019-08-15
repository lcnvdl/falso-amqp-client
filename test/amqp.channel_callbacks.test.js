const { expect } = require("chai");
const Channel = require("../src/amqp/channel_callbacks");

describe("channel_callbacks", () => {
    it("import should be ok", () => {
        expect(Channel).to.be.ok;
    });
});
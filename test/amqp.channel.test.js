const { expect } = require("chai");
const Channel = require("../src/amqp/channel");

describe("channel", () => {
    it("import should be ok", () => {
        expect(Channel).to.be.ok;
    });
});
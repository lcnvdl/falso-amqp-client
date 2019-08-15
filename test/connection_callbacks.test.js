const { expect } = require("chai");
const Connection = require("../src/amqp/connection_callbacks");

describe("connection_callbacks", () => {
    it("import should be ok", () => {
        expect(Connection).to.be.ok;
    });
});
const { expect } = require("chai");
const Connection = require("../src/amqp/connection");

describe("connection", () => {
    it("import should be ok", () => {
        expect(Connection).to.be.ok;
    });
});
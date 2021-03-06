const { expect } = require("chai");
const Connection = require("../src/amqp/connection");
const socketStub = require("./Stubs/socket.stub");

/** @type {Connection} */
let instance = null;

describe("Connection", () => {
    beforeEach(() => {
        instance = new Connection(socketStub);
    });

    describe("#constructor", () => {
        it("should work fine", () => {
            expect(instance).to.be.ok;
        });
    });
});

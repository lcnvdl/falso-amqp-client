const { expect } = require("chai");
const Communication = require("../src/amqp/communication");
const socketStub = require("./Stubs/socket.stub");

/** @type {Communication} */
let instance = null;

describe("Communication", () => {
    beforeEach(() => {
        instance = new Communication(socketStub);
    });

    describe("#constructor", () => {
        it("should work fine", () => {
            expect(instance).to.be.ok;
        });
    });
});

const { expect } = require("chai");
const ProtocolV1 = require("../src/protocols/protocol-v1");

/** @type {ProtocolV1} */
let instance = null;

describe("ProtocolV1", () => {
    beforeEach(() => {
        instance = new ProtocolV1();
    });

    describe("#constructor", () => {
        it("should work fine", () => {
            expect(instance).to.be.ok;
        });
    });
});

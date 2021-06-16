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

    describe("#prepare", () => {
        it("should work fine", () => {
            const expected = "b|cGluZywyfHt9";
            const result = ProtocolV1.prepare("ping", {}, 2);
            expect(result).to.be.ok;
            expect(result).to.equals(expected);
        });

        it("should work fine with data", () => {
            const expected = "b|cGluZywzfHsibWVzc2FnZSI6ImhpISJ9";
            const result = ProtocolV1.prepare("ping", { message: "hi!" }, 3);
            expect(result).to.be.ok;
            expect(result).to.equals(expected);
        });
    });

    describe("#parse", () => {
        it("should work fine - Base64", () => {
            const message = "b|cGluZywyfHt9";
            const result = ProtocolV1.parse(message);
            expect(result).to.be.ok;
            expect(result.cmd).to.equals("ping");
            expect(result.msgID).to.equals("2");
            expect(result.data).to.be.deep.equal({});
        });

        it("should work fine - Base64 with data", () => {
            const message = "b|cGluZywzfHsibWVzc2FnZSI6ImhpISJ9";
            const result = ProtocolV1.parse(message);
            expect(result).to.be.ok;
            expect(result.cmd).to.equals("ping");
            expect(result.msgID).to.equals("3");
            expect(result.data).to.be.deep.equal({ message: "hi!" });
        });

        it("should work fine - NO Base64", () => {
            const message = "ping,1|{}";
            const result = ProtocolV1.parse(message);
            expect(result).to.be.ok;
            expect(result.cmd).to.equals("ping");
            expect(result.msgID).to.equals("1");
            expect(result.data).to.be.deep.equal({});
        });
    });
});

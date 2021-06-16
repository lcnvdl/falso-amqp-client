const { expect } = require("chai");
const { correctUrl } = require("../src/helpers/url.helper");

describe("url.helper", () => {
    describe("correctUrl", () => {
        it("should work fine", () => {
            const result = correctUrl("amqp://localhost");
            expect(result).to.be.equal("ws://localhost");
        });
    });
});

const { expect } = require("chai");
const connect = require("../src/connect");

describe("connect", () => {
    it("import should be ok", () => {
        expect(connect).to.be.ok;
    });
});
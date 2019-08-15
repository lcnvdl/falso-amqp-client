const { expect } = require("chai");
const connect = require("../src/connect_callbacks");

describe("connect_callbacks", () => {
    it("import should be ok", () => {
        expect(connect).to.be.ok;
    });
});
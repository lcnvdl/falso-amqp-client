const { expect } = require("chai");
const Channel = require("../src/amqp/channel");
const socketStub = require("./Stubs/socket.stub");

/** @type {Channel} */
let instance = null;

const communicationStub = {
    socket: socketStub,
    sendAndWait: function () {
        return Promise.resolve({ data: { queue: "name" } });
    }
};

describe("Channel", () => {
    beforeEach(() => {
        instance = new Channel(communicationStub);
    });

    describe("#constructor", () => {
        it("should work fine", () => {
            expect(instance).to.be.ok;
        });
    });

    describe("#assertQueue", () => {
        it("should fail if queue name is undefined", async () => {
            let error = null;
            await instance.assertQueue(undefined, {}).catch(err => error = err);
            expect(error).to.not.be.null;
        });

        it("should NOT fail if queue name is an empty string", async () => {
            let error = null;
            await instance.assertQueue("", {}).catch(err => error = err);
            expect(error).to.be.null;
        });
    });
});

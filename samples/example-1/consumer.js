const amqp = require("../../callbacks_api");

amqp.connect("ws://localhost:5682", function (err, connection) {
    if (err) {
        return console.error(err);
    }

    console.log("Connected");
    connection.createChannel(function (err1, channel) {
        if (err1) {
            return console.error(err1);
        }

        console.log("Channel created");

        channel.prefetch(1);
        channel.assertExchange("testing", "fanout");
        channel.assertQueue("testing-q1");
        channel.assertQueue("testing-q2");
        channel.bindQueue("testing-q1", "testing", "");
        channel.bindQueue("testing-q2", "testing", "");

        channel.consume("testing-q1", msg => {
            console.log("Queue 1", msg.content);
        });

        channel.consume("testing-q2", msg => {
            console.log("Queue 2", msg.content);
        });
    });
});
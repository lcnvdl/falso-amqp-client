const amqp = require("./index");

amqp("ws://localhost:8789", function (err, connection) {
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

        console.log("Sending message");
        channel.publish("testing", "", Buffer.from("hola mundo!"));

        setInterval(() => {
            console.log("Sending message");
            channel.publish("testing", "", Buffer.from("hola mundo!"));
        }, 10000);
    });
});
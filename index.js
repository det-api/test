const express = require("express");
const mqtt = require("mqtt");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server });

const client = mqtt.connect(
  "mqtts://f98a3730d6c3454b8cbf7d6c4f13cb69.s1.eu.hivemq.cloud",
  {
    username: "lmo-12",
    password: "Asdffdsa-4580",
  }
);

let sub_topic = "general";

const connect = () => {
  client.subscribe("#", { qos: 0 }, function (err) {
    if (err) {
      console.log("An error occurred while subscribing");
    } else {
      console.log("Subscribed successfully to " + sub_topic.toString());
    }
  });
};

let num = 0;

client.on("connect", connect);

client.on("message", async (topic, message) => {
  
    wss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
          num +=1
          client.send(num);
        }
      });
});

// wss.on("connection", function (ws) {
//   //ws senting
//   ws.on("message", function (data) {
//     // client.publish("general" , data.toString(),{ qos: 0, retain: false })
//     console.log("wk");
//   });
// });

server.listen(5000, () => console.log("complete"));

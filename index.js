const WebSocket = require("ws");
//const dotenv = require("dotenv");
const mongoose = require("mongoose");
require("./mongoose");
//dotenv.config(); // Load environment variables from .env file

const transactionSchema = new mongoose.Schema({
  method: String,
  jsonrpc: String,
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: { default: Date },

  // Add more fields as needed
});

const Transaction = mongoose.model("Transaction", transactionSchema);

const providerUrl = [
  "wss://ws-nd-670-805-030.p2pify.com/8c9486bb286aa5fc6b728d618aef44bb",
  "wss://ws-nd-277-426-309.p2pify.com/79acd0baff450f0507e72e0e73dbf7c5",
];

const Web3 = providerUrl.map((url) => new WebSocket(url));
Web3.map((ws) => {
  ws.on("open", () => {
    console.log("Connected to WebSocket endpoint");

    const subscribePayload = JSON.stringify({
      method: "eth_subscribe",
      params: ["newPendingTransactions"],
      id: 1,
    });

    ws.send(subscribePayload);
  });

  ws.on("message", async (data) => {
    const response = JSON.parse(data);

    try {
      if (response.method === "eth_subscription" && response.params.result) {
        const hash = response.params.result;

        // Create a new transaction document
        const transaction = {
          method: response.method,
          jsonrpc: response.jsonrpc,
          hash: response.params.result,
        };

        // Save the transaction to the database
        await Transaction.create(transaction);

        console.log("Transaction saved:", hash);
      }
    } catch (e) {
      console.log(e.message);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

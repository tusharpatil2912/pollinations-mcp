#!/usr/bin/env node

// This is an ES module entry point for the Pollinations MCP server
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { startMcpServer } from "./src/index.js";
import cors from "cors";
import express from "express";

// Start the MCP server


// const express = require('express'); // Import the express module
const app = express(); // Create an Express application instance
const port = 3000; // Define the port number for the server

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  credentials: true
}));

let transport = null;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  const server = await startMcpServer();
  server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`); // Log a message when the server starts
});